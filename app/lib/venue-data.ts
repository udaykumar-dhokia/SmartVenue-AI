export interface VenueZone {
  id: string;
  name: string;
  category: string;
  tier: "upper" | "lower" | "pavilion" | "suite" | "special";
  sections: string[];
  capacity: number;
  currentOccupancy: number;
  density: number;
  avgWaitTime: number;
  temperature: number;
  incidents: number;
  color: string;
}

export interface ConcessionOutlet {
  id: string;
  name: string;
  zone: string;
  waitTime: number;
  itemsSold: number;
  revenue: number;
  stockLevel: number;
  popularItems: string[];
}

export interface MatchEvent {
  id: string;
  time: string;
  type:
    | "wicket"
    | "boundary"
    | "six"
    | "over"
    | "drinks"
    | "innings"
    | "timeout";
  description: string;
}

export interface Alert {
  id: string;
  type: "safety" | "congestion" | "concession" | "maintenance";
  severity: "critical" | "warning" | "info";
  zone: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface AttendeeProfile {
  name: string;
  ticketId: string;
  seat: {
    section: string;
    row: string;
    number: number;
  };
  gate: string;
  zone: string;
}

export const VENUE_ZONES: VenueZone[] = [
  {
    id: "upper-tier-j",
    name: "Stand J",
    category: "Upper Tier",
    tier: "upper",
    sections: ["1", "2", "3", "4", "5"],
    capacity: 8000,
    currentOccupancy: 6400,
    density: 0.8,
    avgWaitTime: 8,
    temperature: 32,
    incidents: 0,
    color: "#45ca29",
  },
  {
    id: "upper-tier-k",
    name: "Stand K",
    category: "Upper Tier",
    tier: "upper",
    sections: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    capacity: 12000,
    currentOccupancy: 4800,
    density: 0.4,
    avgWaitTime: 3,
    temperature: 31,
    incidents: 0,
    color: "#4860dd",
  },
  {
    id: "upper-tier-l",
    name: "Stand L",
    category: "Upper Tier",
    tier: "upper",
    sections: ["1", "2", "3", "4", "5"],
    capacity: 8000,
    currentOccupancy: 1600,
    density: 0.2,
    avgWaitTime: 1,
    temperature: 30,
    incidents: 0,
    color: "#ffffff",
  },
  {
    id: "upper-tier-m",
    name: "Stand M",
    category: "Upper Tier",
    tier: "upper",
    sections: ["1", "2", "3", "4", "5"],
    capacity: 8000,
    currentOccupancy: 800,
    density: 0.1,
    avgWaitTime: 1,
    temperature: 30,
    incidents: 0,
    color: "#cda8f6",
  },
  {
    id: "upper-tier-n",
    name: "Reliance Stand N",
    category: "Upper Tier",
    tier: "upper",
    sections: ["1", "2", "3", "4", "5", "6", "7"],
    capacity: 10000,
    currentOccupancy: 6000,
    density: 0.6,
    avgWaitTime: 5,
    temperature: 33,
    incidents: 0,
    color: "#7213af",
  },
  {
    id: "upper-tier-p",
    name: "Stand P",
    category: "Upper Tier",
    tier: "upper",
    sections: ["1", "2", "3", "4", "5"],
    capacity: 8000,
    currentOccupancy: 5600,
    density: 0.7,
    avgWaitTime: 6,
    temperature: 32,
    incidents: 1,
    color: "#af50d1",
  },
  {
    id: "upper-tier-q",
    name: "Stand Q",
    category: "Upper Tier",
    tier: "upper",
    sections: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    capacity: 12000,
    currentOccupancy: 3600,
    density: 0.3,
    avgWaitTime: 2,
    temperature: 31,
    incidents: 0,
    color: "#ffffff",
  },
  {
    id: "upper-tier-r",
    name: "Stand R",
    category: "Upper Tier",
    tier: "upper",
    sections: ["1", "2", "3", "4", "5"],
    capacity: 8000,
    currentOccupancy: 4000,
    density: 0.5,
    avgWaitTime: 4,
    temperature: 31,
    incidents: 0,
    color: "#ffffff",
  },
  {
    id: "lower-tier-a",
    name: "Stand A",
    category: "Lower Tier",
    tier: "lower",
    sections: ["1", "2", "3", "4", "5"],
    capacity: 5000,
    currentOccupancy: 4500,
    density: 0.9,
    avgWaitTime: 12,
    temperature: 34,
    incidents: 0,
    color: "#ffffff",
  },
  {
    id: "lower-tier-b",
    name: "Stand B",
    category: "Lower Tier",
    tier: "lower",
    sections: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    capacity: 8000,
    currentOccupancy: 5600,
    density: 0.7,
    avgWaitTime: 7,
    temperature: 33,
    incidents: 0,
    color: "#ffffff",
  },
  {
    id: "lower-tier-c",
    name: "Stand C",
    category: "Lower Tier",
    tier: "lower",
    sections: ["1", "2", "3", "4", "5"],
    capacity: 5000,
    currentOccupancy: 3000,
    density: 0.6,
    avgWaitTime: 5,
    temperature: 32,
    incidents: 0,
    color: "#ffffff",
  },
  {
    id: "lower-tier-d",
    name: "Stand D",
    category: "Lower Tier",
    tier: "lower",
    sections: ["1", "2", "3", "4", "5"],
    capacity: 5000,
    currentOccupancy: 2500,
    density: 0.5,
    avgWaitTime: 4,
    temperature: 31,
    incidents: 0,
    color: "#ffffff",
  },
  {
    id: "lower-tier-e",
    name: "Reliance Stand E",
    category: "Lower Tier",
    tier: "lower",
    sections: ["1", "2", "3", "4", "5", "6", "7"],
    capacity: 7000,
    currentOccupancy: 2100,
    density: 0.3,
    avgWaitTime: 2,
    temperature: 30,
    incidents: 0,
    color: "#ffffff",
  },
  {
    id: "lower-tier-f",
    name: "Stand F",
    category: "Lower Tier",
    tier: "lower",
    sections: ["1", "2", "3", "4"],
    capacity: 4000,
    currentOccupancy: 1600,
    density: 0.4,
    avgWaitTime: 3,
    temperature: 31,
    incidents: 0,
    color: "#ffffff",
  },
  {
    id: "lower-tier-g",
    name: "Stand G",
    category: "Lower Tier",
    tier: "lower",
    sections: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    capacity: 8000,
    currentOccupancy: 4800,
    density: 0.6,
    avgWaitTime: 5,
    temperature: 32,
    incidents: 0,
    color: "#ffffff",
  },
  {
    id: "lower-tier-h",
    name: "Stand H",
    category: "Lower Tier",
    tier: "lower",
    sections: ["1", "2", "3", "4", "5"],
    capacity: 5000,
    currentOccupancy: 3500,
    density: 0.7,
    avgWaitTime: 6,
    temperature: 33,
    incidents: 0,
    color: "#ffffff",
  },
  {
    id: "lower-tier-adani-pavilion-left",
    name: "Adani Pavilion Left",
    category: "Pavilion",
    tier: "pavilion",
    sections: ["1", "2", "3", "4"],
    capacity: 3000,
    currentOccupancy: 900,
    density: 0.3,
    avgWaitTime: 2,
    temperature: 28,
    incidents: 0,
    color: "#ffffff",
  },
  {
    id: "lower-tier-adani-pavilion-center",
    name: "Adani Pavilion Center",
    category: "Pavilion",
    tier: "pavilion",
    sections: ["1", "2", "3", "4"],
    capacity: 3000,
    currentOccupancy: 2700,
    density: 0.9,
    avgWaitTime: 14,
    temperature: 29,
    incidents: 1,
    color: "#ffffff",
  },
  {
    id: "lower-tier-adani-pavilion-right",
    name: "Adani Pavilion Right",
    category: "Pavilion",
    tier: "pavilion",
    sections: ["1", "2", "3", "4"],
    capacity: 3000,
    currentOccupancy: 1500,
    density: 0.5,
    avgWaitTime: 4,
    temperature: 28,
    incidents: 0,
    color: "#ffffff",
  },
  {
    id: "upper-tier-adani-banquat-seats",
    name: "Adani Banquet Seats",
    category: "Special",
    tier: "special",
    sections: [],
    capacity: 2000,
    currentOccupancy: 1800,
    density: 0.9,
    avgWaitTime: 2,
    temperature: 24,
    incidents: 0,
    color: "#ffffff",
  },
  {
    id: "upper-tier-adani-premium-suite-4-floor",
    name: "Premium Suite 4th Floor",
    category: "Suite",
    tier: "suite",
    sections: [
      "301",
      "302",
      "303",
      "304",
      "305",
      "306",
      "307",
      "308",
      "309",
      "310",
      "311",
      "312",
      "313",
      "314",
      "315",
      "316",
      "317",
      "319",
      "320",
      "321",
      "322",
      "323",
      "324",
      "325",
      "326",
      "327",
      "328",
      "329",
      "330",
      "331",
      "332",
      "333",
      "334",
      "335",
    ],
    capacity: 5000,
    currentOccupancy: 3500,
    density: 0.7,
    avgWaitTime: 3,
    temperature: 24,
    incidents: 0,
    color: "#ffffff",
  },
  {
    id: "upper-tier-adani-premium-suite-5-floor",
    name: "Premium Suite 5th Floor",
    category: "Suite",
    tier: "suite",
    sections: [
      "401",
      "402",
      "403",
      "404",
      "405",
      "406",
      "407",
      "408",
      "409",
      "410",
      "411",
      "412",
      "413",
      "414",
      "415",
      "416",
      "417",
      "418",
      "419",
      "420",
      "421",
      "422",
      "423",
      "424",
      "425",
      "426",
      "427",
      "428",
      "429",
      "430",
      "431",
      "432",
      "433",
      "434",
      "435",
      "436",
      "437",
      "438",
    ],
    capacity: 5000,
    currentOccupancy: 4000,
    density: 0.8,
    avgWaitTime: 4,
    temperature: 24,
    incidents: 0,
    color: "#ffffff",
  },
];

export const CONCESSION_OUTLETS: ConcessionOutlet[] = [
  {
    id: "c1",
    name: "Gujarat Express",
    zone: "Stand A",
    waitTime: 12,
    itemsSold: 342,
    revenue: 68400,
    stockLevel: 0.6,
    popularItems: ["Gujarat", "Khandvi", "Fafda"],
  },
  {
    id: "c2",
    name: "Biryani Point",
    zone: "Stand B",
    waitTime: 8,
    itemsSold: 567,
    revenue: 141750,
    stockLevel: 0.4,
    popularItems: ["Chicken Biryani", "Veg Biryani", "Raita"],
  },
  {
    id: "c3",
    name: "Chaat Corner",
    zone: "Stand D",
    waitTime: 3,
    itemsSold: 234,
    revenue: 23400,
    stockLevel: 0.8,
    popularItems: ["Pani Puri", "Bhel", "Sev Puri"],
  },
  {
    id: "c4",
    name: "Pizza Hub",
    zone: "Stand G",
    waitTime: 6,
    itemsSold: 189,
    revenue: 56700,
    stockLevel: 0.7,
    popularItems: ["Margherita", "Pepperoni", "Garlic Bread"],
  },
  {
    id: "c5",
    name: "Cold Drinks Bar",
    zone: "Stand J",
    waitTime: 2,
    itemsSold: 890,
    revenue: 89000,
    stockLevel: 0.3,
    popularItems: ["Pepsi", "7Up", "Water"],
  },
  {
    id: "c6",
    name: "Ice Cream Parlor",
    zone: "Stand N",
    waitTime: 4,
    itemsSold: 456,
    revenue: 45600,
    stockLevel: 0.5,
    popularItems: ["Vanilla", "Mango", "Butterscotch"],
  },
  {
    id: "c7",
    name: "Samosa Junction",
    zone: "Pavilion Center",
    waitTime: 14,
    itemsSold: 678,
    revenue: 33900,
    stockLevel: 0.2,
    popularItems: ["Samosa", "Kachori", "Jalebi"],
  },
  {
    id: "c8",
    name: "South Indian Cafe",
    zone: "Stand P",
    waitTime: 5,
    itemsSold: 321,
    revenue: 48150,
    stockLevel: 0.6,
    popularItems: ["Dosa", "Idli", "Vada"],
  },
];

export const MATCH_INFO = {
  team1: "Gujarat Titans",
  team1Short: "GT",
  team2: "Royal Challengers Bengaluru",
  team2Short: "RCB",
  venue: "Narendra Modi Stadium, Ahmedabad",
  date: "April 24, 2026",
  time: "7:30 PM IST",
  status: "LIVE",
  innings: "1st Innings",
  score: {
    team1: { runs: 156, wickets: 4, overs: "16.3" },
    team2: { runs: 0, wickets: 0, overs: "0.0" },
  },
  battingTeam: "GT",
};

export const ATTENDEE_PROFILE: AttendeeProfile = {
  name: "Rahul Sharma",
  ticketId: "GT-RCB-2026-04-24-A3421",
  seat: {
    section: "J",
    row: "F",
    number: 24,
  },
  gate: "Gate 4",
  zone: "upper-tier-j",
};

export function getDensityColor(density: number): string {
  if (density >= 0.85) return "#ef4444";
  if (density >= 0.7) return "#f97316";
  if (density >= 0.5) return "#eab308";
  if (density >= 0.3) return "#22c55e";
  return "#10b981";
}

export function getDensityLabel(density: number): string {
  if (density >= 0.85) return "Critical";
  if (density >= 0.7) return "High";
  if (density >= 0.5) return "Moderate";
  if (density >= 0.3) return "Low";
  return "Minimal";
}
