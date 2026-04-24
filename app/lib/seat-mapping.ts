import { VENUE_ZONES } from "./venue-data";

interface SeatResult {
  found: boolean;
  sectionSelector: string;
  zoneName: string;
  zoneId: string;
  sectionLabel: string;
  nearestGate: string;
  walkTimeMinutes: number;
}

const ZONE_GATES: Record<string, { gate: string; walk: number }> = {
  "upper-tier-j": { gate: "Gate 4", walk: 5 },
  "upper-tier-k": { gate: "Gate 5", walk: 6 },
  "upper-tier-l": { gate: "Gate 6", walk: 4 },
  "upper-tier-m": { gate: "Gate 7", walk: 5 },
  "upper-tier-n": { gate: "Gate 8", walk: 4 },
  "upper-tier-p": { gate: "Gate 9", walk: 6 },
  "upper-tier-q": { gate: "Gate 10", walk: 5 },
  "upper-tier-r": { gate: "Gate 11", walk: 7 },
  "lower-tier-a": { gate: "Gate 3", walk: 3 },
  "lower-tier-b": { gate: "Gate 2", walk: 4 },
  "lower-tier-c": { gate: "Gate 1", walk: 3 },
  "lower-tier-d": { gate: "Gate 7", walk: 3 },
  "lower-tier-e": { gate: "Gate 8", walk: 4 },
  "lower-tier-f": { gate: "Gate 9", walk: 3 },
  "lower-tier-g": { gate: "Gate 10", walk: 4 },
  "lower-tier-h": { gate: "Gate 11", walk: 3 },
  "lower-tier-adani-pavilion-left": { gate: "Gate 6", walk: 2 },
  "lower-tier-adani-pavilion-center": { gate: "Gate 7", walk: 2 },
  "lower-tier-adani-pavilion-right": { gate: "Gate 8", walk: 2 },
  "upper-tier-adani-banquat-seats": { gate: "Gate 7", walk: 3 },
  "upper-tier-adani-premium-suite-4-floor": { gate: "VIP Gate A", walk: 2 },
  "upper-tier-adani-premium-suite-5-floor": { gate: "VIP Gate B", walk: 3 },
};

export function resolveSeat(input: string): SeatResult {
  const cleaned = input.trim().toUpperCase();
  const notFound: SeatResult = { found: false, sectionSelector: "", zoneName: "", zoneId: "", sectionLabel: cleaned, nearestGate: "", walkTimeMinutes: 0 };

  if (/^[3]\d{2}$/.test(cleaned)) {
    const zoneId = "upper-tier-adani-premium-suite-4-floor";
    const selector = `${zoneId}_${cleaned.toLowerCase()}`;
    const zone = VENUE_ZONES.find((z) => z.id === zoneId);
    const gateInfo = ZONE_GATES[zoneId];
    if (zone && zone.sections.includes(cleaned.toLowerCase())) {
      return { found: true, sectionSelector: selector, zoneName: zone.name, zoneId, sectionLabel: `Suite ${cleaned}`, nearestGate: gateInfo.gate, walkTimeMinutes: gateInfo.walk };
    }
  }

  if (/^[4]\d{2}$/.test(cleaned)) {
    const zoneId = "upper-tier-adani-premium-suite-5-floor";
    const selector = `${zoneId}_${cleaned.toLowerCase()}`;
    const zone = VENUE_ZONES.find((z) => z.id === zoneId);
    const gateInfo = ZONE_GATES[zoneId];
    if (zone && zone.sections.includes(cleaned.toLowerCase())) {
      return { found: true, sectionSelector: selector, zoneName: zone.name, zoneId, sectionLabel: `Suite ${cleaned}`, nearestGate: gateInfo.gate, walkTimeMinutes: gateInfo.walk };
    }
  }

  const dashMatch = cleaned.match(/^([A-R])\s*[-\s]\s*(\d+)$/);
  if (dashMatch) {
    const [, letter, section] = dashMatch;
    return resolveStandSection(letter, section);
  }

  const letterOnly = cleaned.match(/^([A-R])(\d+)$/);
  if (letterOnly) {
    const [, letter, section] = letterOnly;
    return resolveStandSection(letter, section);
  }

  if (/^[A-R]$/.test(cleaned)) {
    return resolveStandSection(cleaned, "1");
  }

  const pavilionMatch = cleaned.match(/^PAV(?:ILION)?\s*(L(?:EFT)?|C(?:ENTER)?|R(?:IGHT)?)\s*[-]?\s*(\d+)?$/i);
  if (pavilionMatch) {
    const dir = pavilionMatch[1].charAt(0);
    const sec = pavilionMatch[2] || "1";
    const dirMap: Record<string, string> = { L: "left", C: "center", R: "right" };
    const zoneId = `lower-tier-adani-pavilion-${dirMap[dir]}`;
    const zone = VENUE_ZONES.find((z) => z.id === zoneId);
    const gateInfo = ZONE_GATES[zoneId];
    if (zone) {
      return { found: true, sectionSelector: `${zoneId}_${sec}`, zoneName: zone.name, zoneId, sectionLabel: `${zone.name} Sec ${sec}`, nearestGate: gateInfo?.gate || "Gate 7", walkTimeMinutes: gateInfo?.walk || 3 };
    }
  }

  return notFound;
}

function resolveStandSection(letter: string, section: string): SeatResult {
  const letterLower = letter.toLowerCase();
  const upperTierIds = ["j", "k", "l", "m", "n", "p", "q", "r"];
  const lowerTierIds = ["a", "b", "c", "d", "e", "f", "g", "h"];

  let zoneId = "";
  if (upperTierIds.includes(letterLower)) {
    zoneId = `upper-tier-${letterLower}`;
  } else if (lowerTierIds.includes(letterLower)) {
    zoneId = `lower-tier-${letterLower}`;
  }

  if (!zoneId) return { found: false, sectionSelector: "", zoneName: "", zoneId: "", sectionLabel: `${letter}-${section}`, nearestGate: "", walkTimeMinutes: 0 };

  const zone = VENUE_ZONES.find((z) => z.id === zoneId);
  const gateInfo = ZONE_GATES[zoneId];

  if (!zone) return { found: false, sectionSelector: "", zoneName: "", zoneId: "", sectionLabel: `${letter}-${section}`, nearestGate: "", walkTimeMinutes: 0 };

  const sectionSelector = `${zoneId}_${section}`;
  return {
    found: true,
    sectionSelector,
    zoneName: zone.name,
    zoneId,
    sectionLabel: `Stand ${letter.toUpperCase()} Section ${section}`,
    nearestGate: gateInfo?.gate || "Gate 1",
    walkTimeMinutes: gateInfo?.walk || 5,
  };
}

export function getAllSeatSuggestions(): string[] {
  const suggestions: string[] = [];
  VENUE_ZONES.forEach((z) => {
    if (z.tier === "upper" || z.tier === "lower") {
      const letter = z.name.replace("Stand ", "").replace("Reliance Stand ", "").charAt(0);
      z.sections.forEach((s) => suggestions.push(`${letter}-${s}`));
    }
    if (z.tier === "suite") {
      z.sections.forEach((s) => suggestions.push(s));
    }
  });
  return suggestions;
}
