"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { VenueZone } from "@/lib/venue-data";
import { getDensityColor } from "@/lib/venue-data";

interface VenueMapProps {
  zones: VenueZone[];
  onZoneSelect: (zone: VenueZone) => void;
  selectedZoneId: string | null;
}

export function VenueMap({ zones, onZoneSelect, selectedZoneId }: VenueMapProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [svgContent, setSvgContent] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/stadium.svg")
      .then((r) => r.text())
      .then((text) => {
        const inner = text.replace(/<\?xml[^?]*\?>/g, "").replace(/<!DOCTYPE[^>]*>/g, "");
        setSvgContent(inner);
      });
  }, []);

  useEffect(() => {
    if (!svgContainerRef.current || !svgContent) return;
    const svg = svgContainerRef.current.querySelector("svg");
    if (!svg) return;

    const groups = svg.querySelectorAll<SVGGElement>("g[data-category]");
    groups.forEach((group) => {
      const catId = group.getAttribute("data-category") || "";
      const zone = zones.find((z) => z.id === catId);
      if (!zone) return;

      const color = getDensityColor(zone.density);
      const isSel = selectedZoneId === catId;
      const isHov = hoveredZone === catId;

      group.querySelectorAll<SVGPathElement>("path[data-seat], path[tc-selectable]").forEach((p) => {
        p.style.fill = color;
        p.style.opacity = isSel ? "0.85" : isHov ? "0.7" : "0.4";
        p.style.stroke = isSel ? "#fff" : isHov ? "#a1a1aa" : "#3f3f46";
        p.style.strokeWidth = isSel ? "1.5" : isHov ? "0.8" : "0.3";
        p.style.transition = "all 0.4s ease";
        p.style.cursor = "pointer";
      });
    });
  }, [zones, hoveredZone, selectedZoneId, svgContent]);

  useEffect(() => {
    if (!svgContainerRef.current || !svgContent) return;
    const svg = svgContainerRef.current.querySelector("svg");
    if (!svg) return;

    const groups = svg.querySelectorAll<SVGGElement>("g[data-category]");
    const cleanups: Array<() => void> = [];

    groups.forEach((group) => {
      const catId = group.getAttribute("data-category") || "";
      const zone = zones.find((z) => z.id === catId);
      if (!zone) return;

      const onEnter = () => setHoveredZone(catId);
      const onLeave = () => setHoveredZone(null);
      const onClick = () => onZoneSelect(zone);

      group.addEventListener("mouseenter", onEnter);
      group.addEventListener("mouseleave", onLeave);
      group.addEventListener("click", onClick);
      cleanups.push(() => {
        group.removeEventListener("mouseenter", onEnter);
        group.removeEventListener("mouseleave", onLeave);
        group.removeEventListener("click", onClick);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [zones, onZoneSelect, svgContent]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const hd = zones.find((z) => z.id === hoveredZone);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center" onMouseMove={handleMouseMove}>
      <div
        ref={svgContainerRef}
        className="w-full max-w-3xl aspect-square [&_svg]:w-full [&_svg]:h-full [&_svg]:drop-shadow-[0_0_60px_rgba(99,102,241,0.06)]"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />

      {hd && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute z-20 pointer-events-none bg-zinc-900/95 border border-zinc-700/80 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl min-w-[180px]"
          style={{ left: Math.min(tooltipPos.x + 16, (containerRef.current?.clientWidth || 600) - 220), top: Math.max(tooltipPos.y - 20, 10) }}
        >
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{hd.category}</p>
          <p className="text-sm font-bold text-white mt-0.5">{hd.name}</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: getDensityColor(hd.density) }} />
              <span className="text-xs text-zinc-300 tabular-nums">{Math.round(hd.density * 100)}%</span>
            </div>
            <span className="text-[10px] text-zinc-500">|</span>
            <span className="text-xs text-zinc-400">Wait: {hd.avgWaitTime}m</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
