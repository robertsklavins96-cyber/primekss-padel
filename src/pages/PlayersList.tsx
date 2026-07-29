import { Link } from 'react-router-dom';
import { useTournamentData } from '../hooks/useTournamentData';
import { LoadingBlock, EmptyBlock } from '../components/common/States';
import { PLAYERS } from '../data/schedule';

export function PlayersList() {
  const { leaderboard, loading, configured } = useTournamentData();

  if (!configured) {
    return (
      <div className="page">
        <EmptyBlock eyebrow="Setup needed" message="Firebase is not configured yet." />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page">
        <LoadingBlock label="Loading players" />
      </div>
    );
  }

  const positionByPlayer = new Map(leaderboard.map((s) => [s.playerId, s.position]));

  return (
    <div className="page">
      <div className="section">
        <span className="eyebrow">Roster</span>
        <h1 style={{ fontSize: 26, marginTop: 4 }}>Players</h1>
      </div>
      <div className="section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {PLAYERS.map((p) => {
          const stats = leaderboard.find((s) => s.playerId === p.id);
          const pos = positionByPlayer.get(p.id);
          return (
            <Link key={p.id} to={`/players/${p.id}`} className="card player-tile">
              <span className="player-tile__pos">{stats && stats.matchesPlayed > 0 ? `#${pos}` : '—'}</span>
              <span className="player-tile__name">{p.name}</span>
              <span className="player-tile__meta">{stats ? `${stats.matchesPlayed} matches` : 'No matches yet'}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
