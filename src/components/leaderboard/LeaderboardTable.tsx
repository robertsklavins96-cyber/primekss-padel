import { Link } from 'react-router-dom';
import type { PlayerStats } from '../../types';
import { playerName } from '../../data/schedule';
import './LeaderboardTable.css';

interface LeaderboardTableProps {
  stats: PlayerStats[];
  linkPlayers?: boolean;
}

export function LeaderboardTable({ stats, linkPlayers = true }: LeaderboardTableProps) {
  if (stats.length === 0) {
    return null;
  }

  return (
    <div className="leaderboard-scroll">
      <table className="leaderboard">
        <thead>
          <tr>
            <th>#</th>
            <th>Player</th>
            <th>MP</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>PF</th>
            <th>PA</th>
            <th>+/-</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s) => {
            const podium = s.position <= 3 ? `leaderboard__row--podium-${s.position}` : '';
            const name = playerName(s.playerId);
            return (
              <tr key={s.playerId} className={podium}>
                <td className="leaderboard__pos">{s.position}</td>
                <td className="leaderboard__name">
                  {linkPlayers ? <Link to={`/players/${s.playerId}`}>{name}</Link> : name}
                </td>
                <td>{s.matchesPlayed}</td>
                <td>{s.wins}</td>
                <td>{s.draws}</td>
                <td>{s.losses}</td>
                <td>{s.pointsScored}</td>
                <td>{s.pointsAgainst}</td>
                <td className={s.pointDifference > 0 ? 'leaderboard__diff-pos' : s.pointDifference < 0 ? 'leaderboard__diff-neg' : ''}>
                  {s.pointDifference > 0 ? '+' : ''}
                  {s.pointDifference}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
