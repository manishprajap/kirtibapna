"use client";

import { useState } from "react";

/**
 * Hero background.
 * 1) If you add a video at  public/hero.mp4  (fashion / fabric / sketch animation) it plays here automatically.
 * 2) Otherwise a built-in fashion-design animation plays: flowing silk, a dress being sketched, and a needle stitching a thread.
 */
export default function HeroBackdrop() {
  const [noVideo, setNoVideo] = useState(false);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-night">
      {!noVideo && (
        <video
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setNoVideo(true)}
          className="absolute inset-0 z-10 h-full w-full object-cover"
        />
      )}

      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="silk1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E8407A" stopOpacity=".55" />
            <stop offset="1" stopColor="#7A1240" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="silk2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFC2D9" stopOpacity=".28" />
            <stop offset="1" stopColor="#C2185B" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="silk3" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#D9A441" stopOpacity=".3" />
            <stop offset="1" stopColor="#D9A441" stopOpacity="0" />
          </linearGradient>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="#fff" strokeOpacity=".05" />
          </pattern>
        </defs>

        {/* Pattern-paper grid */}
        <rect width="1600" height="900" fill="url(#grid)" className="kb-grid" />

        {/* Flowing silk */}
        <path fill="url(#silk1)">
          <animate attributeName="d" dur="14s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"
            values="M-100 640 C 250 460, 560 860, 940 620 S 1460 440, 1700 620 L1700 900 L-100 900 Z;M-100 560 C 300 760, 640 440, 1000 660 S 1420 760, 1700 520 L1700 900 L-100 900 Z;M-100 640 C 250 460, 560 860, 940 620 S 1460 440, 1700 620 L1700 900 L-100 900 Z" />
        </path>
        <path fill="url(#silk2)">
          <animate attributeName="d" dur="19s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"
            values="M-100 720 C 300 600, 700 880, 1100 700 S 1500 600, 1700 740 L1700 900 L-100 900 Z;M-100 680 C 340 860, 760 600, 1120 760 S 1480 840, 1700 660 L1700 900 L-100 900 Z;M-100 720 C 300 600, 700 880, 1100 700 S 1500 600, 1700 740 L1700 900 L-100 900 Z" />
        </path>
        <path fill="url(#silk3)">
          <animate attributeName="d" dur="23s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"
            values="M-100 520 C 200 380, 520 640, 880 500 S 1400 380, 1700 520 L1700 0 L-100 0 Z;M-100 440 C 260 600, 600 360, 940 540 S 1380 560, 1700 400 L1700 0 L-100 0 Z;M-100 520 C 200 380, 520 640, 880 500 S 1400 380, 1700 520 L1700 0 L-100 0 Z" />
        </path>

        {/* Dress being sketched (right side) */}
        <g fill="none" stroke="#FF9DBE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".75" transform="translate(120 10)">
          {[
            "M1180 140 q0 -30 25 -35",
            "M1180 140 L1180 175",
            "M1180 175 L1090 235 M1180 175 L1270 235",
            "M1130 220 Q1180 255 1230 220",
            "M1130 220 L1100 250 M1230 220 L1260 250",
            "M1100 250 Q1120 330 1140 400 M1260 250 Q1240 330 1220 400",
            "M1140 400 Q1180 418 1220 400",
            "M1140 400 Q1050 600 1000 780 M1220 400 Q1310 600 1360 780",
            "M1000 780 Q1180 835 1360 780",
            "M1180 418 L1155 800 M1180 418 L1205 805",
            "M1160 410 Q1110 600 1082 795 M1200 410 Q1250 600 1278 795",
          ].map((d, i) => (
            <path key={i} d={d} pathLength={1} className="kb-sketch" style={{ animationDelay: `${i * 0.55}s` }} />
          ))}
          {/* stitch marks + measure ticks */}
          <path d="M1060 640 L1300 640" strokeDasharray="6 8" strokeOpacity=".5" className="kb-march" />
          <path d="M1000 830 L1360 830 M1000 822 V838 M1360 822 V838" strokeOpacity=".4" />
        </g>

        {/* Needle + thread */}
        <path id="kb-thread" d="M-40 300 C 200 120, 380 520, 640 300 S 980 120, 1240 300 S 1500 420, 1660 240" fill="none" stroke="#FFC2D9" strokeOpacity=".7" strokeWidth="1.5" strokeDasharray="4 7" pathLength={1} className="kb-thread" />
        <g>
          <circle r="5" fill="#fff" />
          <circle r="14" fill="#E8407A" fillOpacity=".25" />
          <animateMotion dur="9s" repeatCount="indefinite" rotate="auto">
            <mpath href="#kb-thread" />
          </animateMotion>
        </g>
      </svg>
    </div>
  );
}
