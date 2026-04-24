"use client";

import { motion } from "framer-motion";
import { Monitor, Smartphone } from "lucide-react";

interface TabSwitcherProps {
  activeTab: "admin" | "attendee";
  onTabChange: (tab: "admin" | "attendee") => void;
}

export function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <div className="relative flex items-center rounded-xl bg-zinc-900/80 border border-zinc-800 p-1 backdrop-blur-xl">
      <motion.div
        className="absolute top-1 bottom-1 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20"
        layoutId="tab-indicator"
        style={{
          left: activeTab === "admin" ? 4 : "50%",
          width: "calc(50% - 4px)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
      <button
        id="tab-admin"
        onClick={() => onTabChange("admin")}
        className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors w-1/2 justify-center ${activeTab === "admin" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
      >
        <Monitor size={16} />
        <span>Admin</span>
      </button>
      <button
        id="tab-attendee"
        onClick={() => onTabChange("attendee")}
        className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors w-1/2 justify-center ${activeTab === "attendee" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
      >
        <Smartphone size={16} />
        <span>Attendee </span>
      </button>
    </div>
  );
}
