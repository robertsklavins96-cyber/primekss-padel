import type { Match, PlayerStats } from '../types';
import { PLAYERS } from '../data/schedule';
import { POINTS_PER_MATCH } from '../data/schedule';

export interface ScoreValidationError {
  message: string;
}

/**
 * Validates a normal (non-override) match score: whole numbers, non-negative,
 * where exactly one team reaches POINTS_PER_MATCH and the other is lower
 * (a normal race-to-21 game, not a fixed-total split).
 */
export function validateNormalScore(team1Score: number, team2Score: number): ScoreValidationError | null {
  if (!Number.isInteger(team1Score) || !Number.isInteger(team2Score)) {
    return { message: 'Scores must be whole numbers.' };
  }
  if (team1Score < 0 || team2Score < 0) {
    return { message: 'Scores cannot be negative.' };
  }
  if (team1Score > POINTS_PER_MATCH || team2Score > POINTS_PER_MATCH) {
    return { message: `No score can be higher than ${POINTS_PER_MATCH}.` };
  }
  if (team1Score === POINTS_PER_MATCH && team2Score === POINTS_PER_MATCH) {
    return { message: `Only one team can reach ${POINTS_PER_MATCH} — the match ends as soon as one team gets there.` };
  }
  if (team1Score !== POINTS_PER_MATCH && team2Score !== POINTS_PER_MATCH) {
    return { message: `One team must reach
