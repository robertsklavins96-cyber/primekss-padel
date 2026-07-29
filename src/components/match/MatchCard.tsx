import type { Match } from '../../types';
import { playerName } from '../../data/schedule';
import { MatchStatusBadge } from '../common/StatusBadge';
import './MatchCard.css';

interface MatchCardProps {
  match: Match;
  children?: React.ReactNode;
}

export function MatchCard({ match, children }: MatchCardProps) {
  const hasScore = match.team1Score !== null && match.team2Score !== null;
  const team1Wins = hasScore && (match.outcome === 'team1');
  const team2Wins = hasScore && (match.outcome === 'team2');

  return (
    <div className={`match-card ${match.status === 'completed' ? 'match-card--completed' : ''}`}>
      <div className="match-card__meta">
        <span className="match-card__court">Court {match.courtNumber}</span>
        <span className="match-card__time">{match.startTime}–{match.endTime}</span>
        <MatchStatusBadge status={match.status} />
      </div>

      <div className="match-card__body">
        <div className={`match-card__team ${team1Wins ? 'match-card__team--win' : ''}`}>
          <span className="match-card__players">
            {playerName(match.team1PlayerIds[0])} &amp; {playerName(match.team1PlayerIds[1])}
          </span>
          <span className="match-card__score">{hasScore ? match.team1Score : '–'}</span>
        </div>
        <div className="match-card__vs">vs</div>
        <div className={`match-card__team ${team2Wins ? 'match-card__team--win' : ''}`}>
          <span className="match-card__players">
            {playerName(match.team2PlayerIds[0])} &amp; {playerName(match.team2PlayerIds[1])}
          </span>
          <span className="match-card__score">{hasScore ? match.team2Score : '–'}</span>
        </div>
      </div>

      {match.resultOverride && (
        <div className="match-card__override">Overridden{match.overrideReason ? `: ${match.overrideReason}` : ''}</div>
      )}

      {children && <div className="match-card__actions">{children}</div>}
    </div>
  );
}
