"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send, CheckCircle } from "lucide-react";
import { VENUE_ZONES, ATTENDEE_PROFILE } from "@/lib/venue-data";
import type { Review } from "@/lib/review-data";

interface SubmitReviewProps {
  onSubmit: (review: Review) => void;
}

export function SubmitReview({ onSubmit }: SubmitReviewProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [text, setText] = useState("");
  const [zone, setZone] = useState(VENUE_ZONES.find((z) => z.id === ATTENDEE_PROFILE.zone)?.name || "Stand J");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0 || !text.trim()) return;
    const review: Review = {
      id: `r-${Date.now()}`,
      author: ATTENDEE_PROFILE.name,
      text: text.trim(),
      rating,
      zone,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    };
    onSubmit(review);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setText("");
    }, 2500);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-8 flex flex-col items-center justify-center gap-3">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <CheckCircle size={48} className="text-emerald-400" />
        </motion.div>
        <p className="text-sm font-bold text-white">Review Submitted</p>
        <p className="text-xs text-zinc-500">Thank you for your feedback!</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-4 space-y-5">
      <div>
        <p className="text-xs font-semibold text-zinc-400 mb-1">How is your experience?</p>
        <p className="text-[10px] text-zinc-600">Your feedback helps us improve the venue.</p>
      </div>

      <div>
        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Rating</p>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onMouseEnter={() => setHoveredStar(s)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => setRating(s)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={28}
                fill={s <= (hoveredStar || rating) ? "#eab308" : "transparent"}
                className={s <= (hoveredStar || rating) ? "text-yellow-500" : "text-zinc-700"}
                strokeWidth={1.5}
              />
            </button>
          ))}
          {rating > 0 && <span className="ml-2 text-xs text-zinc-400">{["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}</span>}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Your Review</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 200))}
          placeholder="Share your experience at the venue..."
          rows={3}
          className="w-full bg-zinc-800/60 border border-zinc-700/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 resize-none"
        />
        <p className="text-[9px] text-zinc-600 text-right mt-1">{text.length}/200</p>
      </div>

      <div>
        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Zone</p>
        <select
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          className="w-full bg-zinc-800/60 border border-zinc-700/40 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50 appearance-none"
        >
          {VENUE_ZONES.map((z) => (
            <option key={z.id} value={z.name}>{z.name}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        disabled={rating === 0 || !text.trim()}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Send size={14} />
        Submit Review
      </button>
    </motion.div>
  );
}
