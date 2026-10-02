import type { ScheduleValidationResult, ScheduleViolation } from '../types';
import {
  FIXED_MATCHES,
  FIXED_BREAKS,
  PLAYERS,
  playerName,
  NUMBER_OF_ROUNDS,
  NUMBER_OF_PLAYERS,
  NUMBER_OF_COURTS,
} from '../data/schedule';

function pairKey(a: string, b: string): string {
  return [a, b].sort().join('|');
}

/**
 * Validates the fixed tournament schedule against every structural rule
 * required by the tournament format. Pure function, no I/O — safe to run
 * on the client or in tests. Checks scale with whatever NUMBER_OF_ROUNDS /
 * NUMBER_OF_PLAYERS / NUMBER_OF_COURTS are currently configured, so this
 * doesn't need editing when the roster or court count changes.
 */
export function validateSchedule(): ScheduleValidationResult {
  const violations: ScheduleViolation[] = [];
  const expectedMatches = NUMBER_OF_ROUNDS * NUMBER_OF_COURTS;

  // 1. Exactly NUMBER_OF_ROUNDS rounds
  const roundNumbers = Array.from(new Set(FIXED_MATCHES.map((m) => m.roundNumber))).sort((a, b) => a - b);
  if (roundNumbers.length !== NUMBER_OF_ROUNDS) {
    violations.push({ rule: `Exactly ${NUMBER_OF_ROUNDS} rounds`, detail: `Found ${roundNumbers.length} rounds instead of ${NUMBER_OF_ROUNDS}.` });
  }

  // 2. Exactly NUMBER_OF_ROUNDS * NUMBER_OF_COURTS matches
  if (FIXED_MATCHES.length !== expectedMatches) {
    violations.push({ rule: `Exactly ${expectedMatches} matches`, detail: `Found ${FIXED_MATCHES.length} matches instead of ${expectedMatches}.` });
  }

  // 3. Exactly NUMBER_OF_COURTS matches per round
  for (const r of roundNumbers) {
    const count = FIXED_MATCHES.filter((m) => m.roundNumber === r).length;
    if (count !== NUMBER_OF_COURTS) {
      violations.push({ rule: `Exactly ${NUMBER_OF_COURTS} matches per round`, detail: `Round ${r} has ${count} matches instead of ${NUMBER_OF_COURTS}.`, roundNumber: r });
    }
  }

  // 4 & 5. Exactly NUMBER_OF_PLAYERS players per round, each appearing exactly once
  for (const r of roundNumbers) {
    const matches = FIXED_MATCHES.filter((m) => m.roundNumber === r);
    const ids = matches.flatMap((m) => [...m.team1, ...m.team2]);
    const uniqueIds = new Set(ids);
    if (ids.length !== NUMBER_OF_PLAYERS || uniqueIds.size !== NUMBER_OF_PLAYERS) {
      const seen = new Map<string, number>();
      for (const id of ids) seen.set(id, (seen.get(id) ?? 0) + 1);
      const dupes = [...seen.entries()].filter(([, c]) => c > 1).map(([id]) => playerName(id));
      violations.push({
        rule: 'Every player appears exactly once per round',
        detail: dupes.length
          ? `Round ${r}: ${dupes.join(', ')} appear more than once.`
          : `Round ${r} does not have exactly ${NUMBER_OF_PLAYERS} unique players (found ${uniqueIds.size}).`,
        roundNumber: r,
        players: dupes,
      });
    }
  }

  // 6. Every player plays exactly NUMBER_OF_ROUNDS matches
  const matchCountByPlayer = new Map<string, number>();
  for (const p of PLAYERS) matchCountByPlayer.set(p.id, 0);
  for (const m of FIXED_MATCHES) {
    for (const id of [...m.team1, ...m.team2]) {
      matchCountByPlayer.set(id, (matchCountByPlayer.get(id) ?? 0) + 1);
    }
  }
  for (const [id, count] of matchCountByPlayer.entries()) {
    if (count !== NUMBER_OF_ROUNDS) {
      violations.push({
        rule: `Every player plays exactly ${NUMBER_OF_ROUNDS} matches`,
        detail: `${playerName(id)} plays ${count} matches instead of ${NUMBER_OF_ROUNDS}.`,
        players: [playerName(id)],
      });
    }
  }

  // 7 & 8. Every match has exactly 4 unique players, each team has exactly 2
  for (const m of FIXED_MATCHES) {
    const allIds = [...m.team1, ...m.team2];
    const uniqueIds = new Set(allIds);
    if (m.team1.length !== 2 || m.team2.length !== 2) {
      violations.push({
        rule: 'Every team contains exactly 2 players',
        detail: `Match ${m.id} does not have exactly 2 players per team.`,
        roundNumber: m.roundNumber,
        courtNumber: m.courtNumber,
      });
    }
    if (allIds.length !== 4 || uniqueIds.size !== 4) {
      violations.push({
        rule: 'Every match contains exactly 4 unique players',
        detail: `Match ${m.id} (Round ${m.roundNumber}, Court ${m.courtNumber}) does not contain 4 unique players.`,
        roundNumber: m.roundNumber,
        courtNumber: m.courtNumber,
      });
    }
  }

  // 9. No partnership is repeated
  const partnershipSeen = new Map<string, { roundNumber: number; courtNumber: number }[]>();
  for (const m of FIXED_MATCHES) {
    for (const team of [m.team1, m.team2]) {
      const key = pairKey(team[0], team[1]);
      const arr = partnershipSeen.get(key) ?? [];
      arr.push({ roundNumber: m.roundNumber, courtNumber: m.courtNumber });
      partnershipSeen.set(key, arr);
    }
  }
  for (const [key, occurrences] of partnershipSeen.entries()) {
    if (occurrences.length > 1) {
      const [a, b] = key.split('|');
      violations.push({
        rule: 'No partnership is repeated',
        detail: `${playerName(a)} & ${playerName(b)} partner together ${occurrences.length} times (rounds ${occurrences.map((o) => o.roundNumber).join(', ')}).`,
        players: [playerName(a), playerName(b)],
      });
    }
  }

  // 10. No player faces the same opponent more than twice
  const opponentSeen = new Map<string, number>();
  for (const m of FIXED_MATCHES) {
    for (const p1 of m.team1) {
      for (const p2 of m.team2) {
        const key = pairKey(p1, p2);
        opponentSeen.set(key, (opponentSeen.get(key) ?? 0) + 1);
      }
    }
  }
  for (const [key, count] of opponentSeen.entries()) {
    if (count > 2) {
      const [a, b] = key.split('|');
      violations.push({
        rule: 'No player faces the same opponent more than twice',
        detail: `${playerName(a)} and ${playerName(b)} face each other ${count} times.`,
        players: [playerName(a), playerName(b)],
      });
    }
  }

  // Extra sanity check: exactly 2 breaks
  if (FIXED_BREAKS.length !== 2) {
    violations.push({ rule: 'Exactly 2 scheduled breaks', detail: `Found ${FIXED_BREAKS.length} breaks instead of 2.` });
  }

  return {
    valid: violations.length === 0,
    violations,
    summary: {
      totalRounds: roundNumbers.length,
      totalMatches: FIXED_MATCHES.length,
      totalBreaks: FIXED_BREAKS.length,
    },
  };
}
