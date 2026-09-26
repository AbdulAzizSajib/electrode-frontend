import { Icon } from "@iconify/react";
import type { Perk } from "@/types/store-settings";

/**
 * The coloured band of promises under the product rows.
 *
 * Its four columns were four objects in `data/content.ts` and four `lucide-react`
 * imports here until add-perks-strip-content; both are merchant-owned now and
 * arrive on the settings payload the home page already holds, so this fetches
 * nothing and stays a server component.
 *
 * ICONS ARE RESOLVED BY NAME, through `@iconify/react`, the same way the
 * header's announcement and middle-bar links already resolve theirs. That is
 * what makes the mark editable at all: a fixed array of imported components
 * could only ever be changed by a deploy, and there is no fifth icon in it for
 * a merchant who renames a column.
 *
 * RETURNS NULL ON AN EMPTY LIST rather than an empty band. A merchant who
 * removed every column asked for no band, and `bg-brand` with nothing in it is
 * a coloured stripe across the page that reads as a broken section — the same
 * reason the product rows render nothing rather than an empty grid under a
 * heading. Switching the section off in Home sections is the other way to
 * remove it, and the page never reaches this component in that case.
 */
export default function PerksBar({ perks }: { perks: Perk[] }) {
  if (perks.length === 0) return null;

  return (
    <section className="bg-brand text-white">
      {/*
        Columns follow the list rather than being fixed at four: with two perks,
        `lg:grid-cols-4` left half the band empty and the pair huddled on the
        left. The backend caps the list at four, so these are all the cases.
      */}
      <div
        className={`container-px grid site-container grid-cols-1 gap-6 py-8 sm:grid-cols-2 ${
          perks.length >= 4 ? "lg:grid-cols-4" : perks.length === 3 ? "lg:grid-cols-3" : ""
        }`}
      >
        {perks.map((perk, i) => (
          /*
            Keyed by position, not by title: the title is merchant-typed and two
            columns may legitimately share one while a merchant is part-way
            through renaming them.
          */
          <div key={i} className="flex items-center gap-4">
            <Icon icon={perk.icon} width={30} height={30} className="shrink-0" aria-hidden />
            <div>
              <p className="font-semibold">{perk.title}</p>
              <p className="text-sm text-white/80">{perk.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
