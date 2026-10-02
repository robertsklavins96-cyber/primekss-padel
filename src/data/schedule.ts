import type { Player, ScheduleEntry } from '../types';

// Fixed player roster. Latvian characters (ā, ī, š, ņ, etc.) must be preserved exactly.
export const PLAYERS: Player[] = [
  { id: "maris", name: "Māris" },
  { id: "artjoms", name: "Artjoms" },
  { id: "ulvis", name: "Ulvis" },
  { id: "markuss", name: "Markuss" },
  { id: "martins", name: "Mārtiņš" },
  { id: "atis", name: "Atis" },
  { id: "gints", name: "Gints" },
  { id: "edgars", name: "Edgars" },
  { id: "roberts", name: "Roberts" },
  { id: "pavels", name: "Pāvels" },
  { id: "emilija", name: "Emīlija" },
  { id: "nauris", name: "Nauris" },
  { id: "davis", name: "Dāvis" },
  { id: "rudolfs", name: "Rudolfs" },
  { id: "regnars", name: "Regnārs" },
  { id: "juris", name: "Juris" },
];

export const TOURNAMENT_NAME = 'Americano Padel Tournament';
export const TOURNAMENT_START_TIME = '16:30';
export const TOURNAMENT_END_TIME = '19:00';
export const NUMBER_OF_PLAYERS = 16;
export const NUMBER_OF_COURTS = 4;
export const NUMBER_OF_ROUNDS = 8;
export const POINTS_PER_MATCH = 21;

export interface FixedMatchDef {
  id: string;
  roundNumber: number;
  courtNumber: number;
  startTime: string;
  endTime: string;
  team1: [string, string];
  team2: [string, string];
}

export interface FixedBreakDef {
  id: string;
  breakNumber: number;
  afterRound: number;
  startTime: string;
  endTime: string;
}

// The exact, fixed schedule generated for the 16-player / 4-court format:
// every player plays all 8 rounds, no repeated partnerships, no opponent
// pairing occurs more than twice, and teams are balanced using the user's
// 4-tier strength ranking (Tier 1 strongest ... Tier 4 weakest).
export const FIXED_MATCHES: FixedMatchDef[] = [
  // Round 1: 16:30-16:45
  { id: "round-1-court-1", roundNumber: 1, courtNumber: 1, startTime: "16:30", endTime: "16:45", team1: ["maris", "pavels"], team2: ["edgars", "ulvis"] },
  { id: "round-1-court-2", roundNumber: 1, courtNumber: 2, startTime: "16:30", endTime: "16:45", team1: ["atis", "davis"], team2: ["martins", "gints"] },
  { id: "round-1-court-3", roundNumber: 1, courtNumber: 3, startTime: "16:30", endTime: "16:45", team1: ["rudolfs", "artjoms"], team2: ["nauris", "emilija"] },
  { id: "round-1-court-4", roundNumber: 1, courtNumber: 4, startTime: "16:30", endTime: "16:45", team1: ["juris", "roberts"], team2: ["regnars", "markuss"] },

  // Round 2: 16:45-17:00
  { id: "round-2-court-1", roundNumber: 2, courtNumber: 1, startTime: "16:45", endTime: "17:00", team1: ["gints", "davis"], team2: ["regnars", "maris"] },
  { id: "round-2-court-2", roundNumber: 2, courtNumber: 2, startTime: "16:45", endTime: "17:00", team1: ["emilija", "martins"], team2: ["nauris", "juris"] },
  { id: "round-2-court-3", roundNumber: 2, courtNumber: 3, startTime: "16:45", endTime: "17:00", team1: ["pavels", "edgars"], team2: ["rudolfs", "atis"] },
  { id: "round-2-court-4", roundNumber: 2, courtNumber: 4, startTime: "16:45", endTime: "17:00", team1: ["ulvis", "artjoms"], team2: ["roberts", "markuss"] },

  // Round 3: 17:00-17:15
  { id: "round-3-court-1", roundNumber: 3, courtNumber: 1, startTime: "17:00", endTime: "17:15", team1: ["rudolfs", "juris"], team2: ["markuss", "davis"] },
  { id: "round-3-court-2", roundNumber: 3, courtNumber: 2, startTime: "17:00", endTime: "17:15", team1: ["atis", "nauris"], team2: ["gints", "pavels"] },
  { id: "round-3-court-3", roundNumber: 3, courtNumber: 3, startTime: "17:00", endTime: "17:15", team1: ["roberts", "maris"], team2: ["ulvis", "emilija"] },
  { id: "round-3-court-4", roundNumber: 3, courtNumber: 4, startTime: "17:00", endTime: "17:15", team1: ["artjoms", "martins"], team2: ["edgars", "regnars"] },

  // Round 4: 17:15-17:30
  { id: "round-4-court-1", roundNumber: 4, courtNumber: 1, startTime: "17:15", endTime: "17:30", team1: ["roberts", "regnars"], team2: ["pavels", "davis"] },
  { id: "round-4-court-2", roundNumber: 4, courtNumber: 2, startTime: "17:15", endTime: "17:30", team1: ["edgars", "markuss"], team2: ["emilija", "rudolfs"] },
  { id: "round-4-court-3", roundNumber: 4, courtNumber: 3, startTime: "17:15", endTime: "17:30", team1: ["martins", "nauris"], team2: ["atis", "ulvis"] },
  { id: "round-4-court-4", roundNumber: 4, courtNumber: 4, startTime: "17:15", endTime: "17:30", team1: ["gints", "maris"], team2: ["artjoms", "juris"] },

  // Round 5: 17:45-18:00
  { id: "round-5-court-1", roundNumber: 5, courtNumber: 1, startTime: "17:45", endTime: "18:00", team1: ["rudolfs", "edgars"], team2: ["artjoms", "regnars"] },
  { id: "round-5-court-2", roundNumber: 5, courtNumber: 2, startTime: "17:45", endTime: "18:00", team1: ["markuss", "martins"], team2: ["nauris", "roberts"] },
  { id: "round-5-court-3", roundNumber: 5, courtNumber: 3, startTime: "17:45", endTime: "18:00", team1: ["emilija", "atis"], team2: ["davis", "maris"] },
  { id: "round-5-court-4", roundNumber: 5, courtNumber: 4, startTime: "17:45", endTime: "18:00", team1: ["juris", "pavels"], team2: ["gints", "ulvis"] },

  // Round 6: 18:00-18:15
  { id: "round-6-court-1", roundNumber: 6, courtNumber: 1, startTime: "18:00", endTime: "18:15", team1: ["emilija", "juris"], team2: ["edgars", "artjoms"] },
  { id: "round-6-court-2", roundNumber: 6, courtNumber: 2, startTime: "18:00", endTime: "18:15", team1: ["regnars", "pavels"], team2: ["martins", "roberts"] },
  { id: "round-6-court-3", roundNumber: 6, courtNumber: 3, startTime: "18:00", endTime: "18:15", team1: ["rudolfs", "markuss"], team2: ["nauris", "davis"] },
  { id: "round-6-court-4", roundNumber: 6, courtNumber: 4, startTime: "18:00", endTime: "18:15", team1: ["maris", "ulvis"], team2: ["atis", "gints"] },

  // Round 7: 18:30-18:45
  { id: "round-7-court-1", roundNumber: 7, courtNumber: 1, startTime: "18:30", endTime: "18:45", team1: ["edgars", "martins"], team2: ["ulvis", "markuss"] },
  { id: "round-7-court-2", roundNumber: 7, courtNumber: 2, startTime: "18:30", endTime: "18:45", team1: ["davis", "rudolfs"], team2: ["atis", "maris"] },
  { id: "round-7-court-3", roundNumber: 7, courtNumber: 3, startTime: "18:30", endTime: "18:45", team1: ["juris", "regnars"], team2: ["emilija", "pavels"] },
  { id: "round-7-court-4", roundNumber: 7, courtNumber: 4, startTime: "18:30", endTime: "18:45", team1: ["nauris", "gints"], team2: ["artjoms", "roberts"] },

  // Round 8: 18:45-19:00
  { id: "round-8-court-1", roundNumber: 8, courtNumber: 1, startTime: "18:45", endTime: "19:00", team1: ["rudolfs", "gints"], team2: ["emilija", "roberts"] },
  { id: "round-8-court-2", roundNumber: 8, courtNumber: 2, startTime: "18:45", endTime: "19:00", team1: ["regnars", "atis"], team2: ["nauris", "ulvis"] },
  { id: "round-8-court-3", roundNumber: 8, courtNumber: 3, startTime: "18:45", endTime: "19:00", team1: ["martins", "maris"], team2: ["pavels", "artjoms"] },
  { id: "round-8-court-4", roundNumber: 8, courtNumber: 4, startTime: "18:45", endTime: "19:00", team1: ["davis", "edgars"], team2: ["markuss", "juris"] },

];

