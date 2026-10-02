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
// pairing occurs more than twice, and teams are balanced by skill level.
export const FIXED_MATCHES: FixedMatchDef[] = [
  // Round 1: 16:30-16:45
  { id: "round-1-court-1", roundNumber: 1, courtNumber: 1, startTime: "16:30", endTime: "16:45", team1: ["davis", "markuss"], team2: ["rudolfs", "ulvis"] },
  { id: "round-1-court-2", roundNumber: 1, courtNumber: 2, startTime: "16:30", endTime: "16:45", team1: ["emilija", "roberts"], team2: ["maris", "regnars"] },
  { id: "round-1-court-3", roundNumber: 1, courtNumber: 3, startTime: "16:30", endTime: "16:45", team1: ["martins", "edgars"], team2: ["artjoms", "atis"] },
  { id: "round-1-court-4", roundNumber: 1, courtNumber: 4, startTime: "16:30", endTime: "16:45", team1: ["pavels", "juris"], team2: ["nauris", "gints"] },

  // Round 2: 16:45-17:00
  { id: "round-2-court-1", roundNumber: 2, courtNumber: 1, startTime: "16:45", endTime: "17:00", team1: ["juris", "davis"], team2: ["edgars", "atis"] },
  { id: "round-2-court-2", roundNumber: 2, courtNumber: 2, startTime: "16:45", endTime: "17:00", team1: ["nauris", "pavels"], team2: ["markuss", "roberts"] },
  { id: "round-2-court-3", roundNumber: 2, courtNumber: 3, startTime: "16:45", endTime: "17:00", team1: ["ulvis", "gints"], team2: ["rudolfs", "martins"] },
  { id: "round-2-court-4", roundNumber: 2, courtNumber: 4, startTime: "16:45", endTime: "17:00", team1: ["artjoms", "maris"], team2: ["emilija", "regnars"] },

  // Round 3: 17:00-17:15
  { id: "round-3-court-1", roundNumber: 3, courtNumber: 1, startTime: "17:00", endTime: "17:15", team1: ["edgars", "roberts"], team2: ["rudolfs", "gints"] },
  { id: "round-3-court-2", roundNumber: 3, courtNumber: 2, startTime: "17:00", endTime: "17:15", team1: ["maris", "atis"], team2: ["pavels", "davis"] },
  { id: "round-3-court-3", roundNumber: 3, courtNumber: 3, startTime: "17:00", endTime: "17:15", team1: ["markuss", "regnars"], team2: ["artjoms", "martins"] },
  { id: "round-3-court-4", roundNumber: 3, courtNumber: 4, startTime: "17:00", endTime: "17:15", team1: ["juris", "nauris"], team2: ["ulvis", "emilija"] },

  // Round 4: 17:15-17:30
  { id: "round-4-court-1", roundNumber: 4, courtNumber: 1, startTime: "17:15", endTime: "17:30", team1: ["roberts", "rudolfs"], team2: ["atis", "martins"] },
  { id: "round-4-court-2", roundNumber: 4, courtNumber: 2, startTime: "17:15", endTime: "17:30", team1: ["gints", "maris"], team2: ["artjoms", "juris"] },
  { id: "round-4-court-3", roundNumber: 4, courtNumber: 3, startTime: "17:15", endTime: "17:30", team1: ["edgars", "davis"], team2: ["markuss", "emilija"] },
  { id: "round-4-court-4", roundNumber: 4, courtNumber: 4, startTime: "17:15", endTime: "17:30", team1: ["nauris", "ulvis"], team2: ["regnars", "pavels"] },

  // Round 5: 17:45-18:00
  { id: "round-5-court-1", roundNumber: 5, courtNumber: 1, startTime: "17:45", endTime: "18:00", team1: ["regnars", "nauris"], team2: ["gints", "martins"] },
  { id: "round-5-court-2", roundNumber: 5, courtNumber: 2, startTime: "17:45", endTime: "18:00", team1: ["artjoms", "roberts"], team2: ["emilija", "davis"] },
  { id: "round-5-court-3", roundNumber: 5, courtNumber: 3, startTime: "17:45", endTime: "18:00", team1: ["edgars", "pavels"], team2: ["juris", "rudolfs"] },
  { id: "round-5-court-4", roundNumber: 5, courtNumber: 4, startTime: "17:45", endTime: "18:00", team1: ["maris", "ulvis"], team2: ["atis", "markuss"] },

  // Round 6: 18:00-18:15
  { id: "round-6-court-1", roundNumber: 6, courtNumber: 1, startTime: "18:00", endTime: "18:15", team1: ["emilija", "gints"], team2: ["markuss", "edgars"] },
  { id: "round-6-court-2", roundNumber: 6, courtNumber: 2, startTime: "18:00", endTime: "18:15", team1: ["martins", "regnars"], team2: ["atis", "pavels"] },
  { id: "round-6-court-3", roundNumber: 6, courtNumber: 3, startTime: "18:00", endTime: "18:15", team1: ["rudolfs", "maris"], team2: ["artjoms", "davis"] },
  { id: "round-6-court-4", roundNumber: 6, courtNumber: 4, startTime: "18:00", endTime: "18:15", team1: ["juris", "ulvis"], team2: ["nauris", "roberts"] },

  // Round 7: 18:30-18:45
  { id: "round-7-court-1", roundNumber: 7, courtNumber: 1, startTime: "18:30", endTime: "18:45", team1: ["atis", "gints"], team2: ["ulvis", "artjoms"] },
  { id: "round-7-court-2", roundNumber: 7, courtNumber: 2, startTime: "18:30", endTime: "18:45", team1: ["martins", "juris"], team2: ["roberts", "maris"] },
  { id: "round-7-court-3", roundNumber: 7, courtNumber: 3, startTime: "18:30", endTime: "18:45", team1: ["regnars", "davis"], team2: ["edgars", "nauris"] },
  { id: "round-7-court-4", roundNumber: 7, courtNumber: 4, startTime: "18:30", endTime: "18:45", team1: ["pavels", "emilija"], team2: ["markuss", "rudolfs"] },

  // Round 8: 18:45-19:00
  { id: "round-8-court-1", roundNumber: 8, courtNumber: 1, startTime: "18:45", endTime: "19:00", team1: ["nauris", "rudolfs"], team2: ["artjoms", "markuss"] },
  { id: "round-8-court-2", roundNumber: 8, courtNumber: 2, startTime: "18:45", endTime: "19:00", team1: ["juris", "roberts"], team2: ["regnars", "atis"] },
  { id: "round-8-court-3", roundNumber: 8, courtNumber: 3, startTime: "18:45", endTime: "19:00", team1: ["davis", "gints"], team2: ["martins", "emilija"] },
  { id: "round-8-court-4", roundNumber: 8, courtNumber: 4, startTime: "18:45", endTime: "19:00", team1: ["ulvis", "edgars"], team2: ["maris", "pavels"] },

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
