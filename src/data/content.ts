// Static homepage / marketing content. Swap for CMS-driven content once the
// backend is wired up.
import { placeholderImage } from "@/lib/placeholder";

export const heroSlides = [
  {
    id: 1,
    eyebrow: "The ideal electronics",
    title: "Hammer Bash Max Over-Ear Headphones",
    price: "$149.99",
    image: "/watch.png",
    href: "/products/hammer-bash-max-over-ear-headphones",
    theme: "light" as const,
  },
  {
    id: 2,
    eyebrow: "Up to 50% discount",
    title: "Titan Traveller With 4.52 CM Display Watch",
    price: "$99.99",
    image: "/watch.png",
    href: "/products/titan-traveller-display-watch",
    theme: "light" as const,
  },
];

export const sideBanners = [
  {
    id: 1,
    eyebrow: "Best discount",
    title: "Meta Oculus Quest Virtual Reality",
    image: placeholderImage("side-oculus", { w: 500, h: 300, label: "Meta Oculus Quest" }),
    href: "/products/meta-oculus-quest-vr",
  },
  {
    id: 2,
    eyebrow: "Up to 30% discount",
    title: "Bluetooth Calling Smart Watch",
    image: placeholderImage("side-watch", { w: 500, h: 300, label: "Bluetooth Smart Watch" }),
    href: "/products/bluetooth-calling-smart-watch",
  },
];

export const promoTile = {
  eyebrow: "Weekend discount",
  title: "Asus Zenfone 10 5G Green",
  price: "$599.99",
  image: placeholderImage("promo-zenfone", { w: 600, h: 500, label: "Asus Zenfone 10" }),
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
  { title: "Game Console", count: 6, image: placeholderImage("cat-console", { w: 200, h: 200, label: "Game Console" }) },
  { title: "Pro Air Pods", count: 5, image: placeholderImage("cat-airpods", { w: 200, h: 200, label: "Pro Air Pods" }) },
  { title: "Headphones", count: 10, image: placeholderImage("cat-headphones", { w: 200, h: 200, label: "Headphones" }) },
  { title: "Apple iPad", count: 7, image: placeholderImage("cat-ipad", { w: 200, h: 200, label: "Apple iPad" }) },
  { title: "Gear Camera", count: 6, image: placeholderImage("cat-camera", { w: 200, h: 200, label: "Gear Camera" }) },
  { title: "Smart Watch", count: 8, image: placeholderImage("cat-watch", { w: 200, h: 200, label: "Smart Watch" }) },
  { title: "Smart Speaker", count: 5, image: placeholderImage("cat-speaker", { w: 200, h: 200, label: "Smart Speaker" }) },
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

export interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Shop",
    href: "/products",
    children: [
      { label: "All Products", href: "/products" },
      { label: "New Arrivals", href: "/products?sort=new" },
      { label: "Best Sellers", href: "/products?sort=best" },
      { label: "Today's Deal", href: "/deals" },
    ],
  },
  { label: "Collections", href: "/products" },
  {
    label: "Headphones",
    href: "/products?category=Headphones",
    children: [
      { label: "All Headphones", href: "/products?category=Headphones" },
      { label: "Over-Ear", href: "/products?category=Headphones" },
      { label: "In-Ear / Earbuds", href: "/products?category=Headphones" },
      { label: "Wireless", href: "/products?category=Headphones" },
    ],
  },
  { label: "Contact", href: "/contact" },
  { label: "Blogs", href: "/blogs" },
];

// "Shop By Categories" mega menu
export const categoriesMenu = [
  { label: "Smart Watch" },
  {
    label: "Headphones",
    children: ["Over-Ear", "In-Ear / Earbuds", "Wireless", "Noise Cancelling"],
  },
  { label: "Apple iPad" },
  { label: "Smartphone", children: ["Android", "iPhone", "Accessories"] },
  { label: "Smart Speaker" },
  { label: "Electronics" },
  { label: "Accessories" },
  { label: "Game Console" },
];

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
