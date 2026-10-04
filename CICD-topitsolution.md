# Storefront CI/CD — GitHub Actions → cPanel (`topitsolution.com`)

`frontend` repo-তে `main`-এ push করলেই storefront নিজে থেকে build হয়ে cPanel-এ উঠবে।

> **এটা শুধু এই repo-র (`electrode-frontend`) জন্য।** Backend আর admin-এর CI/CD তাদের নিজের repo-তে
> নিজের ফাইলে। এখানে push করলে শুধু storefront deploy হবে — backend বা admin ছোঁবে না।
>
> এতে আসল domain আছে — client-এর জন্য clone করার সময় এই ফাইল মুছে দেবেন।

---

## ০. কীভাবে কাজ করবে

```
git push (main)
   └─ GitHub Actions (Linux runner)
        ├─ npm ci → npm test
        ├─ npm run build:cpanel          ← storefront.tar.gz (NEXT_PUBLIC_API_BASE_URL build-এ বসে)
        ├─ hashed-module guard           ← "Cannot find module '<pkg>-<16 hex>'" bug ধরা
        ├─ scp → ~/deploy/storefront.tar.gz
        └─ ssh → নতুন folder-এ extract → folder swap → restart
                 └─ https://topitsolution.com যাচাই
```

**কেন cPanel-এর "Git Version Control" নয়:** ওটা source টানে, তারপর `next build` cPanel-এই চালাতে হয়।
`next build` shared plan-এর RAM আর process limit-এ টেকে না। Build GitHub-এর machine-এ হয়, cPanel শুধু
তৈরি archive পায় — হাতে যা করছেন তাই।

---

## ১. একবারের setup — SSH key

> **Backend-এর জন্য key আগেই বানিয়ে থাকলে (`server/CICD-topitsolution.md` §১) সেটাই চলবে** —
> §১.১–১.২ বাদ দিয়ে সরাসরি §২-এ যান। একই key, একই cPanel; শুধু secret এই repo-তে আলাদা বসাতে হবে।

### ১.১ PC-তে key (Git Bash)

```bash
ssh-keygen -t ed25519 -C "github-deploy-topit" -f ~/.ssh/topit_deploy -N ""
```

### ১.২ Public key cPanel-এ (cPanel → Terminal)

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo 'ssh-ed25519 AAAA...topit_deploy.pub-এর পুরো লাইন...' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

পেস্টে গোলমাল হলে **cPanel → SSH Access → Import Key → Manage → Authorize**।

### ১.৩ PC থেকে পরীক্ষা

```bash
ssh -i ~/.ssh/topit_deploy -p 22 CPUSER@HOST 'echo ok'
```

`HOST` = FileZilla-তে SFTP-র host। domain Cloudflare-এর পেছনে থাকলে server-এর IP/hostname দিন।

---

## ২. GitHub-এ secret আর variable — শুধু `electrode-frontend` repo-তে

**GitHub → `AbdulAzizSajib/electrode-frontend` → Settings → Secrets and variables → Actions**

**Secrets** ট্যাব:

| Secret | মান |
|---|---|
| `SSH_HOST` | §১.৩-এর `HOST` |
| `SSH_PORT` | `22` |
| `SSH_USER` | cPanel username |
| `SSH_PRIVATE_KEY` | `~/.ssh/topit_deploy`-এর পুরো লেখা, BEGIN থেকে END পর্যন্ত |
| `SSH_KNOWN_HOSTS` | `ssh-keyscan -p 22 HOST`-এর output |

**Variables** ট্যাব (secret নয় — এটা bundle-এ খোলাখুলি বসে, লুকানোর কিছু নেই):

