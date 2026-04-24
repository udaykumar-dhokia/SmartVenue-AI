"use client";

import { motion } from "framer-motion";
import { X, MapPin, Thermometer, Clock, Users, AlertTriangle } from "lucide-react";
import type { VenueZone } from "@/lib/venue-data";
import { getDensityColor, getDensityLabel } from "@/lib/venue-data";

interface ZoneDetailProps {
  zone: VenueZone;
  onClose: () => void;
}

export function ZoneDetail({ zone, onClose }: ZoneDetailProps) {
  const densityColor = getDensityColor(zone.density);
  const densityLabel = getDensityLabel(zone.density);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className="absolute top-0 right-0 h-full w-80 bg-zinc-950/95 border-l border-zinc-800 backdrop-blur-2xl z-30 overflow-y-auto"
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{zone.category}</p>
            <h3 className="text-lg font-bold text-white">{zone.name}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/80 text-zinc-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="rounded-xl border border-zinc-800/60 p-4 mb-4" style={{ borderColor: `${densityColor}30` }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400">Crowd Density</span>
            <span className="text-xs font-bold" style={{ color: densityColor }}>{densityLabel}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tabular-nums">{Math.round(zone.density * 100)}%</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ backgroundColor: densityColor }} animate={{ width: `${zone.density * 100}%` }} transition={{ duration: 0.6 }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { icon: Users, label: "Occupancy", value: `${zone.currentOccupancy.toLocaleString()} / ${zone.capacity.toLocaleString()}` },
            { icon: Clock, label: "Avg Wait", value: `${zone.avgWaitTime}m` },
            { icon: Thermometer, label: "Temperature", value: `${zone.temperature}°C` },
            { icon: AlertTriangle, label: "Incidents", value: `${zone.incidents}` },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-zinc-800/40 bg-zinc-900/30 p-3">
              <item.icon size={14} className="text-zinc-500 mb-1.5" />
              <p className="text-[10px] text-zinc-500 mb-0.5">{item.label}</p>
              <p className="text-sm font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        {zone.sections.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Sections</p>
            <div className="flex flex-wrap gap-1.5">
              {zone.sections.slice(0, 12).map((s) => (
                <span key={s} className="px-2 py-1 rounded-md bg-zinc-800/60 text-[10px] font-mono text-zinc-400">{s}</span>
              ))}
              {zone.sections.length > 12 && <span className="px-2 py-1 text-[10px] text-zinc-500">+{zone.sections.length - 12} more</span>}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-2 text-xs font-semibold text-white transition-colors">
            Send Alert
          </button>
          <button className="flex-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors">
            Reroute Traffic
          </button>
        </div>
      </div>
    </motion.div>
  );
}
