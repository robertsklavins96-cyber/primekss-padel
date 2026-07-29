import { useState } from 'react';
import { useTournamentData } from '../../hooks/useTournamentData';
import { LoadingBlock, EmptyBlock } from '../../components/common/States';
import { AdminMatchEntry } from '../../components/match/AdminMatchEntry';
import { NUMBER_OF_ROUNDS } from '../../data/schedule';

export function AdminResults() {
  const { matches, loading } = useTournamentData();
  const [roundFilter, setRoundFilter] = useState<number | 'all'>('all');

  if (loading) return <LoadingBlock label="Loading matches" />;
  if (matches.length === 0) {
    return <EmptyBlock eyebrow="Not initialized" message="Initialize the tournament from the Setup tab before entering results." />;
  }

  const rounds = Array.from({ length: NUMBER_OF_ROUNDS }, (_, i) => i + 1);
  const visible = roundFilter === 'all' ? matches : matches.filter((m) => m.roundNumber === roundFilter);
  const sorted = [...visible].sort((a, b) => a.roundNumber - b.roundNumber || a.courtNumber - b.courtNumber);

  return (
    <div>
      <div className="field" style={{ maxWidth: 220 }}>
        <label htmlFor="round-filter">Filter by round</label>
        <select id="round-filter" value={roundFilter} onChange={(e) => setRoundFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}>
          <option value="all">All rounds</option>
          {rounds.map((r) => (
            <option key={r} value={r}>Round {r}</option>
          ))}
        </select>
      </div>

      <div className="match-grid">
        {sorted.map((m) => (
          <AdminMatchEntry key={m.id} match={m} />
        ))}
      </div>
    </div>
  );
}
