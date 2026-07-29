import { FIXED_BREAKS, ROUND_TIMES, TOURNAMENT_END_TIME, TOURNAMENT_START_TIME } from '../data/schedule';
import type { TournamentStatus } from '../types';

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export interface AutoScheduleState {
  status: TournamentStatus;
  activeRound: number;
  onBreak: boolean;
}

/**
 * Determines tournament status and active round purely from the current
 * clock time and the fixed schedule. Used as the default when no manual
 * admin override is active.
 */
export function computeAutoScheduleState(now: Date = new Date()): AutoScheduleState {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = timeToMinutes(TOURNAMENT_START_TIME);
  const endMinutes = timeToMinutes(TOURNAMENT_END_TIME);

  if (nowMinutes < startMinutes) {
    return { status: 'not_started', activeRound: 1, onBreak: false };
  }
  if (nowMinutes >= endMinutes) {
    return { status: 'completed', activeRound: ROUND_TIMES.length, onBreak: false };
  }

  for (const brk of FIXED_BREAKS) {
    const s = timeToMinutes(brk.startTime);
    const e = timeToMinutes(brk.endTime);
    if (nowMinutes >= s && nowMinutes < e) {
      return { status: 'break', activeRound: brk.afterRound, onBreak: true };
    }
  }

  for (const r of ROUND_TIMES) {
    const s = timeToMinutes(r.startTime);
    const e = timeToMinutes(r.endTime);
    if (nowMinutes >= s && nowMinutes < e) {
      return { status: 'in_progress', activeRound: r.roundNumber, onBreak: false };
    }
  }

  // Fallback: between defined windows (shouldn't normally happen)
  return { status: 'in_progress', activeRound: ROUND_TIMES.length, onBreak: false };
}

export function nextRoundNumber(activeRound: number): number | null {
  const next = activeRound + 1;
  return next <= ROUND_TIMES.length ? next : null;
}
