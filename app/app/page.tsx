"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TabSwitcher } from "@/components/shared/tab-switcher";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AttendeeApp } from "@/components/attendee/attendee-app";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"admin" | "attendee">("admin");

  return (
    <main className="flex flex-col h-screen bg-zinc-950 text-white overflow-hidden">
      <div className="flex items-center justify-center py-3 px-6 bg-zinc-950 border-b border-zinc-800/30 shrink-0">
        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="h-full"
          >
            {activeTab === "admin" ? <AdminDashboard /> : <AttendeeApp />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