export const FIXED_BREAKS: FixedBreakDef[] = [
  { id: 'break-1', breakNumber: 1, afterRound: 4, startTime: '17:30', endTime: '17:45' },
  { id: 'break-2', breakNumber: 2, afterRound: 6, startTime: '18:15', endTime: '18:30' },
];

export const ROUND_TIMES: { roundNumber: number; startTime: string; endTime: string }[] = [
  { roundNumber: 1, startTime: "16:30", endTime: "16:45" },
  { roundNumber: 2, startTime: "16:45", endTime: "17:00" },
  { roundNumber: 3, startTime: "17:00", endTime: "17:15" },
  { roundNumber: 4, startTime: "17:15", endTime: "17:30" },
  { roundNumber: 5, startTime: "17:45", endTime: "18:00" },
  { roundNumber: 6, startTime: "18:00", endTime: "18:15" },
  { roundNumber: 7, startTime: "18:30", endTime: "18:45" },
  { roundNumber: 8, startTime: "18:45", endTime: "19:00" },
];

// Merged, time-ordered schedule (rounds + breaks) for display purposes.
export function buildScheduleEntries(): ScheduleEntry[] {
  const entries: ScheduleEntry[] = [];
  for (const r of ROUND_TIMES) {
    entries.push({ id: `round-${r.roundNumber}`, type: 'round', roundNumber: r.roundNumber, startTime: r.startTime, endTime: r.endTime });
    const brk = FIXED_BREAKS.find((b) => b.afterRound === r.roundNumber);
    if (brk) {
      entries.push({ id: brk.id, type: 'break', breakNumber: brk.breakNumber, afterRound: brk.afterRound, startTime: brk.startTime, endTime: brk.endTime });
    }
  }
  return entries;
}

export function playerName(id: string): string {
  return PLAYERS.find((p) => p.id === id)?.name ?? id;
}
