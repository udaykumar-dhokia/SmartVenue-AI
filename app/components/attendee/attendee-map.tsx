"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { VENUE_ZONES, getDensityColor, getDensityLabel, ATTENDEE_PROFILE } from "@/lib/venue-data";
import { simulateZoneDensities } from "@/lib/simulation";
import type { VenueZone } from "@/lib/venue-data";
import { SeatFinder } from "./seat-finder";

export function AttendeeMap() {
  const [zones, setZones] = useState(VENUE_ZONES);
  const [svgContent, setSvgContent] = useState("");
  const [selectedZone, setSelectedZone] = useState<VenueZone | null>(null);
  const [highlightSection, setHighlightSection] = useState<string | null>(null);
  const [highlightZoneId, setHighlightZoneId] = useState<string | null>(null);
  const svgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/stadium.svg").then((r) => r.text()).then(setSvgContent);
  }, []);

  useEffect(() => {
    const i = setInterval(() => setZones((p) => simulateZoneDensities(p)), 5000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !svgContent) return;
    const svg = svgRef.current.querySelector("svg");
    if (!svg) return;

    const cleanups: Array<() => void> = [];
    svg.querySelectorAll<SVGGElement>("g[data-category]").forEach((g) => {
      const id = g.getAttribute("data-category") || "";
      const zone = zones.find((z) => z.id === id);
      if (!zone) return;

      const color = getDensityColor(zone.density);
      const isMine = id === ATTENDEE_PROFILE.zone;
      const isHighlightedZone = id === highlightZoneId;

      g.querySelectorAll<SVGPathElement>("path[data-seat], path[tc-selectable]").forEach((p) => {
        p.style.fill = color;
        p.style.opacity = isHighlightedZone ? "0.85" : isMine ? "0.8" : "0.35";
        p.style.stroke = isHighlightedZone ? "#818cf8" : isMine ? "#818cf8" : "#3f3f46";
        p.style.strokeWidth = isHighlightedZone ? "1.5" : isMine ? "2" : "0.3";
        p.style.transition = "all 0.4s ease";
        p.style.cursor = "pointer";
      });

      const onClick = () => setSelectedZone(zone);
      g.addEventListener("click", onClick);
      cleanups.push(() => g.removeEventListener("click", onClick));
    });

    if (highlightSection) {
      const sectionGroup = svg.querySelector<SVGGElement>(`g[data-section="${highlightSection}"]`);
      if (sectionGroup) {
        sectionGroup.querySelectorAll<SVGPathElement>("path").forEach((p) => {
          p.style.fill = "#818cf8";
          p.style.opacity = "1";
          p.style.stroke = "#c7d2fe";
          p.style.strokeWidth = "2.5";
          p.style.filter = "drop-shadow(0 0 8px rgba(129,140,248,0.6))";
          p.style.transition = "all 0.3s ease";
        });

        const bbox = sectionGroup.getBBox();
        const cx = bbox.x + bbox.width / 2;
        const cy = bbox.y + bbox.height / 2;
        const pad = 80;
        svg.setAttribute("viewBox", `${cx - pad} ${cy - pad} ${pad * 2} ${pad * 2}`);
        svg.style.transition = "all 0.6s ease";
      }
    } else {
      svg.setAttribute("viewBox", "1.5 1.8 601.7 612.41");
      svg.style.transition = "all 0.6s ease";
    }

    return () => cleanups.forEach((fn) => fn());
  }, [zones, svgContent, highlightSection, highlightZoneId]);

  const handleSeatFound = useCallback((sectionSelector: string, zoneId: string) => {
    setHighlightSection(sectionSelector);
    setHighlightZoneId(zoneId);
    const zone = zones.find((z) => z.id === zoneId);
    if (zone) setSelectedZone(zone);
  }, [zones]);

  const handleClear = useCallback(() => {
    setHighlightSection(null);
    setHighlightZoneId(null);
    setSelectedZone(null);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 flex flex-col gap-3">
      <SeatFinder onSeatFound={handleSeatFound} onClear={handleClear} />

      {!highlightSection && (
        <div className="text-center">
          <p className="text-[10px] text-zinc-500">Your seat: <span className="text-indigo-400 font-semibold">Stand {ATTENDEE_PROFILE.seat.section}, Row {ATTENDEE_PROFILE.seat.row}, Seat {ATTENDEE_PROFILE.seat.number}</span></p>
        </div>
      )}

      <div ref={svgRef} className="w-full aspect-square rounded-xl bg-zinc-900/50 border border-zinc-800/40 p-2 [&_svg]:w-full [&_svg]:h-full" dangerouslySetInnerHTML={{ __html: svgContent }} />

      {selectedZone && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-white">{selectedZone.name}</p>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: getDensityColor(selectedZone.density) }} />
              <span className="text-[10px] font-medium" style={{ color: getDensityColor(selectedZone.density) }}>{getDensityLabel(selectedZone.density)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400">
            <span>Density: {Math.round(selectedZone.density * 100)}%</span>
            <span>Wait: {selectedZone.avgWaitTime}m</span>
          </div>
        </motion.div>
      )}

      <div className="flex items-center gap-3 justify-center">
        {[{ c: "#10b981", l: "Low" }, { c: "#eab308", l: "Med" }, { c: "#f97316", l: "High" }, { c: "#ef4444", l: "Full" }].map((x) => (
          <div key={x.l} className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: x.c }} />
            <span className="text-[9px] text-zinc-500">{x.l}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
