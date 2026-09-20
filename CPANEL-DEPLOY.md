# cPanel (shared hosting) এ storefront deploy

Next.js 16 storefront টা cPanel-এর **Setup Node.js App** (Passenger, Node 22) দিয়ে চালানোর নোট।
Build হয় নিজের PC-তে; সার্ভারে শুধু তৈরি হওয়া `standalone` output যায় — shared hosting-এ
`next build` চালালে RAM/process limit-এ মাঝপথে kill হয়ে যায়।

Backend আগের মতোই Vercel-এ: `https://ecomsite-server.vercel.app`

---

## ১. কোথায় কী বদলানো হয়েছে

| ফাইল | কী বদলেছে | কেন |
|---|---|---|
| `next.config.ts` | `output: "standalone"` যোগ | `.next/standalone/` এ একটা স্বয়ংসম্পূর্ণ `server.js` + শুধু দরকারি `node_modules` তৈরি হয়। সার্ভারে `npm install` লাগে না |
| `next.config.ts` | `projectDir` ভ্যারিয়েবল, আর `outputFileTracingRoot` + `turbopack.root` দুটোই `tracingRoot`-এ pin করা | `Ecom/` রুটে আলাদা `package-lock.json` আছে। pin না করলে Next ওটাকে root ধরে, আর `server.js` চলে যায় `.next/standalone/frontend/server.js`-এ। দুটো root একই হতে হবে |
| `scripts/package-standalone.mjs` (নতুন) | `public/` আর `.next/static/` কে standalone-এর ভেতরে কপি করে, তারপর `storefront.tar.gz` বানায় | standalone নিজে এই দুটো ফোল্ডার কপি করে না — না করলে CSS/JS/ছবি সব 404। `tar` কারণ PowerShell 5.1-এর `Compress-Archive` path-এ `\` লেখে, Linux-এ unzip করলে ফোল্ডারের বদলে অদ্ভুত নামের ফাইল হয় |
| `package.json` | `"build:cpanel": "next build && node scripts/package-standalone.mjs"` | এক কমান্ডে build + pack |
| `.gitignore` | `/storefront.tar.gz` | archive যেন commit না হয় |
| `.env.production.local` (নতুন, **git-এ নেই**) | `NEXT_PUBLIC_API_BASE_URL=https://ecomsite-server.vercel.app/api/v1` | `NEXT_PUBLIC_*` মান **build-এর সময়** bundle-এ বসে যায়; সার্ভারের env দিয়ে পরে বদলানো যায় না। `.env.local`-এ `localhost:5000` আছে, production build-এ এই ফাইলটা সেটাকে override করে |

> `.env.production.local` gitignored — নতুন করে clone করলে ফাইলটা হাতে বানাতে হবে।
> এটা থাকা অবস্থায় লোকালে যেকোনো `npm run build` / `next start` Vercel-এর backend-এ যাবে। `npm run dev`-এ কোনো প্রভাব নেই।

Standalone-এ `.env.local` বা `.env.production.local` কপি **হয় না** (শুধু `.env` আর `.env.production` হয়) —
তাই `REVALIDATE_SECRET`-এর মতো runtime secret cPanel-এর Environment variables-এ দিতে হবে।

---

## ২. প্রতিবার deploy

লোকাল PC-তে (`frontend/` ফোল্ডারে):

```powershell
npm run build:cpanel
```

এতে `frontend/storefront.tar.gz` (~14 MB) তৈরি হয়। আপলোডের আগে লোকালে চালিয়ে দেখা যায়:

```powershell
cd .next\standalone; $env:PORT=4001; node server.js
```

তারপর cPanel File Manager দিয়ে `storefront.tar.gz` → `~/storefront/` এ আপলোড, আর cPanel Terminal-এ:

```bash
cd ~/storefront
tar -xzf storefront.tar.gz && rm storefront.tar.gz
mkdir -p tmp && touch tmp/restart.txt
```

---

## ৩. cPanel-এ একবারের setup

