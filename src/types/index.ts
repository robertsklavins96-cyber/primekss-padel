// Core domain types for the Americano Padel Tournament app.

export type TournamentStatus = 'not_started' | 'in_progress' | 'break' | 'completed';

export type MatchStatus = 'upcoming' | 'in_progress' | 'completed';

export interface Player {
  id: string;
  name: string;
}

export interface Tournament {
  id: string;
  name: string;
  startTime: string; // "16:30"
  endTime: string; // "19:00"
  status: TournamentStatus;
  activeRound: number;
  manualStatusOverride: boolean;
  manualRoundOverride: boolean;
  numberOfPlayers: number;
  numberOfCourts: number;
  numberOfRounds: number;
  pointsPerMatch: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface RoundEntry {
  id: string; // "round-1"
  type: 'round';
  roundNumber: number;
  startTime: string;
  endTime: string;
}

export interface BreakEntry {
  id: string; // "break-1"
  type: 'break';
  breakNumber: number;
  afterRound: number;
  startTime: string;
  endTime: string;
}

export type ScheduleEntry = RoundEntry | BreakEntry;

export interface Match {
  id: string; // "round-1-court-1"
  roundNumber: number;
  courtNumber: number;
  startTime: string;
  endTime: string;
  team1PlayerIds: [string, string];
  team2PlayerIds: [string, string];
  team1Score: number | null;
  team2Score: number | null;
  status: MatchStatus;
  resultOverride: boolean;
  overrideReason: string | null;
  outcome: 'team1' | 'team2' | 'draw' | null;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Announcement {
  id: string;
  message: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface PlayerStats {
  playerId: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  pointsScored: number;
  pointsAgainst: number;
  pointDifference: number;
  position: number;
}

export interface PlayerMatchHistoryItem {
  match: Match;
  partnerId: string;
  opponentIds: [string, string];
  pointsEarned: number | null;
  result: 'win' | 'loss' | 'draw' | 'upcoming';
}

export interface ScheduleViolation {
  rule: string;
  detail: string;
  roundNumber?: number;
  courtNumber?: number;
  players?: string[];
}

export interface ScheduleValidationResult {
  valid: boolean;
  violations: ScheduleViolation[];
  summary: {
    totalRounds: number;
    totalMatches: number;
    totalBreaks: number;
  };
}
