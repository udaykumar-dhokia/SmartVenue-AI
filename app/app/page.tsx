"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TabSwitcher } from "@/components/shared/tab-switcher";
import { LayoutToggle } from "@/components/shared/layout-toggle";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AttendeeApp } from "@/components/attendee/attendee-app";
import { AttendeeWeb } from "@/components/attendee/attendee-web";
import { INITIAL_REVIEWS, type Review } from "@/lib/review-data";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"admin" | "attendee">("admin");
  const [attendeeLayout, setAttendeeLayout] = useState<"mobile" | "web">(
    "mobile",
  );
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  const handleSubmitReview = (review: Review) => {
    setReviews((prev) => [review, ...prev]);
  };

  return (
    <main className="flex flex-col h-screen bg-zinc-950 text-white overflow-hidden">
      <div className="flex items-center justify-center py-3 px-6 bg-zinc-950 border-b border-zinc-800/30 shrink-0 relative z-50">
        <div className="flex items-center gap-4">
          <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
          {activeTab === "attendee" && (
            <LayoutToggle
              layout={attendeeLayout}
              onChange={setAttendeeLayout}
            />
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="h-full absolute inset-0"
            >
              <AdminDashboard reviews={reviews} />
            </motion.div>
          )}

          {activeTab === "attendee" && (
            <motion.div
              key={`attendee-${attendeeLayout}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="h-full absolute inset-0"
            >
              {attendeeLayout === "mobile" ? (
                <AttendeeApp onSubmitReview={handleSubmitReview} />
              ) : (
                <AttendeeWeb onSubmitReview={handleSubmitReview} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
