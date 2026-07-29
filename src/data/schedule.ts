import type { Player, ScheduleEntry } from '../types';

// Fixed player roster. Latvian characters (ā) must be preserved exactly.
export const PLAYERS: Player[] = [
  { id: 'pavels', name: 'Pavels' },
  { id: 'roberts', name: 'Roberts' },
  { id: 'ulvis', name: 'Ulvis' },
  { id: 'atis', name: 'Atis' },
  { id: 'nauris', name: 'Nauris' },
  { id: 'kaspars', name: 'Kaspars' },
  { id: 'dinars', name: 'Dinārs' },
  { id: 'gints', name: 'Gints' },
  { id: 'markuss', name: 'Markuss' },
  { id: 'maris', name: 'Māris' },
  { id: 'aleksejs', name: 'Aleksejs' },
  { id: 'aleksandrs', name: 'Aleksandrs' },
];

export const TOURNAMENT_NAME = 'Americano Padel Tournament';
export const TOURNAMENT_START_TIME = '16:30';
export const TOURNAMENT_END_TIME = '19:00';
export const NUMBER_OF_PLAYERS = 12;
export const NUMBER_OF_COURTS = 3;
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

// The exact, fixed schedule as specified. This is the source of truth and
// must never be replaced by a generated schedule.
export const FIXED_MATCHES: FixedMatchDef[] = [
  // Round 1: 16:30-16:45
  { id: 'round-1-court-1', roundNumber: 1, courtNumber: 1, startTime: '16:30', endTime: '16:45', team1: ['pavels', 'nauris'], team2: ['roberts', 'aleksejs'] },
  { id: 'round-1-court-2', roundNumber: 1, courtNumber: 2, startTime: '16:30', endTime: '16:45', team1: ['ulvis', 'aleksandrs'], team2: ['kaspars', 'dinars'] },
  { id: 'round-1-court-3', roundNumber: 1, courtNumber: 3, startTime: '16:30', endTime: '16:45', team1: ['atis', 'gints'], team2: ['markuss', 'maris'] },

  // Round 2: 16:45-17:00
  { id: 'round-2-court-1', roundNumber: 2, courtNumber: 1, startTime: '16:45', endTime: '17:00', team1: ['pavels', 'aleksejs'], team2: ['atis', 'kaspars'] },
  { id: 'round-2-court-2', roundNumber: 2, courtNumber: 2, startTime: '16:45', endTime: '17:00', team1: ['roberts', 'gints'], team2: ['aleksandrs', 'dinars'] },
  { id: 'round-2-court-3', roundNumber: 2, courtNumber: 3, startTime: '16:45', endTime: '17:00', team1: ['ulvis', 'maris'], team2: ['nauris', 'markuss'] },

  // Round 3: 17:00-17:15
  { id: 'round-3-court-1', roundNumber: 3, courtNumber: 1, startTime: '17:00', endTime: '17:15', team1: ['pavels', 'kaspars'], team2: ['maris', 'dinars'] },
  { id: 'round-3-court-2', roundNumber: 3, courtNumber: 2, startTime: '17:00', endTime: '17:15', team1: ['roberts', 'atis'], team2: ['ulvis', 'gints'] },
  { id: 'round-3-court-3', roundNumber: 3, courtNumber: 3, startTime: '17:00', endTime: '17:15', team1: ['nauris', 'aleksejs'], team2: ['aleksandrs', 'markuss'] },

  // Round 4: 17:15-17:30
  { id: 'round-4-court-1', roundNumber: 4, courtNumber: 1, startTime: '17:15', endTime: '17:30', team1: ['pavels', 'gints'], team2: ['ulvis', 'nauris'] },
  { id: 'round-4-court-2', roundNumber: 4, courtNumber: 2, startTime: '17:15', endTime: '17:30', team1: ['roberts', 'dinars'], team2: ['maris', 'aleksejs'] },
  { id: 'round-4-court-3', roundNumber: 4, courtNumber: 3, startTime: '17:15', endTime: '17:30', team1: ['atis', 'markuss'], team2: ['kaspars', 'aleksandrs'] },

  // Round 5: 17:45-18:00 (after Break 1)
  { id: 'round-5-court-1', roundNumber: 5, courtNumber: 1, startTime: '17:45', endTime: '18:00', team1: ['kaspars', 'maris'], team2: ['gints', 'aleksejs'] },
  { id: 'round-5-court-2', roundNumber: 5, courtNumber: 2, startTime: '17:45', endTime: '18:00', team1: ['atis', 'dinars'], team2: ['roberts', 'nauris'] },
  { id: 'round-5-court-3', roundNumber: 5, courtNumber: 3, startTime: '17:45', endTime: '18:00', team1: ['ulvis', 'markuss'], team2: ['pavels', 'aleksandrs'] },

  // Round 6: 18:00-18:15
  { id: 'round-6-court-1', roundNumber: 6, courtNumber: 1, startTime: '18:00', endTime: '18:15', team1: ['nauris', 'maris'], team2: ['atis', 'aleksandrs'] },
  { id: 'round-6-court-2', roundNumber: 6, courtNumber: 2, startTime: '18:00', endTime: '18:15', team1: ['markuss', 'aleksejs'], team2: ['ulvis', 'dinars'] },
  { id: 'round-6-court-3', roundNumber: 6, courtNumber: 3, startTime: '18:00', endTime: '18:15', team1: ['kaspars', 'gints'], team2: ['pavels', 'roberts'] },

  // Round 7: 18:30-18:45 (after Break 2)
  { id: 'round-7-court-1', roundNumber: 7, courtNumber: 1, startTime: '18:30', endTime: '18:45', team1: ['roberts', 'aleksandrs'], team2: ['atis', 'aleksejs'] },
  { id: 'round-7-court-2', roundNumber: 7, courtNumber: 2, startTime: '18:30', endTime: '18:45', team1: ['pavels', 'markuss'], team2: ['gints', 'maris'] },
  { id: 'round-7-court-3', roundNumber: 7, courtNumber: 3, startTime: '18:30', endTime: '18:45', team1: ['nauris', 'dinars'], team2: ['ulvis', 'kaspars'] },

  // Round 8: 18:45-19:00
  { id: 'round-8-court-1', roundNumber: 8, courtNumber: 1, startTime: '18:45', endTime: '19:00', team1: ['nauris', 'aleksandrs'], team2: ['pavels', 'maris'] },
  { id: 'round-8-court-2', roundNumber: 8, courtNumber: 2, startTime: '18:45', endTime: '19:00', team1: ['roberts', 'kaspars'], team2: ['ulvis', 'atis'] },
  { id: 'round-8-court-3', roundNumber: 8, courtNumber: 3, startTime: '18:45', endTime: '19:00', team1: ['aleksejs', 'dinars'], team2: ['gints', 'markuss'] },
];

export const FIXED_BREAKS: FixedBreakDef[] = [
  { id: 'break-1', breakNumber: 1, afterRound: 4, startTime: '17:30', endTime: '17:45' },
  { id: 'break-2', breakNumber: 2, afterRound: 6, startTime: '18:15', endTime: '18:30' },
];

export const ROUND_TIMES: { roundNumber: number; startTime: string; endTime: string }[] = [
  { roundNumber: 1, startTime: '16:30', endTime: '16:45' },
  { roundNumber: 2, startTime: '16:45', endTime: '17:00' },
  { roundNumber: 3, startTime: '17:00', endTime: '17:15' },
  { roundNumber: 4, startTime: '17:15', endTime: '17:30' },
  { roundNumber: 5, startTime: '17:45', endTime: '18:00' },
  { roundNumber: 6, startTime: '18:00', endTime: '18:15' },
  { roundNumber: 7, startTime: '18:30', endTime: '18:45' },
  { roundNumber: 8, startTime: '18:45', endTime: '19:00' },
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
