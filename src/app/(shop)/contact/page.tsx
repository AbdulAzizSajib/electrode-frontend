"use client";

import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container-px mx-auto max-w-5xl py-14">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Contact Us</h1>
      <p className="mb-10 text-gray-500">We&apos;d love to hear from you. Reach out any time.</p>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input placeholder="Name" className="rounded border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand" />
            <input placeholder="Email" type="email" className="rounded border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand" />
          </div>
          <input placeholder="Subject" className="w-full rounded border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand" />
          <textarea placeholder="Message" rows={5} className="w-full rounded border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand" />
          <button className="rounded bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
            Send Message
          </button>
        </form>

        <div className="space-y-6">
          <div className="flex gap-3">
            <MapPin className="mt-1 shrink-0 text-brand" size={20} />
            <p className="text-sm text-gray-600">
              Electrode - Electronics Store, 507 Union Trade, Ipsum Dolor Centre
            </p>
          </div>
          <div className="flex gap-3">
            <Mail className="mt-1 shrink-0 text-brand" size={20} />
            <p className="text-sm text-gray-600">demo@example.com</p>
          </div>
          <div className="flex gap-3">
            <Phone className="mt-1 shrink-0 text-brand" size={20} />
            <p className="text-sm text-gray-600">(+91) 9876-543-210</p>
          </div>
        </div>
      </div>
    </div>
  );
}
