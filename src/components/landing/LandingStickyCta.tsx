"use client";

import { useEffect, useState } from "react";

/**
 * The mobile bar that carries an undecided reader back to the order form.
 *
 * Mobile only. On a wide screen the form sits beside the hero and is visible
 * for most of the scroll, so a fixed bar would cover content to solve a problem
 * that does not exist there.
 *
 * Hidden until the form has scrolled out of view. A call to action pinned over
 * the very form it points at is noise, and on a short page it would be the only
 * thing a visitor ever sees of the page's bottom edge.
 */
export default function LandingStickyCta({
  label,
  price,
}: {
  label: string;
  price: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const form = document.getElementById("order-form");
    if (!form) return;

    /*
     * An IntersectionObserver rather than a scroll listener: the browser
     * computes this off the main thread, and a scroll handler firing on every
     * frame is exactly the kind of jank that costs conversions on the mid-range
     * phones this traffic arrives on.
     */
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" },
    );

    observer.observe(form);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      // Always rendered, never conditionally mounted: translating it out of view
      // means the bar slides rather than appearing abruptly, and the observer
      // above keeps its target for the whole page life.
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 p-3 backdrop-blur transition-transform duration-200 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      // Hidden from assistive tech and from tab order while off-screen: the
      // form it points at is the same form already in the document, so an
      // invisible duplicate button would just be a second stop on the way to it.
      aria-hidden={!visible}
    >
      <a
        href="#order-form"
        tabIndex={visible ? 0 : -1}
        className="flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3.5 text-base font-semibold text-white"
      >
        <span>{label}</span>
        <span className="opacity-80">·</span>
        <span>{price}</span>
      </a>
    </div>
  );
}
