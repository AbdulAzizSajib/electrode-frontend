import { Gift, Headset, RotateCcw, Truck } from "lucide-react";
import { perks } from "@/data/content";

const icons = [Truck, RotateCcw, Gift, Headset];

export default function PerksBar() {
  return (
    <section className="bg-brand text-white">
      <div className="container-px grid site-container grid-cols-1 gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {perks.map((perk, i) => {
          const Icon = icons[i];
          return (
            <div key={perk.title} className="flex items-center gap-4">
              <Icon size={30} className="shrink-0" />
              <div>
                <p className="font-semibold">{perk.title}</p>
                <p className="text-sm text-white/80">{perk.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
