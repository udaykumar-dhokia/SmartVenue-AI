"use client";

import { motion } from "framer-motion";
import { Clock, TrendingDown, Package } from "lucide-react";
import type { ConcessionOutlet } from "@/lib/venue-data";

interface ConcessionPanelProps {
  outlets: ConcessionOutlet[];
}

export function ConcessionPanel({ outlets }: ConcessionPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Concession Status</h3>
      {outlets.slice(0, 4).map((o) => (
        <motion.div
          key={o.id}
          className="rounded-xl border border-zinc-800/40 bg-zinc-900/30 p-3"
          whileHover={{ backgroundColor: "rgba(39, 39, 42, 0.5)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white">{o.name}</span>
            <span className="text-[10px] text-zinc-500">{o.zone}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center gap-1.5">
              <Clock size={10} className={o.waitTime > 10 ? "text-rose-400" : o.waitTime > 5 ? "text-amber-400" : "text-emerald-400"} />
              <span className="text-[10px] text-zinc-400">{o.waitTime}m</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingDown size={10} className="text-zinc-500" />
              <span className="text-[10px] text-zinc-400">{o.itemsSold}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Package size={10} className={o.stockLevel < 0.3 ? "text-rose-400" : "text-zinc-500"} />
              <span className="text-[10px] text-zinc-400">{Math.round(o.stockLevel * 100)}%</span>
            </div>
          </div>
          <div className="mt-2 h-1 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${o.stockLevel * 100}%`, backgroundColor: o.stockLevel < 0.3 ? "#ef4444" : o.stockLevel < 0.5 ? "#eab308" : "#22c55e" }} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
