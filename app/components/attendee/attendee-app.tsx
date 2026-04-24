"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Bell, Utensils, Ticket, MessageCircle } from "lucide-react";
import { MATCH_INFO, ATTENDEE_PROFILE } from "@/lib/venue-data";
import { LiveIndicator } from "@/components/shared/live-indicator";
import { TicketInfo } from "./ticket-info";
import { AttendeeMap } from "./attendee-map";
import { SmartNudges } from "./smart-nudges";
import { PreOrder } from "./pre-order";
import { ChatAssistant } from "./chat-assistant";

const TABS = [
  { id: "map", label: "Map", icon: Map },
  { id: "nudges", label: "Nudges", icon: Bell },
  { id: "food", label: "Food", icon: Utensils },
  { id: "ticket", label: "Ticket", icon: Ticket },
  { id: "chat", label: "Chat", icon: MessageCircle },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AttendeeApp() {
  const [activeTab, setActiveTab] = useState<TabId>("map");

  return (
    <div className="flex items-center justify-center h-full bg-zinc-950 p-6">
      <div className="relative w-[390px] h-[780px] rounded-[3rem] border-[6px] border-zinc-700 bg-zinc-950 shadow-2xl shadow-black/60 overflow-hidden flex flex-col">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-zinc-700 rounded-b-2xl z-20" />

        <header className="shrink-0 pt-9 pb-2 px-5 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-zinc-500 font-medium">{MATCH_INFO.venue.split(",")[0]}</p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-sm font-black text-white">{MATCH_INFO.team1Short}</span>
                <span className="text-lg font-black text-indigo-400">{MATCH_INFO.score.team1.runs}/{MATCH_INFO.score.team1.wickets}</span>
                <span className="text-[10px] text-zinc-500">({MATCH_INFO.score.team1.overs} ov)</span>
              </div>
              <p className="text-[10px] text-zinc-600">vs {MATCH_INFO.team2Short}</p>
            </div>
            <LiveIndicator />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className={activeTab === "chat" ? "h-full flex flex-col" : ""}
            >
              {activeTab === "map" && <AttendeeMap />}
              {activeTab === "nudges" && <SmartNudges />}
              {activeTab === "food" && <PreOrder />}
              {activeTab === "ticket" && <TicketInfo />}
              {activeTab === "chat" && <ChatAssistant />}
            </motion.div>
          </AnimatePresence>
        </main>

        <nav className="shrink-0 border-t border-zinc-800/60 bg-zinc-950/95 backdrop-blur-xl px-2 pb-6 pt-2">
          <div className="flex items-center justify-around">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${isActive ? "text-indigo-400" : "text-zinc-600 hover:text-zinc-400"}`}
                >
                  <tab.icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                  <span className="text-[9px] font-semibold">{tab.label}</span>
                  {isActive && <motion.div layoutId="attendee-tab" className="h-0.5 w-5 rounded-full bg-indigo-400" />}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
