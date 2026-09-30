/**
 * The TOP IT SOLUTION lockup, for the footer's "Design & Developed by" credit.
 *
 * The framed TOP is traced from the master artwork with potrace. Two inks, one path each:
 * the letterforms take `currentColor`, so they come out ink on a light ground and white on
 * the brand-coloured footer, and the frame is FRAME. The O's counter is left open on
 * purpose so it shows whatever the logo sits on — the near-black disc in the master is the
 * canvas it was flattened on, not artwork, and tracing it would put a blob in the O on any
 * ground but black. The master's IT SOLUTION line is deliberately not traced; it is set in
 * text below, so it stays crisp at any size and reads as text to anything parsing the page.
 *
 * ONE LEAF FOR A SCREEN READER. `role="img"` plus the label on the wrapper collapses the
 * mark and the tagline into a single announcement — the agency's name, once — rather than
 * an unlabelled graphic followed by a stray "IT SOLUTION". The `<svg>` is therefore
 * `aria-hidden` and the text carries no label of its own.
 *
 * WHY THIS IS NOT THE STORE'S LOGO. This is the builder's mark, fixed for every
 * deployment; the merchant's own logo is `logoUrl`/`footerLogoUrl` on StoreSetting and is
 * uploaded through the admin. The two must never be confused — see `lib/agency-credit` for
 * why the credit is a constant rather than a setting.
 */

/** The frame's green. Fixed, not `currentColor`: it is the mark's own ink on any ground. */
const FRAME = "#5cc73f";

const WORD =
    "M 650.768 161.250 L 650.500 213.500 656.620 220.131 C 673.422 238.335, 680.355 255.824, 680.355 280 C 680.355 366.147, 567.013 401.301, 514.313 331.500 C 490.447 299.890, 492.651 251.041, 519.222 222.680 L 525 216.513 525 163.725 C 525 102.875, 526.190 108.258, 513.669 112.476 C 451.271 133.494, 403.575 195.027, 396.055 264.211 C 390.238 317.735, 412.467 375.766, 453.249 413.524 C 558.877 511.319, 734.458 466.375, 775.643 331 C 802.458 242.860, 753.091 145.606, 664.794 112.625 C 649.272 106.828, 651.078 100.566, 650.768 161.250 M 120.670 116.663 C 119.049 118.284, 119.929 203.759, 121.573 204.390 C 122.438 204.721, 143.250 204.725, 167.823 204.397 C 192.395 204.070, 214.231 204.190, 216.346 204.664 L 220.193 205.526 220.052 331.013 C 219.938 432.310, 220.160 456.840, 221.205 458.262 C 222.416 459.910, 225.735 460.007, 272.500 459.762 L 322.500 459.500 322.754 333.046 C 322.893 263.497, 323.343 206.265, 323.754 205.865 C 324.164 205.465, 337.550 205.065, 353.500 204.975 C 369.450 204.886, 384.867 204.577, 387.759 204.290 L 393.018 203.767 398.673 193.634 C 401.783 188.060, 405.765 181.229, 407.522 178.453 L 410.715 173.407 411.107 144.953 L 411.500 116.500 266.420 116.247 C 186.626 116.107, 121.039 116.295, 120.670 116.663 M 806.629 122.206 C 805.605 132.718, 806.097 456.308, 807.140 458.259 C 808.021 459.908, 811.264 460.002, 858.790 459.759 L 909.500 459.500 910.023 407.500 C 910.310 378.900, 910.647 355.410, 910.773 355.300 C 910.898 355.190, 938.337 354.943, 971.750 354.751 C 1024.545 354.448, 1033.548 354.177, 1040.500 352.682 C 1100.537 339.775, 1136.023 295.937, 1135.992 234.715 C 1135.963 174.673, 1101.720 132.628, 1041.500 118.692 C 1032.716 116.659, 1029.794 116.601, 919.871 116.261 L 807.242 115.912 806.629 122.206 M 918.500 204.895 L 910.500 205.500 910.235 234.879 C 910.034 257.136, 910.270 264.621, 911.211 265.754 C 913.232 268.189, 1004.268 266.984, 1011.882 264.422 C 1032.915 257.344, 1039.763 228.414, 1024.022 213.137 C 1015.425 204.795, 1014.103 204.591, 967.500 204.431 C 944.950 204.354, 922.900 204.563, 918.500 204.895";