1. **Subdomain** বানান (যেমন `shop.yourdomain.com`)। sub-path (`yourdomain.com/shop`) না — ওতে `basePath` লাগে।
2. **SSL চালু করুন** (AutoSSL / Let's Encrypt)। Production-এ cookie `Secure` + `SameSite=None` হয়
   (`src/lib/auth-cookies.ts`, `src/lib/api-proxy.ts`); শুধু `http`-এ login আর cart চুপচাপ কাজ করবে না।
3. **Setup Node.js App → Create Application**:

   | ঘর | মান |
   |---|---|
   | Node.js version | 22.x |
   | Application mode | Production |
   | Application root | `storefront` (home-এর ভেতরে, `public_html`-এ না) |
   | Application URL | উপরের subdomain |
   | Application startup file | `server.js` |
   | Environment variables | `REVALIDATE_SECRET` = server-এর `STOREFRONT_REVALIDATE_SECRET` |

   `PORT` দেবেন না — Passenger নিজে দেয়।
4. **আগে app create, তারপর ফাইল আপলোড।** **"Run NPM Install" চাপবেন না** — `node_modules` archive-এর ভেতরেই আছে।

---

## ৪. এখনো বাকি (server redeploy না করা পর্যন্ত)

Server এখন redeploy করা হচ্ছে না, তাই cPanel ডোমেইনে এগুলো **কাজ করবে না**:

- **Quick view, search box-এর suggestion, product review list** — এগুলো browser থেকে সরাসরি backend-এ যায়
  (`src/store/productApi.ts`, `src/store/reviewApi.ts`), তাই backend-এর CORS allowlist-এ cPanel ডোমেইন লাগবে।
  ঠিক করতে: `server/src/app/app.ts`-এর `allowedOrigins`-এ `"https://shop.yourdomain.com"` যোগ করে Vercel-এ redeploy।
  (`FRONTEND_URL` বদলাবেন না — Vercel storefront-এর login redirect ভাঙবে।)
- **Google login** — ফেরত পাঠায় `FRONTEND_URL`-এ, মানে Vercel storefront-এ। টেস্টে email/phone login ব্যবহার করুন।
- **Admin-এ save করলে সাথে সাথে আপডেট** — revalidation যায় `STOREFRONT_URL`-এ। cPanel সাইটে content নিজে থেকে ~৫ মিনিটে রিফ্রেশ হবে।

যা কাজ করবে: সব page (server-side-এ data আসে), cart, wishlist, address, checkout, order tracking — এগুলো
storefront-এর নিজের `/api/*` route দিয়ে যায়, CORS লাগে না।

---

## ৫. সমস্যা হলে

- **503 / "Incomplete response"** — হাতে চালিয়ে আসল error দেখুন:
  ```bash
  source ~/nodevenv/storefront/22/bin/activate && cd ~/storefront
  PORT=3005 node server.js
  ```
  আর `~/storefront/stderr.log` দেখুন।
- **CloudLinux `node_modules` নিয়ে আপত্তি করলে** — সব ফাইল `~/storefront/app/` সাব-ফোল্ডারে রাখুন,
  startup file দিন `app/server.js`। CloudLinux শুধু app root-এর `node_modules` দেখে; `server.js` নিজেই নিজের ফোল্ডারে `chdir` করে।
- **CSS/ছবি 404** — archive `npm run build:cpanel` দিয়ে বানানো হয়নি (শুধু `npm run build` চালালে `public/` আর `static/` কপি হয় না)।
- **Product/search আসছে না, console-এ CORS error** — উপরের ৪ নম্বর।
- **Login বা cart টিকছে না** — HTTPS নেই।
- অনেকক্ষণ কেউ না এলে Passenger app বন্ধ করে দেয়; পরের প্রথম request ধীর হবে — স্বাভাবিক।

---

## ৬. অন্য Next.js প্রজেক্টে একই কাজ

1. `next.config`-এ `output: "standalone"`।
2. প্রজেক্টের উপরের কোনো ফোল্ডারে আরেকটা lockfile থাকলে `outputFileTracingRoot` আর `turbopack.root` প্রজেক্ট ফোল্ডারে pin করুন।
   যাচাই: build-এর পর `.next/standalone/server.js` আছে কিনা — `.next/standalone/<folder>/server.js` হলে pin লাগবে।
3. `scripts/package-standalone.mjs` কপি করে `build:cpanel` script যোগ করুন; `/storefront.tar.gz` gitignore-এ।
4. সব `NEXT_PUBLIC_*` মান `.env.production.local`-এ — build-এর আগেই।
5. বাকি server-only env (secret ইত্যাদি) cPanel-এর Environment variables-এ।
6. Next-এর নিজের image optimizer (`/_next/image`) ব্যবহার করলে `sharp` লাগে, আর Windows-এ build করলে ভেতরে Windows-এর
   binary যায় — Linux-এ চলবে না। তখন Linux-এ build করুন (WSL / GitHub Actions) অথবা `images.unoptimized: true`।
   এই storefront-এ সমস্যা নেই: ছবি Cloudinary-র custom loader দিয়ে যায়, `sharp` কখনো load হয় না।
7. যে কোড browser থেকে সরাসরি backend-এ যায়, তার জন্য backend-এর CORS-এ নতুন ডোমেইন।

> **Admin (Vite SPA) আলাদা জিনিস** — ওটা static, Node app লাগে না: `npm run build`-এর `dist/` ফোল্ডার subdomain-এর
> document root-এ রাখুন, আর `.htaccess`-এ সব path `index.html`-এ rewrite করুন। Build-এর আগে
> `VITE_API_BASE_URL=https://ecomsite-server.vercel.app/api/v1` সেট করুন (`admin/src/lib/api/client.ts` এটা পড়ে;
> না দিলে `localhost:5000`-এ যায়) — এটাও build-time মান, `NEXT_PUBLIC_*`-এর মতো।
