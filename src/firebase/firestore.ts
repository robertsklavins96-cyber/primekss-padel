import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, TOURNAMENT_ID } from './config';
import type { Announcement, Match, Player, Tournament, TournamentStatus } from '../types';
import {
  FIXED_MATCHES,
  FIXED_BREAKS,
  NUMBER_OF_COURTS,
  NUMBER_OF_PLAYERS,
  NUMBER_OF_ROUNDS,
  PLAYERS,
  POINTS_PER_MATCH,
  TOURNAMENT_END_TIME,
  TOURNAMENT_NAME,
  TOURNAMENT_START_TIME,
} from '../data/schedule';
import { computeOutcome } from '../utils/ranking';

// ---- Path helpers ----
const tournamentRef = () => doc(db, 'tournaments', TOURNAMENT_ID);
const playersCol = () => collection(db, 'tournaments', TOURNAMENT_ID, 'players');
const roundsCol = () => collection(db, 'tournaments', TOURNAMENT_ID, 'rounds');
const matchesCol = () => collection(db, 'tournaments', TOURNAMENT_ID, 'matches');
const announcementsCol = () => collection(db, 'tournaments', TOURNAMENT_ID, 'announcements');

// ---- Initialization ----

export async function isTournamentInitialized(): Promise<boolean> {
  const snap = await getDoc(tournamentRef());
  return snap.exists();
}

/**
 * Creates the tournament document, 12 players, 8 rounds, 24 matches, and 2
 * break entries using deterministic IDs. Idempotent: re-running this will
 * overwrite the same documents rather than creating duplicates, so calling
 * it more than once never duplicates data.
 */
export async function initializeTournament(): Promise<void> {
  const batch = writeBatch(db);

  batch.set(tournamentRef(), {
    name: TOURNAMENT_NAME,
    startTime: TOURNAMENT_START_TIME,
    endTime: TOURNAMENT_END_TIME,
    status: 'not_started' as TournamentStatus,
    activeRound: 1,
    manualStatusOverride: false,
    manualRoundOverride: false,
    numberOfPlayers: NUMBER_OF_PLAYERS,
    numberOfCourts: NUMBER_OF_COURTS,
    numberOfRounds: NUMBER_OF_ROUNDS,
    pointsPerMatch: POINTS_PER_MATCH,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  for (const p of PLAYERS) {
    batch.set(doc(playersCol(), p.id), { id: p.id, name: p.name });
  }

  const roundNumbers = Array.from(new Set(FIXED_MATCHES.map((m) => m.roundNumber)));
  for (const rn of roundNumbers) {
    const matchesInRound = FIXED_MATCHES.filter((m) => m.roundNumber === rn);
    batch.set(doc(roundsCol(), `round-${rn}`), {
      id: `round-${rn}`,
      roundNumber: rn,
      startTime: matchesInRound[0].startTime,
      endTime: matchesInRound[0].endTime,
    });
  }

  for (const m of FIXED_MATCHES) {
    batch.set(doc(matchesCol(), m.id), {
      id: m.id,
      roundNumber: m.roundNumber,
      courtNumber: m.courtNumber,
      startTime: m.startTime,
      endTime: m.endTime,
      team1PlayerIds: m.team1,
      team2PlayerIds: m.team2,
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      resultOverride: false,
      overrideReason: null,
      outcome: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  for (const b of FIXED_BREAKS) {
    batch.set(doc(roundsCol(), b.id), {
      id: b.id,
      type: 'break',
      breakNumber: b.breakNumber,
      afterRound: b.afterRound,
      startTime: b.startTime,
      endTime: b.endTime,
    });
  }

  await batch.commit();
}

// ---- Subscriptions (real-time) ----

export function subscribeTournament(callback: (t: Tournament | null) => void): Unsubscribe {
  return onSnapshot(tournamentRef(), (snap) => {
    if (!snap.exists()) {
      callback(null);
      return;
    }
    callback({ id: snap.id, ...(snap.data() as Omit<Tournament, 'id'>) });
  });
}

export function subscribeMatches(callback: (matches: Match[]) => void): Unsubscribe {
  // No orderBy() here on purpose: sorting on two fields server-side would
  // require a composite Firestore index to be created manually. Sorting the
  // (small, 24-item) result client-side avoids that setup step entirely.
  return onSnapshot(matchesCol(), (snap) => {
    const matches = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Match, 'id'>) }));
    matches.sort((a, b) => a.roundNumber - b.roundNumber || a.courtNumber - b.courtNumber);
    callback(matches);
  });
}

export function subscribeAnnouncements(callback: (announcements: Announcement[]) => void): Unsubscribe {
  return onSnapshot(announcementsCol(), (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Announcement, 'id'>) }));
    items.sort((a, b) => {
      const at = (a.createdAt as { seconds?: number })?.seconds ?? 0;
      const bt = (b.createdAt as { seconds?: number })?.seconds ?? 0;
      return bt - at;
    });
    callback(items);
  });
}

export async function fetchPlayers(): Promise<Player[]> {
  const snap = await getDocs(playersCol());
  if (snap.empty) return PLAYERS;
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Player, 'id'>) }));
}

// ---- Admin writes ----

export async function saveMatchResult(
  matchId: string,
  team1Score: number,
  team2Score: number,
  options: { override: boolean; overrideReason: string | null }
): Promise<void> {
  const outcome = computeOutcome(team1Score, team2Score);
  await updateDoc(doc(matchesCol(), matchId), {
    team1Score,
    team2Score,
    status: 'completed',
    outcome,
    resultOverride: options.override,
    overrideReason: options.override ? options.overrideReason : null,
    updatedAt: serverTimestamp(),
  });
}

export async function resetMatchResult(matchId: string): Promise<void> {
  await updateDoc(doc(matchesCol(), matchId), {
    team1Score: null,
    team2Score: null,
    status: 'upcoming',
    outcome: null,
    resultOverride: false,
    overrideReason: null,
    updatedAt: serverTimestamp(),
  });
}

export async function setMatchStatus(matchId: string, status: Match['status']): Promise<void> {
  await updateDoc(doc(matchesCol(), matchId), { status, updatedAt: serverTimestamp() });
}

export async function setTournamentStatus(status: TournamentStatus, manual: boolean): Promise<void> {
  await updateDoc(tournamentRef(), { status, manualStatusOverride: manual, updatedAt: serverTimestamp() });
}

export async function setActiveRound(round: number, manual: boolean): Promise<void> {
  await updateDoc(tournamentRef(), { activeRound: round, manualRoundOverride: manual, updatedAt: serverTimestamp() });
}

export async function clearManualOverrides(): Promise<void> {
  await updateDoc(tournamentRef(), { manualStatusOverride: false, manualRoundOverride: false, updatedAt: serverTimestamp() });
}

export async function addAnnouncement(message: string): Promise<void> {
  const ref = doc(announcementsCol());
  await setDoc(ref, { message, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export async function editAnnouncement(id: string, message: string): Promise<void> {
  await updateDoc(doc(announcementsCol(), id), { message, updatedAt: serverTimestamp() });
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await deleteDoc(doc(announcementsCol(), id));
}
