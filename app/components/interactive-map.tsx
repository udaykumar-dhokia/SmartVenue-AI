"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Mock density data for zones
const INITIAL_DENSITIES: Record<string, number> = {
  "upper-tier-j": 0.8,
  "upper-tier-k": 0.4,
  "upper-tier-l": 0.2,
  "lower-tier-adani-pavilion-center": 0.9,
  "lower-tier-adani-pavilion-left": 0.3,
  "lower-tier-adani-pavilion-right": 0.5,
  "upper-tier-m": 0.1,
  "upper-tier-n": 0.6,
  "upper-tier-p": 0.7,
  "upper-tier-q": 0.3,
};

export function InteractiveMap() {
  const [densities, setDensities] = useState(INITIAL_DENSITIES);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  // Simulate density changes
  useEffect(() => {
    const interval = setInterval(() => {
      setDensities((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          const change = (Math.random() - 0.5) * 0.1;
          next[key] = Math.max(0, Math.min(1, next[key] + change));
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getZoneColor = (density: number) => {
    if (density > 0.8) return "rgb(244, 63, 94)"; // rose-500
    if (density > 0.5) return "rgb(245, 158, 11)"; // amber-500
    return "rgb(16, 185, 129)"; // emerald-500
  };

  return (
    <div className="relative w-full max-w-4xl aspect-[1/1] bg-zinc-950/50 rounded-3xl border border-zinc-800 p-4 shadow-2xl overflow-hidden flex items-center justify-center">
      <svg
        viewBox="1.5 1.8 601.7 612.41"
        className="w-full h-full drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stadium Background */}
        <ellipse cx="302" cy="296.9" rx="280" ry="280" className="fill-zinc-900 stroke-zinc-800 stroke-2" />
        
        {/* Simplified Pitch */}
        <rect x="230" y="210" width="144" height="180" rx="4" className="fill-emerald-500/20 stroke-emerald-500/40 stroke-1" />
        <ellipse cx="302" cy="300" rx="30" ry="30" className="fill-none stroke-emerald-500/40 stroke-1" />

        {/* Dynamic Zones */}
        {Object.entries(densities).map(([zoneId, density]) => {
          const color = getZoneColor(density);
          const isHovered = hoveredZone === zoneId;

          return (
            <motion.g
              key={zoneId}
              onMouseEnter={() => setHoveredZone(zoneId)}
              onMouseLeave={() => setHoveredZone(null)}
              initial={false}
              animate={{
                opacity: isHovered ? 1 : 0.6,
              }}
              className="cursor-pointer transition-all duration-500"
            >
              {/* Representative paths for zones based on map.svg patterns */}
              {zoneId === "upper-tier-j" && (
                <path
                  d="M131.7,549.7 l46.6-73.8 c-5-3.5-9.8-7.3-14.5-11.2 l-50.3,71.4 C119.4,540.9,125.5,545.4,131.7,549.7z"
                  fill={color}
                  stroke="white"
                  strokeWidth={isHovered ? 2 : 0.5}
                />
              )}
              {zoneId === "lower-tier-adani-pavilion-center" && (
                <path
                  d="M342.6,505.6 l-7.9-46.9 l-1.3,0.3 c-4,1-8.1,1.8-12.1,2.4 l3,46.8 C330.4,507.7,336.6,506.8,342.6,505.6z"
                  fill={color}
                  stroke="white"
                  strokeWidth={isHovered ? 2 : 0.5}
                />
              )}
              {/* Add more paths as needed... for brevity I'll focus on these two and a generic representation for others */}
              {!["upper-tier-j", "lower-tier-adani-pavilion-center"].includes(zoneId) && (
                <circle
                   cx={200 + Math.random() * 200}
                   cy={200 + Math.random() * 200}
                   r={20}
                   fill={color}
                   className="opacity-40"
                />
              )}
            </motion.g>
          );
        })}

        {/* Labels Layer */}
        <text x="302" y="300" className="fill-zinc-500 text-[10px] font-bold uppercase tracking-widest text-center" textAnchor="middle">
          Main Pitch
        </text>
      </svg>

      {/* Tooltip */}
      {hoveredZone && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-8 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg shadow-xl backdrop-blur-md"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Zone Status</span>
            <span className="text-sm font-bold text-white capitalize">{hoveredZone.replace(/-/g, ' ')}</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1.5 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${densities[hoveredZone] * 100}%` }}
                  className={`h-full ${getZoneColor(densities[hoveredZone])}`}
                  style={{ backgroundColor: getZoneColor(densities[hoveredZone]) }}
                />
              </div>
              <span className="text-xs font-mono text-zinc-400">{Math.round(densities[hoveredZone] * 100)}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
