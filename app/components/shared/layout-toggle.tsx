"use client";

import { motion } from "framer-motion";
import { Smartphone, Monitor } from "lucide-react";

interface LayoutToggleProps {
  layout: "mobile" | "web";
  onChange: (layout: "mobile" | "web") => void;
}

export function LayoutToggle({ layout, onChange }: LayoutToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-zinc-900/60 p-1 rounded-lg border border-zinc-800/40 backdrop-blur-md">
      <button
        onClick={() => onChange("mobile")}
        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold transition-colors z-10 ${layout === "mobile" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
      >
        <Smartphone size={12} />
        Mobile
        {layout === "mobile" && (
          <motion.div layoutId="layout-toggle" className="absolute inset-0 rounded-md bg-zinc-700/60 -z-10" />
        )}
      </button>
      <button
        onClick={() => onChange("web")}
        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold transition-colors z-10 ${layout === "web" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
      >
        <Monitor size={12} />
        Web
        {layout === "web" && (
          <motion.div layoutId="layout-toggle" className="absolute inset-0 rounded-md bg-zinc-700/60 -z-10" />
        )}
      </button>
    </div>
  );
}
