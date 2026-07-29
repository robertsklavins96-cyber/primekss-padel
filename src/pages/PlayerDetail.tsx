import { useParams, Link } from 'react-router-dom';
import { useTournamentData } from '../hooks/useTournamentData';
import { LoadingBlock, EmptyBlock } from '../components/common/States';
import { playerName, PLAYERS } from '../data/schedule';
import type { PlayerMatchHistoryItem } from '../types';

export function PlayerDetail() {
  const { playerId = '' } = useParams();
  const { matches, leaderboard, loading, configured } = useTournamentData();

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
        <LoadingBlock label="Loading player" />
      </div>
    );
  }

  const player = PLAYERS.find((p) => p.id === playerId);
  if (!player) {
    return (
      <div className="page">
        <EmptyBlock eyebrow="Not found" message="This player doesn't exist in the tournament roster." />
      </div>
    );
  }

  const stats = leaderboard.find((s) => s.playerId === playerId);
  const playerMatches = matches
    .filter((m) => m.team1PlayerIds.includes(playerId) || m.team2PlayerIds.includes(playerId))
    .sort((a, b) => a.roundNumber - b.roundNumber);

  const history: PlayerMatchHistoryItem[] = playerMatches.map((m) => {
    const onTeam1 = m.team1PlayerIds.includes(playerId);
    const partnerId = onTeam1
      ? m.team1PlayerIds.find((id) => id !== playerId)!
      : m.team2PlayerIds.find((id) => id !== playerId)!;
    const opponentIds = (onTeam1 ? m.team2PlayerIds : m.team1PlayerIds) as [string, string];
    const myScore = onTeam1 ? m.team1Score : m.team2Score;
    let result: PlayerMatchHistoryItem['result'] = 'upcoming';
    if (m.status === 'completed') {
      if (m.outcome === 'draw') result = 'draw';
      else if ((onTeam1 && m.outcome === 'team1') || (!onTeam1 && m.outcome === 'team2')) result = 'win';
      else result = 'loss';
    }
    return { match: m, partnerId, opponentIds, pointsEarned: myScore, result };
  });

  const partners = new Map<string, number>();
  const opponents = new Map<string, number>();
  for (const h of history) {
    partners.set(h.partnerId, (partners.get(h.partnerId) ?? 0) + 1);
    for (const opp of h.opponentIds) {
      opponents.set(opp, (opponents.get(opp) ?? 0) + 1);
    }
  }

  return (
    <div className="page">
      <div className="section">
        <Link to="/players" style={{ fontSize: 13, color: 'var(--color-text-dim)' }}>
          ← All players
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 8 }}>{player.name}</h1>
        {stats && stats.matchesPlayed > 0 && (
          <span className="eyebrow" style={{ display: 'inline-block', marginTop: 6 }}>
            Position #{stats.position}
          </span>
        )}
      </div>

      <div className="section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
        <Stat label="Matches" value={stats?.matchesPlayed ?? 0} />
        <Stat label="Wins" value={stats?.wins ?? 0} />
        <Stat label="Draws" value={stats?.draws ?? 0} />
        <Stat label="Losses" value={stats?.losses ?? 0} />
        <Stat label="Points" value={stats?.pointsScored ?? 0} />
        <Stat label="Against" value={stats?.pointsAgainst ?? 0} />
        <Stat label="+/-" value={stats?.pointDifference ?? 0} highlight />
      </div>

      <div className="section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="card">
          <h3 style={{ fontSize: 14, marginBottom: 10 }}>Partners played with</h3>
          <PersonList items={partners} />
        </div>
        <div className="card">
          <h3 style={{ fontSize: 14, marginBottom: 10 }}>Opponents faced</h3>
          <PersonList items={opponents} />
        </div>
      </div>

      <div className="section">
        <h2 style={{ fontSize: 16, marginBottom: 10 }}>Match history</h2>
        <div className="history-list">
          {history.map((h) => (
            <div key={h.match.id} className="card history-row">
              <div className="history-row__meta">
                <span>R{h.match.roundNumber}</span>
                <span>{h.match.startTime}</span>
                <span>Court {h.match.courtNumber}</span>
              </div>
              <div className="history-row__body">
                <span>with <strong>{playerName(h.partnerId)}</strong></span>
                <span>vs {playerName(h.opponentIds[0])} &amp; {playerName(h.opponentIds[1])}</span>
              </div>
              <div className={`history-row__result history-row__result--${h.result}`}>
                {h.match.status === 'completed'
                  ? `${h.match.team1Score}–${h.match.team2Score} (${h.pointsEarned} pts)`
                  : 'Upcoming'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="card">
      <p style={{ fontSize: 11, color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{label}</p>
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          fontWeight: 700,
          marginTop: 4,
          color: highlight ? (value > 0 ? 'var(--color-win)' : value < 0 ? 'var(--color-danger)' : undefined) : undefined,
        }}
      >
        {highlight && value > 0 ? '+' : ''}
        {value}
      </p>
    </div>
  );
}

function PersonList({ items }: { items: Map<string, number> }) {
  if (items.size === 0) {
    return <p style={{ fontSize: 13, color: 'var(--color-text-dim)' }}>None yet.</p>;
  }
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {[...items.entries()].map(([id, count]) => (
        <li key={id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <Link to={`/players/${id}`}>{playerName(id)}</Link>
          <span style={{ color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }}>×{count}</span>
        </li>
      ))}
    </ul>
  );
}
