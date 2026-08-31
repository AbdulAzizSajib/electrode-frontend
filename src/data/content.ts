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
    price: "$39.99",
    image: placeholderImage("mid-earbuds", { w: 500, h: 400, label: "True Wireless Earbuds" }),
    href: "/products/in-ear-microphone-earphone",
  },
  {
    id: 2,
    eyebrow: "Only this week",
    title: "Wired Gaming Headphone",
    price: "$45.99",
    image: placeholderImage("mid-gaming-headset", { w: 500, h: 400, label: "Wired Gaming Headphone" }),
    href: "/products/hammer-bash-max-over-ear-headphones",
  },
  {
    id: 3,
    eyebrow: "Earn 5% cash back",
    title: "Drone Camera Remote",
    price: "$49.49",
    image: placeholderImage("mid-drone", { w: 500, h: 400, label: "Drone Camera Remote" }),
    href: "/products",
  },
];

export const perks = [
  { title: "Free Shipping", description: "For orders over $130." },
  { title: "Money Return", description: "30 days for an exchange" },
  { title: "Member Discount", description: "Shop smart and save bigger" },
  { title: "Special Gifts", description: "Contact us anytime" },
];

export const collectionTiles = [
  { id: 1, title: "Only this week. Don't miss...", subtitle: "3D Glasses VR All In One Machine", price: "$149.00", image: placeholderImage("coll-vr", { w: 700, h: 500, label: "3D Glasses VR" }), href: "/products" },
  { id: 2, title: "Find everything you need", subtitle: "Vifa Wireless Portable Bluetooth Speaker", price: "$599.00", image: placeholderImage("coll-speaker", { w: 700, h: 500, label: "Vifa Bluetooth Speaker" }), href: "/products" },
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

export const testimonials = [
  { name: "Augusta Wind", role: "Web Designer" },
  { name: "Reema Ghurde", role: "Manager" },
  { name: "Luies Charls", role: "CEO" },
  { name: "Stefanie Rashford", role: "Founder" },
].map((t) => ({
  ...t,
  quote:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry, Lorem Ipsum has been the industry's standard.",
}));

export const blogPosts = [
  { title: "How to Keep Your Devices Safe from Viruses", date: "Jul 19, 2026", excerpt: "Trends are patterns or shifts in behavior, preferences, or ideas that gain popularity within a specific industry.", image: placeholderImage("blog-1", { w: 500, h: 350, label: "Device Safety" }) },
  { title: "Tips for Extending the Life of Your Electronics", date: "Jul 19, 2026", excerpt: "In a world where information is abundant and time is precious, our blog is your sanctuary of meaningful content.", image: placeholderImage("blog-2", { w: 500, h: 350, label: "Electronics Care" }) },
  { title: "Must-Have Accessories for Your Gaming Setup", date: "Jul 19, 2026", excerpt: "Welcome to the digital world, where technology is constantly evolving and shaping how we live and work.", image: placeholderImage("blog-3", { w: 500, h: 350, label: "Gaming Setup" }) },
  { title: "How to Set Up a Smart Home on a Budget", date: "Jul 19, 2026", excerpt: "Welcome to the ultimate shopping event you've been waiting for — our upcoming sale with big discounts.", image: placeholderImage("blog-4", { w: 500, h: 350, label: "Smart Home" }) },
];

/**
 * Store contact details. Kept here rather than inline so the announcement bar
 * and the mobile bottom nav dial the same number.
 *
 * `phoneDigits` is the E.164 form without the `+` — what wa.me expects — while
 * `phone` is what a shopper reads.
 */
export const contact = {
  phone: "+8801782521705",
  phoneDigits: "8801782521705",
  email: "contact@sheisite.com",
};

export interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

/**
 * Shop / Best Selling / New Arrivals pointed at `/shop`, which is not a route
 * in this app — all three 404'd. They now point at `/products`, the real
 * catalog page, which carries the category, brand and price filters.
 *
 * The sort travels in the URL so the server orders the whole catalog; the
 * listing used to reorder only the fetched page, which made "best selling"
 * mean "best of these twelve".
 *
 * `sort` values must stay in step with `SORT_OPTIONS` in
 * components/product/ProductListing.tsx. An unrecognised value there falls back
 * to the default listing rather than erroring, so a stale bookmark still works.
 */
export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Best Selling", href: "/products?sort=best" },
  { label: "New Arrivals", href: "/products?sort=new" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

// The "Shop By Categories" mega menu is no longer defined here — it comes from
// the live catalog via `getCategoryTree()` (see src/services/category.ts).

export const footerColumns = [
  {
    title: "Information",
    links: ["Size Chart", "Shipping", "Legal Notice", "Delivery", "Shipping & Refund", "Sitemap"],
  },
  {
    title: "Your Account",
    links: ["Search", "About Us", "Delivery Information", "Contact", "Our Stories", "FAQs"],
  },
  {
    title: "Quick Links",
    links: ["Privacy Policy", "Refund Policy", "Shipping Policy", "Terms of Service", "Policy for Buyers", "Policy for Sellers"],
  },
];
