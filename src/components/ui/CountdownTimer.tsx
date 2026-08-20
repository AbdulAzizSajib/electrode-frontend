"use client";

import { useEffect, useState } from "react";

function getRemaining(target: number) {
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function CountdownTimer({ daysFromNow = 7 }: { daysFromNow?: number }) {
  const [target] = useState(() => Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
  const [time, setTime] = useState(() => getRemaining(target));

  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units: [string, number][] = [
    ["Days", time.days],
    ["Hour", time.hours],
    ["Min", time.minutes],
    ["Sec", time.seconds],
  ];

  return (
    <div className="flex gap-2">
      {units.map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <span className="flex h-11 w-11 items-center justify-center rounded border border-gray-300 text-sm font-semibold">
            {String(value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] text-gray-500">{label}</span>
        </div>
      ))}
    </div>
  );
}
