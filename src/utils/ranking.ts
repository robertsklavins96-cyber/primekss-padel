import type { Match, PlayerStats } from '../types';
import { PLAYERS } from '../data/schedule';
import { POINTS_PER_MATCH } from '../data/schedule';

export interface ScoreValidationError {
  message: string;
}

/**
 * Validates a normal (non-override) match score: whole numbers, non-negative,
 * and totalling exactly POINTS_PER_MATCH.
 */
export function validateNormalScore(team1Score: number, team2Score: number): ScoreValidationError | null {
  if (!Number.isInteger(team1Score) || !Number.isInteger(team2Score)) {
    return { message: 'Scores must be whole numbers.' };
  }
  if (team1Score < 0 || team2Score < 0) {
    return { message: 'Scores cannot be negative.' };
  }
  if (team1Score + team2Score !== POINTS_PER_MATCH) {
    return { message: `Scores must add up to exactly ${POINTS_PER_MATCH} (got ${team1Score + team2Score}).` };
  }
  return null;
}

/**
 * Validates an override score: still whole numbers and non-negative, but the
 * 21-point total requirement is relaxed for unusual situations (injury,
 * technical interruption, match stopped early, etc).
 */
export function validateOverrideScore(team1Score: number, team2Score: number): ScoreValidationError | null {
  if (!Number.isInteger(team1Score) || !Number.isInteger(team2Score)) {
    return { message: 'Scores must be whole numbers.' };
  }
  if (team1Score < 0 || team2Score < 0) {
    return { message: 'Scores cannot be negative.' };
  }
  return null;
}

export function computeOutcome(team1Score: number, team2Score: number): 'team1' | 'team2' | 'draw' {
  if (team1Score > team2Score) return 'team1';
  if (team2Score > team1Score) return 'team2';
  return 'draw';
}

/**
 * Recalculates full leaderboard stats from the list of matches. Matches are
 * the single source of truth — this function never reads a cached total.
 */
export function calculateLeaderboard(matches: Match[]): PlayerStats[] {
  const statsMap = new Map<string, PlayerStats>();
  for (const p of PLAYERS) {
    statsMap.set(p.id, {
      playerId: p.id,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      pointsScored: 0,
      pointsAgainst: 0,
      pointDifference: 0,
      position: 0,
    });
  }

  const completed = matches.filter((m) => m.status === 'completed' && m.team1Score !== null && m.team2Score !== null);

  // Track head-to-head wins for tiebreaking: playerId -> opponentId -> wins
  const headToHead = new Map<string, Map<string, number>>();
  const addH2H = (winnerIds: string[], loserIds: string[]) => {
    for (const w of winnerIds) {
      for (const l of loserIds) {
        if (!headToHead.has(w)) headToHead.set(w, new Map());
        const m = headToHead.get(w)!;
        m.set(l, (m.get(l) ?? 0) + 1);
      }
    }
  };

  for (const match of completed) {
    const s1 = match.team1Score as number;
    const s2 = match.team2Score as number;
    const outcome = match.outcome ?? computeOutcome(s1, s2);

    for (const id of match.team1PlayerIds) {
      const stats = statsMap.get(id);
      if (!stats) continue;
      stats.matchesPlayed += 1;
      stats.pointsScored += s1;
      stats.pointsAgainst += s2;
      if (outcome === 'team1') stats.wins += 1;
      else if (outcome === 'draw') stats.draws += 1;
      else stats.losses += 1;
    }
    for (const id of match.team2PlayerIds) {
      const stats = statsMap.get(id);
      if (!stats) continue;
      stats.matchesPlayed += 1;
      stats.pointsScored += s2;
      stats.pointsAgainst += s1;
      if (outcome === 'team2') stats.wins += 1;
      else if (outcome === 'draw') stats.draws += 1;
      else stats.losses += 1;
    }

    if (outcome === 'team1') addH2H(match.team1PlayerIds, match.team2PlayerIds);
    else if (outcome === 'team2') addH2H(match.team2PlayerIds, match.team1PlayerIds);
  }

  for (const stats of statsMap.values()) {
    stats.pointDifference = stats.pointsScored - stats.pointsAgainst;
  }

  const ranked = [...statsMap.values()].sort((a, b) => {
    if (b.pointsScored !== a.pointsScored) return b.pointsScored - a.pointsScored;
    if (b.pointDifference !== a.pointDifference) return b.pointDifference - a.pointDifference;
    if (b.wins !== a.wins) return b.wins - a.wins;

    // Head-to-head: does a have more wins over b, or vice versa?
    const aOverB = headToHead.get(a.playerId)?.get(b.playerId) ?? 0;
    const bOverA = headToHead.get(b.playerId)?.get(a.playerId) ?? 0;
    if (aOverB !== bOverA) return bOverA - aOverB;

    return 0; // shared position
  });

  // Assign positions, sharing a position when fully tied on the criteria above
  let position = 1;
  for (let i = 0; i < ranked.length; i++) {
    if (i > 0) {
      const prev = ranked[i - 1];
      const curr = ranked[i];
      const tied =
        prev.pointsScored === curr.pointsScored &&
        prev.pointDifference === curr.pointDifference &&
        prev.wins === curr.wins;
      if (!tied) position = i + 1;
    }
    ranked[i].position = position;
  }

  return ranked;
}
