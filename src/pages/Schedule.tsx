import { useTournamentData } from '../hooks/useTournamentData';
import { LoadingBlock, EmptyBlock } from '../components/common/States';
import { MatchCard } from '../components/match/MatchCard';
import { buildScheduleEntries } from '../data/schedule';
import type { Match } from '../types';

export function Schedule() {
  const { matches, loading, configured } = useTournamentData();
  const entries = buildScheduleEntries();

  if (!configured) {
    return (
      <div className="page">
        <EmptyBlock eyebrow="Setup needed" message="Firebase is not configured yet. Add your Firebase credentials to .env to connect this app to live data." />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page">
        <LoadingBlock label="Loading schedule" />
      </div>
    );
  }

  const matchesByRound = new Map<number, Match[]>();
  for (const m of matches) {
    const arr = matchesByRound.get(m.roundNumber) ?? [];
    arr.push(m);
    matchesByRound.set(m.roundNumber, arr.sort((a, b) => a.courtNumber - b.courtNumber));
  }

  return (
    <div className="page">
      <div className="section">
        <span className="eyebrow">Full schedule</span>
        <h1 style={{ fontSize: 26, marginTop: 4 }}>All rounds &amp; breaks</h1>
      </div>

      {matches.length === 0 ? (
        <div className="section">
          <EmptyBlock eyebrow="Not initialized" message="The tournament hasn't been set up yet." />
        </div>
      ) : (
        entries.map((entry) => {
          if (entry.type === 'break') {
            return (
              <div key={entry.id} className="section break-banner">
                <span className="eyebrow" style={{ color: 'var(--color-clay)' }}>
                  Break {entry.breakNumber}
                </span>
                <span className="break-banner__time">{entry.startTime}–{entry.endTime}</span>
              </div>
            );
          }
          const roundMatches = matchesByRound.get(entry.roundNumber) ?? [];
          return (
            <div key={entry.id} className="section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <h2 style={{ fontSize: 17 }}>Round {entry.roundNumber}</h2>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-dim)' }}>
                  {entry.startTime}–{entry.endTime}
                </span>
              </div>
              <div className="match-grid">
                {roundMatches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
