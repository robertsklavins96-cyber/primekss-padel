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
  if
