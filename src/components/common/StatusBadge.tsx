import type { MatchStatus, TournamentStatus } from '../../types';

const TOURNAMENT_LABELS: Record<TournamentStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  break: 'On break',
  completed: 'Completed',
};

const MATCH_LABELS: Record<MatchStatus, string> = {
  upcoming: 'Upcoming',
  in_progress: 'In progress',
  completed: 'Completed',
};

export function TournamentStatusBadge({ status }: { status: TournamentStatus }) {
  return <span className={`badge badge--${status}`}>{TOURNAMENT_LABELS[status]}</span>;
}

export function MatchStatusBadge({ status }: { status: MatchStatus }) {
  return <span className={`badge badge--match-${status}`}>{MATCH_LABELS[status]}</span>;
}
