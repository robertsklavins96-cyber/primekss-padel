import { useEffect, useMemo, useState } from 'react';
import type { Announcement, Match, PlayerStats, Tournament } from '../types';
import { subscribeAnnouncements, subscribeMatches, subscribeTournament } from '../firebase/firestore';
import { firebaseConfigured } from '../firebase/config';
import { calculateLeaderboard } from '../utils/ranking';
import { computeAutoScheduleState } from '../utils/timeSchedule';

export interface TournamentData {
  tournament: Tournament | null;
  matches: Match[];
  announcements: Announcement[];
  leaderboard: PlayerStats[];
  loading: boolean;
  effectiveStatus: Tournament['status'];
  effectiveActiveRound: number;
  configured: boolean;
}

/**
 * Subscribes to all live tournament data in one place. Public pages and
 * admin pages share this hook so every view stays in sync via Firestore
 * real-time listeners.
 */
export function useTournamentData(): TournamentData {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tournamentLoaded, setTournamentLoaded] = useState(!firebaseConfigured);
  const [matchesLoaded, setMatchesLoaded] = useState(!firebaseConfigured);
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (!firebaseConfigured) return;
    const unsub = subscribeTournament((t) => {
      setTournament(t);
      setTournamentLoaded(true);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!firebaseConfigured) return;
    const unsub = subscribeMatches((m) => {
      setMatches(m);
      setMatchesLoaded(true);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!firebaseConfigured) return;
    const unsub = subscribeAnnouncements(setAnnouncements);
    return unsub;
  }, []);

  // Re-derive the auto (time-based) schedule state once a minute so the
  // dashboard advances rounds automatically without a manual override.
  useEffect(() => {
    const interval = window.setInterval(() => forceTick((n) => n + 1), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const leaderboard = useMemo(() => calculateLeaderboard(matches), [matches]);

  const autoState = computeAutoScheduleState();
  const effectiveStatus = tournament?.manualStatusOverride ? tournament.status : tournament ? autoState.status : 'not_started';
  const effectiveActiveRound = tournament?.manualRoundOverride ? tournament.activeRound : tournament ? autoState.activeRound : 1;

  return {
    tournament,
    matches,
    announcements,
    leaderboard,
    loading: !tournamentLoaded || !matchesLoaded,
    effectiveStatus,
    effectiveActiveRound,
    configured: firebaseConfigured,
  };
}
