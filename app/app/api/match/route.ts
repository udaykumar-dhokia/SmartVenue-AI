import { NextResponse } from "next/server";
import { MATCH_INFO } from "@/lib/venue-data";

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_CRICAPI_KEY;
  if (!apiKey || apiKey === "your_cricapi_key_here") {
    // Return static mock data if no key is provided
    return NextResponse.json({ data: MATCH_INFO, source: "mock" });
  }

  try {
    const matchId = "ed074a44-a661-4727-83a7-4a33c2a05165";
    const response = await fetch(
      `https://api.cricapi.com/v1/match_info?apikey=${apiKey}&offset=0&id=${matchId}`,
      { next: { revalidate: 20 } },
    );

    if (!response.ok) {
      throw new Error(`CricAPI returned ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "success" || !data.data) {
      throw new Error("Invalid response from CricAPI");
    }

    const matchData = data.data;

    // Transform API response to our app's structure
    // Find the latest score, which is typically the last element in the score array for the current inning
    let currentScore = { runs: 0, wickets: 0, overs: "0.0" };
    let innings = "1st Innings";
    let battingTeam = matchData.teamInfo?.[0]?.shortname || "T1";

    if (matchData.score && matchData.score.length > 0) {
      const latestInning = matchData.score[matchData.score.length - 1];
      currentScore = {
        runs: latestInning.r,
        wickets: latestInning.w,
        overs: latestInning.o.toString(),
      };

      // Attempt to determine the batting team from the inning string (e.g., "Gujarat Titans Inning 1")
      const inningStr = latestInning.inning || "";
      const isTeam2Batting =
        matchData.teams &&
        matchData.teams[1] &&
        inningStr.includes(matchData.teams[1]);

      battingTeam = isTeam2Batting
        ? matchData.teamInfo?.[1]?.shortname || "T2"
        : matchData.teamInfo?.[0]?.shortname || "T1";

      innings = matchData.score.length === 1 ? "1st Innings" : "2nd Innings";
    }

    const transformedData = {
      team1:
        matchData.teamInfo?.[0]?.name ||
        matchData.teams?.[0] ||
        MATCH_INFO.team1,
      team1Short: matchData.teamInfo?.[0]?.shortname || MATCH_INFO.team1Short,
      team2:
        matchData.teamInfo?.[1]?.name ||
        matchData.teams?.[1] ||
        MATCH_INFO.team2,
      team2Short: matchData.teamInfo?.[1]?.shortname || MATCH_INFO.team2Short,
      venue: matchData.venue || MATCH_INFO.venue,
      date: new Date(matchData.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: "LIVE", // Can extract time from dateTimeGMT if needed
      status: matchData.status || MATCH_INFO.status,
      innings,
      score: {
        team1: currentScore, // Simply tracking the current batting score here to map to UI
        team2: { runs: 0, wickets: 0, overs: "0.0" }, // Not showing past innings in current UI
      },
      battingTeam,
    };

    return NextResponse.json({ data: transformedData, source: "live" });
  } catch (error) {
    console.error("CricAPI Error:", error);
    // Fallback to static mock data on error
    return NextResponse.json({
      data: MATCH_INFO,
      source: "mock",
      error: "Failed to fetch live data",
    });
  }
}
