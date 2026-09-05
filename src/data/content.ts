// Static homepage / marketing content. Swap for CMS-driven content once the
// backend is wired up.
import { placeholderImage } from "@/lib/placeholder";

export const heroSlides = [
  {
    id: 1,
    eyebrow: "The ideal electronics",
    title: "Hammer Bash Max Over-Ear Headphones",
    price: "1800.00 Taka",
    image: "/h1.png",
    href: "/products/hammer-bash-max-over-ear-headphones",
    theme: "light" as const,
    
  },
  {
    id: 2,
    eyebrow: "Up to 50% discount",
    title: "Titan Traveller With 4.52 CM Display Watch",
      price: "2500.00 Taka",
    image: "/h2.png",
    href: "/products/titan-traveller-display-watch",
    theme: "light" as const,
  },
];

export const sideBanners = [
  {
    id: 1,
    eyebrow: "Best discount",
    title: "Meta Oculus Quest Virtual Reality",
   image: "/h4.png",
    href: "/products/meta-oculus-quest-vr",
  },
  {
    id: 2,
    eyebrow: "Up to 30% discount",
    title: "JISULIFE Handheld Fan Life9 Mini Portable jet Fan",
    price: "2500.00 Taka",
    image: "/h5.png",
    href: "/products/bluetooth-calling-smart-watch",
  },
];

export const promoTile = {
  eyebrow: "Weekend discount",
  title: "Asus Zenfone 10 5G Green",
  price: "18,000.00 Taka",
 image: "/h6.png",
  href: "/products/asus-zenfone-10-5g-green",
};

export const brandLogos = ["Sony", "Huawei", "Panasonic", "Canon", "Microsoft", "Samsung"];

export const categoryTabs = ["Tablets", "Video Players", "Television", "Headphones"];

export const midBanners = [
  {
    id: 1,
    eyebrow: "Don't worry, we have it",
    title: "True Wireless Earbuds",
    price: "৳39.99",
    image: placeholderImage("mid-earbuds", { w: 500, h: 400, label: "True Wireless Earbuds" }),
    href: "/products/in-ear-microphone-earphone",
  },
  {
    id: 2,
    eyebrow: "Only this week",
    title: "Wired Gaming Headphone",
    price: "৳45.99",
    image: placeholderImage("mid-gaming-headset", { w: 500, h: 400, label: "Wired Gaming Headphone" }),
    href: "/products/hammer-bash-max-over-ear-headphones",
  },
  {
    id: 3,
    eyebrow: "Earn 5% cash back",
    title: "Drone Camera Remote",
    price: "৳49.49",
    image: placeholderImage("mid-drone", { w: 500, h: 400, label: "Drone Camera Remote" }),
    href: "/products",
  },
];

export const perks = [
  { title: "Free Shipping", description: "For orders over ৳130." },
  { title: "Money Return", description: "30 days for an exchange" },
  { title: "Member Discount", description: "Shop smart and save bigger" },
  { title: "Special Gifts", description: "Contact us anytime" },
];

export const collectionTiles = [
  { id: 1, title: "Only this week. Don't miss...", subtitle: "3D Glasses VR All In One Machine", price: "৳149.00", image: placeholderImage("coll-vr", { w: 700, h: 500, label: "3D Glasses VR" }), href: "/products" },
  { id: 2, title: "Find everything you need", subtitle: "Vifa Wireless Portable Bluetooth Speaker", price: "৳599.00", image: placeholderImage("coll-speaker", { w: 700, h: 500, label: "Vifa Bluetooth Speaker" }), href: "/products" },
];

export const categoryGrid = [
  { title: "Adapter & Cables", count: 6, image: "/categories/c2.png" },
  { title: "Pro Air Pods", count: 5, image: "/categories/c5.png" },
  { title: "Headphones", count: 10,  image: "/categories/c1.png" },
  { title: "Power Banks", count: 7, image: "/categories/c4.png" },
  { title: "Speaker", count: 6, image: "/categories/c6.png" },
  { title: "Smart Watch", count: 8, image: "/categories/c7.png" },
  { title: "Neckbands ", count: 5, image: "/categories/c3.png" }, 
  { title: "Mini Fan", count: 6, image: "/categories/c8.png" },
  { title: "VR Gear", count: 5, image: "/categories/c9.png" },
  { title: "Bags", count: 10,  image: "/categories/c10.png" },
  { title: "Computer Accessories", count: 7, image: "/categories/c12.png" },
  { title: "Mobile Accessories", count: 6, image: "/categories/c11.png" },

];

/*
 * Removed here, now merchant-managed: `contact`, `navLinks`/`NavLink`,
 * `footerColumns`, and the two homepage content rows — the client quotes and
 * the latest-posts cards, which are now models with their own admin sections.
 *
 * Those last two were deleted outright rather than kept as a fallback behind an
 * empty API. A fallback would mean an unseeded shop silently showing someone
 * else's stock content, with no way for a merchant to tell "not published yet"
 * from "broken" — and both sections are specified to be ABSENT when nothing is
 * published, which a fixture fallback would make unreachable.
 * See the storefront-cms blog and testimonials specs.
 *
 * They live on the StoreSetting singleton and reach the header and footer via
 * `getStoreSettings()` (src/services/store-settings.ts), fetched once in the
 * root layout. Keeping a static copy here would give the chrome two sources of
 * truth — which is exactly what left every footer link pointing at "#".
 *
 * The "Shop By Categories" mega menu is likewise not here: it comes from the
 * live catalog via `getCategoryTree()` (src/services/category.ts).
 */
