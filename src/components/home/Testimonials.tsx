import { Quote } from "lucide-react";
import { testimonials } from "@/data/content";
import StarRating from "@/components/ui/StarRating";

export default function Testimonials() {
  return (
    <section className=" py-12">
      <div className="container-px site-container">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">What Our Clients Say</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-xl bg-white p-6 shadow-sm">
              <Quote className="mb-3 text-brand" size={22} />
              <p className="text-sm text-gray-600">{t.quote}</p>
              <div className="mt-4">
                <StarRating rating={5} />
              </div>
              <p className="mt-3 text-sm font-semibold text-gray-900">{t.name}</p>
              <p className="text-xs text-gray-500">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
