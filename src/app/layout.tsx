import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import StoreProvider from "@/store/StoreProvider";
import { getCurrentUser } from "@/services/auth";
import { getCategoryTree } from "@/services/category";

export const metadata: Metadata = {
  title: "Electrode - Electronics Store",
  description:
    "A Next.js storefront rebuild of the Electrode electronics demo store. Frontend UI, ready for backend integration.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Independent of each other, so run them concurrently — the header renders on
  // every route, and awaiting these in series would add latency to every page.
  const [user, categories] = await Promise.all([
    getCurrentUser(),
    getCategoryTree(),
  ]);

  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <StoreProvider isSignedIn={Boolean(user)}>
          <Header user={user} categories={categories} />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <MobileBottomNav />
        </StoreProvider>
      </body>
    </html>
  );
}
