import { useTournamentData } from '../hooks/useTournamentData';
import { LoadingBlock, EmptyBlock } from '../components/common/States';
import { LeaderboardTable } from '../components/leaderboard/LeaderboardTable';
import { exportLeaderboardCsv } from '../utils/csvExport';

export function LeaderboardPage() {
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
        <LoadingBlock label="Loading leaderboard" />
      </div>
    );
  }

  const hasResults = leaderboard.some((s) => s.matchesPlayed > 0);

  return (
    <div className="page">
      <div className="section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <span className="eyebrow">Standings</span>
          <h1 style={{ fontSize: 26, marginTop: 4 }}>Leaderboard</h1>
        </div>
        <button type="button" className="btn btn--secondary btn--sm" onClick={() => exportLeaderboardCsv(leaderboard)} disabled={!hasResults}>
          Export CSV
        </button>
      </div>

      <div className="section">
        {hasResults ? (
          <LeaderboardTable stats={leaderboard} />
        ) : (
          <EmptyBlock eyebrow="No results yet" message="Standings will appear once the first matches are completed." />
        )}
      </div>
    </div>
  );
}
