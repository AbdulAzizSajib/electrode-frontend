"use client";

import { useEffect, useState } from "react";

const TYPE_MS = 70;
const DELETE_MS = 35;
const HOLD_MS = 1600;
const GAP_MS = 400;

/**
 * Types each phrase out, holds it, deletes it, and moves to the next — a
 * placeholder that shows what the search box can find instead of only saying
 * that it searches.
 *
 * The FIRST phrase is returned whole until the effect runs, so the server
 * render and the first client render agree (no hydration mismatch) and a
 * shopper on a slow connection sees a complete placeholder, never a fragment.
 *
 * `paused` holds the first phrase still — the search box passes it while it is
 * focused or has text, so the hint never moves under someone typing.
 * `prefers-reduced-motion` does the same, permanently: a placeholder rewriting
 * itself ten times a second is exactly the motion that setting asks to avoid.
 */
export function useTypingPlaceholder(phrases: readonly string[], paused: boolean) {
  const [text, setText] = useState(phrases[0] ?? "");

  useEffect(() => {
    if (paused || phrases.length < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let phrase = 0;
    let length = phrases[0].length;
    let deleting = true; // the first phrase is already shown, so start by holding then deleting
    let timer = window.setTimeout(step, HOLD_MS);

    function step() {
      const current = phrases[phrase];

      if (deleting) {
        length -= 1;
        setText(current.slice(0, length));
        if (length === 0) {
          deleting = false;
          phrase = (phrase + 1) % phrases.length;
          timer = window.setTimeout(step, GAP_MS);
        } else {
          timer = window.setTimeout(step, DELETE_MS);
        }
        return;
      }

      length += 1;
      setText(current.slice(0, length));
      if (length === current.length) {
        deleting = true;
        timer = window.setTimeout(step, HOLD_MS);
      } else {
        timer = window.setTimeout(step, TYPE_MS);
      }
    }

    return () => {
      window.clearTimeout(timer);
      // Back to the whole first phrase, so resuming never starts mid-word.
      setText(phrases[0] ?? "");
    };
  }, [phrases, paused]);

  return paused ? (phrases[0] ?? "") : text;
}