const BOX =
    "M 77.347 2.048 C 38.355 7.176, 6.170 39.429, 1.056 78.500 C -1.154 95.389, 0.047 489.813, 2.333 498 C 11.759 531.750, 40.627 558.177, 74 563.609 C 84.771 565.362, 1172.933 565.705, 1184 563.959 C 1225.925 557.345, 1257.430 521.605, 1258.186 479.803 L 1258.373 469.500 1259 478 C 1259.345 482.675, 1259.626 395.150, 1259.625 283.500 C 1259.623 171.850, 1259.370 84.550, 1259.061 89.500 L 1258.500 98.500 1257.838 84.500 C 1255.770 40.749, 1223.584 6.548, 1180.151 1.948 C 1173.739 1.269, 1070.997 1.022, 874 1.213 L 577.500 1.500 571.664 4.234 C 562.318 8.613, 558.471 12.268, 554.272 20.763 L 550.500 28.392 549.864 121.946 C 548.958 255.076, 548.973 265.916, 550.064 270.787 C 554.469 290.440, 576.025 304.150, 595.151 299.463 C 606.871 296.591, 617.815 289.057, 621.980 280.994 C 626.222 272.784, 626.228 272.631, 626.367 169 L 626.500 69.500 900.486 69.248 L 1174.472 68.996 1179.836 71.620 C 1183.719 73.521, 1185.999 75.506, 1188.100 78.818 L 1191 83.392 1191 283.236 C 1191 477.706, 1190.949 483.179, 1189.097 486.790 C 1186.892 491.089, 1183.817 494.101, 1179.300 496.383 C 1173.977 499.072, 85.333 498.802, 79.500 496.110 C 74.659 493.876, 71.612 490.710, 69.548 485.768 C 68.168 482.467, 68 460.530, 68 284.211 L 68 86.359 70.750 80.930 C 73.677 75.153, 77.837 71.695, 83.882 70.016 C 86.250 69.358, 156.816 69.009, 288.145 69.006 C 517.038 68.999, 496.429 69.815, 506.959 60.347 C 525.708 43.490, 520.009 13.416, 496.247 3.821 L 490.500 1.500 287 1.370 C 175.075 1.298, 80.731 1.603, 77.347 2.048 M 0.490 284.500 C 0.490 396.150, 0.607 441.677, 0.750 385.670 C 0.893 329.664, 0.893 238.314, 0.750 182.670 C 0.607 127.027, 0.490 172.850, 0.490 284.500";

export default function AgencyLogo({
    label,
    className = "",
}: {
    /** The accessible name for the whole lockup — the agency's name, announced once. */
    label: string;
    className?: string;
}) {
    return (
        /*
          NO `aura` CLASS HERE. It belongs on the wrapper in Footer.tsx, around the
          card — not on this span.

          daisyUI's aura is a conic-gradient BACKGROUND that its child covers the
          middle of: `.aura > * { position: relative; z-index: 1 }`. It reads as a
          ring only because an opaque child sits on top of it. Put it on a wrapper
          whose child is transparent — as this span is — and there is nothing to
          cover the centre, so the whole gradient shows as a filled block, and the
          `:before`/`:after` glow layers inherit that fill and bleed it outward.
          That is the dark slab, not a broken gradient.
        */
        <span
            role="img"
            aria-label={label}
            className={`inline-flex items-center gap-1.5 ${className}`}
        >
            {/*
              Sized by height with the width left to the aspect ratio, the same rule the
              brand slot follows.

              `h-6`, not the `h-4` this started at. The mark is a framed word, so its
              letterforms sit inside a border and a padding band — at 16px the frame ate
              most of the height and TOP was rendering about 7px tall, which is what made
              it look cramped and stamp-like rather than like a logo. 24px gives the
              letterforms roughly the weight of the 14px text they sit beside, which is
              what a lockup of a mark and a word needs to read as one thing.
            */}
            <svg
                viewBox="0 0 1259 565"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="h-6 w-auto shrink-0"
            >
                <path d={WORD} fill="currentColor" fillRule="evenodd" />
                <path d={BOX} fill={FRAME} fillRule="evenodd" />
            </svg>
            {/*
              Scaled with the mark: `0.8125rem` against the old `0.6875rem`, so the tagline
              still reads as the mark's junior partner rather than shrinking away from it
              now that the mark is `h-6`.

              `leading-none` plus the parent's `items-center` is what aligns the two. The
              span's box would otherwise carry the font's own line-height as dead space
              above and below the caps, and centring THAT box against the mark leaves the
              letters sitting visibly high — the gap is invisible, so the misalignment
              looks like a mistake rather than a consequence.

              The negative end margin eats the trailing letter-space, so the lockup ends flush.
            */}
            <span className="me-[-0.2em]whitespace-nowrap text-[0.8125rem] font-bold leading-none tracking-[0.2em]">
                IT SOLUTION
            </span>
        </span>
    );
}