| Variable | মান |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.topitsolution.com/api/v1` |

`gh` CLI দিয়ে (Git Bash, **`frontend/` folder থেকে** — তাহলে শুধু এই repo-তে বসবে):

```bash
gh secret set SSH_HOST        --body "HOST"
gh secret set SSH_PORT        --body "22"
gh secret set SSH_USER        --body "CPUSER"
gh secret set SSH_PRIVATE_KEY < ~/.ssh/topit_deploy
ssh-keyscan -p 22 HOST | gh secret set SSH_KNOWN_HOSTS
gh variable set NEXT_PUBLIC_API_BASE_URL --body "https://api.topitsolution.com/api/v1"
```

> **`REVALIDATE_SECRET` এখানে লাগবে না।** ওটা runtime-এর — cPanel-এর Setup Node.js App-এ আগেই
> দেওয়া আছে, folder swap-এ হারায় না (cPanel ওটা app-এর config-এ রাখে, folder-এ নয়)।

---

## ৩. Workflow ফাইল

`frontend/.github/workflows/deploy.yml` বানান:

```yaml
name: Deploy storefront

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: deploy-storefront
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 25

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci

      - run: npm test

      - name: Build archive
        run: npm run build:cpanel
        env:
          NEXT_PUBLIC_API_BASE_URL: ${{ vars.NEXT_PUBLIC_API_BASE_URL }}

      # next build এই bug-এ exit 0 দেয় — তাই আলাদা করে খোঁজা।
      # DEPLOY-topitsolution.md §৪.২ আর next.config.ts-এর transpilePackages মন্তব্য দেখুন।
      - name: Hashed external module guard
        run: |
          if grep -rhoE --include='*.js' 'a\.x\("[^"]*-[0-9a-f]{16}"' .next/server | sort -u | grep .; then
            echo "::error::Hashed external module name in server chunks — add the package to transpilePackages"
            exit 1
          fi

      - name: SSH setup
        run: |
          mkdir -p ~/.ssh && chmod 700 ~/.ssh
          printf '%s\n' "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          printf '%s\n' "${{ secrets.SSH_KNOWN_HOSTS }}" > ~/.ssh/known_hosts
          cat > ~/.ssh/config <<EOF
          Host cpanel
            HostName ${{ secrets.SSH_HOST }}
            Port ${{ secrets.SSH_PORT }}
            User ${{ secrets.SSH_USER }}
            IdentityFile ~/.ssh/deploy_key
            IdentitiesOnly yes
            ServerAliveInterval 30
          EOF

      - name: Upload
        run: |
          ssh cpanel 'mkdir -p ~/deploy'
          scp storefront.tar.gz cpanel:deploy/storefront.tar.gz

      - name: Release
        run: |
          ssh cpanel 'bash -s' <<'REMOTE'
          set -eo pipefail
          APP="$HOME/storefront"
          NEW="$HOME/storefront.new"
          OLD="$HOME/storefront.old"

          rm -rf "$NEW" && mkdir -p "$NEW"
          tar -xzf "$HOME/deploy/storefront.tar.gz" -C "$NEW"
          rm -f "$HOME/deploy/storefront.tar.gz"
          mkdir -p "$NEW/tmp"
          test -f "$NEW/server.js" || { echo "server.js missing in archive"; exit 1; }

          rm -rf "$OLD"
          mv "$APP" "$OLD"
          mv "$NEW" "$APP"
          touch "$APP/tmp/restart.txt"
          echo "Released."
          REMOTE

      - name: Health check
        run: |
          curl -fsS -o /dev/null -w '%{http_code}\n' \
            --retry 6 --retry-delay 10 --retry-all-errors \
            https://topitsolution.com

      - name: Server log on failure
        if: failure()
        run: ssh cpanel 'tail -60 ~/storefront/stderr.log 2>/dev/null || echo "stderr.log নেই"'
```

### কেন এভাবে

- **নতুন folder-এ extract, তারপর swap** — `DEPLOY-topitsolution.md` §৬-এ হাতে পুরনো `.next`
  মুছে তারপর extract করতে বলা হয়েছে, কারণ Next-এর chunk-এর নাম প্রতি build-এ বদলায় আর পুরনো chunk পড়ে
  থাকলে Passenger সেগুলোই load করতে পারে। আলাদা folder-এ extract করলে পুরনো chunk থাকার প্রশ্নই নেই, আর
  মাঝখানে site বন্ধও থাকে না।
- **Guard `.next/server` পুরোটায় খোঁজে** — `build:cpanel` এখন `--webpack` দিয়ে build করে, তাই
  `.next/server/chunks/ssr/` folder নাও থাকতে পারে; পুরো `.next/server` খুঁজলে দুই bundler-এই কাজ করে।
- **Storefront প্রথম request-এ backend ডাকে** — health check-এ 500 এলে backend চালু কিনা আগে দেখুন।

---

## ৪. প্রথমবার চালানো

```bash
cd frontend
git add .github/workflows/deploy.yml
git commit -m "ci: deploy storefront to cPanel"
git push
```

**GitHub → Actions → Deploy storefront** (~৫–১০ মিনিট)। Push ছাড়া চালাতে **Run workflow**।

> **`main`-এ প্রতিটা push এখন live।** অর্ধেক কাজ আলাদা branch-এ রাখুন।

---

## ৫. Rollback

**cPanel → Terminal:**

```bash
cd ~
mv storefront storefront.broken
mv storefront.old storefront
touch storefront/tmp/restart.txt
```

পরে `rm -rf ~/storefront.broken`।

---

## ৬. সমস্যা হলে

| যা দেখবেন | কারণ |
|---|---|
| **`Permission denied (publickey)`** | public key cPanel-এ বসেনি, বা `SSH_PRIVATE_KEY` অসম্পূর্ণ |
| **`Host key verification failed`** | `SSH_KNOWN_HOSTS` খালি বা অন্য host-এর |
| **`npm ci` ব্যর্থ: lockfile মেলে না** | local-এ `npm install` চালিয়ে `package-lock.json` commit করুন |
| **Hashed external module guard লাল** | `next.config.ts`-এর `transpilePackages`-এ যে package-এর নাম বেরিয়েছে সেটা যোগ করুন। এই ধাপ না থাকলে এটা live-এ প্রতিটা page-এ 500 হতো |
| **Site চলছে কিন্তু data আসে না / `ApiError`** | `NEXT_PUBLIC_API_BASE_URL` variable বসেনি — build-এ খালি ঢুকেছে। variable বসিয়ে **Run workflow** |
| **Health check লাল** | "Server log on failure"-এর output পড়ুন; `DEPLOY-topitsolution.md` §৬.১-এর table মেলান। তারপর §৫ rollback |
| **Admin-এ save করলে storefront দেরিতে বদলায়** | CI-র সমস্যা নয় — `REVALIDATE_SECRET` backend-এর `STOREFRONT_REVALIDATE_SECRET`-এর সাথে মেলে না |
| **`fork: Resource temporarily unavailable`** | cPanel-এর process limit। swap-এর আগে থামলে কিছুই বদলায়নি — **Re-run jobs** |
| **`Disk quota exceeded`** | `rm -rf ~/storefront.old ~/storefront.broken` |
