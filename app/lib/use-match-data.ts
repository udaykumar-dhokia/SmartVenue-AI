"use client";

import { useState, useEffect } from "react";
import { MATCH_INFO } from "@/lib/venue-data";

export function useMatchData() {
  const [matchData, setMatchData] = useState(MATCH_INFO);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState<"live" | "mock">("mock");

  useEffect(() => {
    let isMounted = true;

    async function fetchMatchData() {
      try {
        const response = await fetch("/api/match");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        
        if (isMounted && data.data) {
          setMatchData(data.data);
          setSource(data.source);
        }
      } catch (error) {
        console.error("Failed to fetch live match data:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    // Initial fetch
    fetchMatchData();

    // Poll every 20 seconds as requested
    const intervalId = setInterval(fetchMatchData, 20000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return { matchData, isLoading, source };
}
