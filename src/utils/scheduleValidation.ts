import type { ScheduleValidationResult, ScheduleViolation } from '../types';
import { FIXED_MATCHES, FIXED_BREAKS, PLAYERS, playerName } from '../data/schedule';

function pairKey(a: string, b: string): string {
  return [a, b].sort().join('|');
}

/**
 * Validates the fixed tournament schedule against every structural rule
 * required by the tournament format. Pure function, no I/O — safe to run
 * on the client or in tests.
 */
export function validateSchedule(): ScheduleValidationResult {
  const violations: ScheduleViolation[] = [];

  // 1. Exactly 8 rounds
  const roundNumbers = Array.from(new Set(FIXED_MATCHES.map((m) => m.roundNumber))).sort((a, b) => a - b);
  if (roundNumbers.length !== 8) {
    violations.push({ rule: 'Exactly 8 rounds', detail: `Found ${roundNumbers.length} rounds instead of 8.` });
  }

  // 2. Exactly 24 matches
  if (FIXED_MATCHES.length !== 24) {
    violations.push({ rule: 'Exactly 24 matches', detail: `Found ${FIXED_MATCHES.length} matches instead of 24.` });
  }

  // 3. Exactly 3 matches per round
  for (const r of roundNumbers) {
    const count = FIXED_MATCHES.filter((m) => m.roundNumber === r).length;
    if (count !== 3) {
      violations.push({ rule: 'Exactly 3 matches per round', detail: `Round ${r} has ${count} matches instead of 3.`, roundNumber: r });
    }
  }

  // 4 & 5. Exactly 12 players per round, each appearing exactly once
  for (const r of roundNumbers) {
    const matches = FIXED_MATCHES.filter((m) => m.roundNumber === r);
    const ids = matches.flatMap((m) => [...m.team1, ...m.team2]);
    const uniqueIds = new Set(ids);
    if (ids.length !== 12 || uniqueIds.size !== 12) {
      const seen = new Map<string, number>();
      for (const id of ids) seen.set(id, (seen.get(id) ?? 0) + 1);
      const dupes = [...seen.entries()].filter(([, c]) => c > 1).map(([id]) => playerName(id));
      violations.push({
        rule: 'Every player appears exactly once per round',
        detail: dupes.length
          ? `Round ${r}: ${dupes.join(', ')} appear more than once.`
          : `Round ${r} does not have exactly 12 unique players (found ${uniqueIds.size}).`,
        roundNumber: r,
        players: dupes,
      });
    }
  }

  // 6. Every player plays exactly 8 matches
  const matchCountByPlayer = new Map<string, number>();
  for (const p of PLAYERS) matchCountByPlayer.set(p.id, 0);
  for (const m of FIXED_MATCHES) {
    for (const id of [...m.team1, ...m.team2]) {
      matchCountByPlayer.set(id, (matchCountByPlayer.get(id) ?? 0) + 1);
    }
  }
  for (const [id, count] of matchCountByPlayer.entries()) {
    if (count !== 8) {
      violations.push({ rule: 'Every player plays exactly 8 matches', detail: `${playerName(id)} plays ${count} matches instead of 8.`, players: [playerName(id)] });
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

  // 11. Aleksejs and Aleksandrs are never partners
  const forbiddenKey = pairKey('aleksejs', 'aleksandrs');
  if (partnershipSeen.has(forbiddenKey)) {
    violations.push({
      rule: 'Aleksejs and Aleksandrs are never partners',
      detail: 'Aleksejs and Aleksandrs are scheduled as partners at least once.',
      players: ['Aleksejs', 'Aleksandrs'],
    });
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
