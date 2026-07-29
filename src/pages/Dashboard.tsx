import { Link } from 'react-router-dom';
import { useTournamentData } from '../hooks/useTournamentData';
import { LoadingBlock, EmptyBlock } from '../components/common/States';
import { TournamentStatusBadge } from '../components/common/StatusBadge';
import { MatchCard } from '../components/match/MatchCard';
import { LeaderboardTable } from '../components/leaderboard/LeaderboardTable';
import { AnnouncementList } from '../components/announcements/AnnouncementList';
import { NUMBER_OF_ROUNDS, TOURNAMENT_NAME } from '../data/schedule';
import { nextRoundNumber } from '../utils/timeSchedule';

export function Dashboard() {
  const { tournament, matches, announcements, leaderboard, loading, effectiveStatus, effectiveActiveRound, configured } = useTournamentData();

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
        <LoadingBlock label="Loading tournament" />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="page">
        <EmptyBlock eyebrow="Not initialized" message="The tournament hasn't been set up yet. An admin needs to initialize it first." />
      </div>
    );
  }

  const completedMatches = matches.filter((m) => m.status === 'completed');
  const remainingMatches = matches.filter((m) => m.status !== 'completed');
  const currentRoundMatches = matches.filter((m) => m.roundNumber === effectiveActiveRound);
  const next = nextRoundNumber(effectiveActiveRound);
  const progressPct = matches.length ? Math.round((completedMatches.length / matches.length) * 100) : 0;

  return (
    <div className="page">
      <div className="section" style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span className="eyebrow">Live tournament</span>
          <h1 style={{ fontSize: 28, marginTop: 4 }}>{TOURNAMENT_NAME}</h1>
        </div>
        <TournamentStatusBadge status={effectiveStatus} />
      </div>

      <div className="section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
        <StatTile label="Current round" value={effectiveStatus === 'break' ? 'Break' : `Round ${effectiveActiveRound} / ${NUMBER_OF_ROUNDS}`} />
        <StatTile label="Next round" value={next ? `Round ${next}` : '—'} />
        <StatTile label="Completed matches" value={`${completedMatches.length} / ${matches.length}`} />
        <StatTile label="Remaining matches" value={`${remainingMatches.length}`} />
      </div>

      <div className="section">
        <div className="progress-bar">
          <div className="progress-bar__fill" style={{ width: `${progressPct}%` }} />
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-text-dim)', marginTop: 6 }}>{progressPct}% of matches complete</p>
      </div>

      {announcements.length > 0 && (
        <div className="section">
          <h2 style={{ fontSize: 16, marginBottom: 10 }}>Announcements</h2>
          <AnnouncementList announcements={announcements} />
        </div>
      )}

      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h2 style={{ fontSize: 16 }}>
            {effectiveStatus === 'break' ? 'On break' : `Round ${effectiveActiveRound}`}
          </h2>
          <Link to="/schedule" style={{ fontSize: 13, color: 'var(--color-ball)', fontWeight: 600 }}>
            Full schedule →
          </Link>
        </div>
        {currentRoundMatches.length === 0 ? (
          <EmptyBlock eyebrow="No matches" message="No matches scheduled for this round." />
        ) : (
          <div className="match-grid">
            {currentRoundMatches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h2 style={{ fontSize: 16 }}>Leaderboard</h2>
          <Link to="/leaderboard" style={{ fontSize: 13, color: 'var(--color-ball)', fontWeight: 600 }}>
            Full leaderboard →
          </Link>
        </div>
        {leaderboard.every((s) => s.matchesPlayed === 0) ? (
          <EmptyBlock eyebrow="No results yet" message="Standings will appear once the first matches are completed." />
        ) : (
          <LeaderboardTable stats={leaderboard.slice(0, 5)} />
        )}
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <p style={{ fontSize: 12, color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginTop: 4 }}>{value}</p>
    </div>
  );
}
