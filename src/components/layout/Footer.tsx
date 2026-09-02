"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { footerColumns } from "@/data/content";
import { FacebookIcon, InstagramIcon, XIcon, YoutubeIcon } from "@/components/ui/SocialIcons";

export default function Footer() {
  return (
    <footer className="bg-brand text-white">
      <div className="container-px mx-auto max-w-346 border-b border-white/10 py-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h3 className="text-xl font-semibold">Join Our Newsletter For ৳10 Off</h3>
            <p className="mt-1 text-sm text-white/80">
              Subscribe to our latest newsletter to get news about special discounts and upcoming sales.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-md gap-0 md:w-auto"
          >
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-l bg-white px-4 py-3 text-sm text-gray-900 outline-none"
            />
            <button className="whitespace-nowrap rounded-r bg-accent px-5 py-3 text-sm font-semibold text-white">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="container-px mx-auto grid max-w-346 grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <h4 className="text-2xl font-bold">Electrode</h4>
          <p className="mt-3 text-sm text-white/80">
            Welcome to our store, where we pride ourselves on providing exceptional products and
            unparalleled customer service, style and innovation.
          </p>
        </div>

        {footerColumns.map((col) => (
          <div key={col.title}>
            <h5 className="mb-4 font-semibold">{col.title}</h5>
            <ul className="space-y-2.5 text-sm text-white/80">
              {col.links.map((link) => (
                <li key={link}>
                  <Link href="#" className="hover:text-accent">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h5 className="mb-4 font-semibold">About Information</h5>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex gap-2">
              <MapPin size={18} className="mt-0.5 shrink-0" />
              <span>Electrode - Electronics Store, 507 Union Trade, Ipsum Dolor Centre</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} />
              demo@example.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} />
              (+91) 9876-543-210
            </li>
          </ul>
        </div>
      </div>

      <div className="container-px mx-auto flex max-w-346 flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-sm text-white/80 sm:flex-row">
        <div className="flex gap-4">
          <FacebookIcon size={18} />
          <InstagramIcon size={18} />
          <YoutubeIcon size={18} />
          <XIcon size={18} />
        </div>
        <p>&copy; {new Date().getFullYear()}, Electrode - Electronics Store. Built with Next.js.</p>
      </div>
    </footer>
  );
}
