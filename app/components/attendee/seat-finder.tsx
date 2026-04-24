"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Navigation, MapPin, Clock, DoorOpen, X } from "lucide-react";
import { resolveSeat } from "@/lib/seat-mapping";
import { VENUE_ZONES, getDensityColor, getDensityLabel } from "@/lib/venue-data";

interface SeatFinderProps {
  onSeatFound: (sectionSelector: string, zoneId: string) => void;
  onClear: () => void;
}

export function SeatFinder({ onSeatFound, onClear }: SeatFinderProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ReturnType<typeof resolveSeat> | null>(null);
  const [error, setError] = useState("");

  const handleSearch = () => {
    if (!input.trim()) return;
    setError("");
    const res = resolveSeat(input);
    if (res.found) {
      setResult(res);
      onSeatFound(res.sectionSelector, res.zoneId);
    } else {
      setError(`Seat "${input}" not found. Try formats like J-3, K-5, 401, or Pavilion L-2.`);
      setResult(null);
    }
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
    setError("");
    onClear();
  };

  const zone = result ? VENUE_ZONES.find((z) => z.id === result.zoneId) : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Enter seat (e.g. J-3, 401, K-5)"
            className="w-full bg-zinc-800/60 border border-zinc-700/40 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
        <button onClick={handleSearch} className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors shrink-0">
          Find
        </button>
        {result && (
          <button onClick={handleClear} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors">
            <X size={14} />
          </button>
        )}
      </div>

      {error && <p className="text-[10px] text-rose-400 px-1">{error}</p>}

      <AnimatePresence>
        {result && zone && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation size={14} className="text-indigo-400" />
                  <span className="text-xs font-bold text-white">{result.sectionLabel}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: getDensityColor(zone.density) }} />
                  <span className="text-[10px]" style={{ color: getDensityColor(zone.density) }}>{getDensityLabel(zone.density)}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center gap-1.5">
                  <DoorOpen size={11} className="text-zinc-500" />
                  <span className="text-[10px] text-zinc-400">{result.nearestGate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={11} className="text-zinc-500" />
                  <span className="text-[10px] text-zinc-400">{result.walkTimeMinutes} min walk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={11} className="text-zinc-500" />
                  <span className="text-[10px] text-zinc-400">{result.zoneName}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
