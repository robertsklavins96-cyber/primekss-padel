import { useEffect, useState } from 'react';
import { useTournamentData } from '../../hooks/useTournamentData';
import { initializeTournament, isTournamentInitialized } from '../../firebase/firestore';
import { useToast } from '../../hooks/useToast';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { exportLeaderboardCsv, exportMatchesCsv } from '../../utils/csvExport';
import { Link } from 'react-router-dom';

export function AdminSetup() {
  const { tournament, matches, leaderboard, loading } = useTournamentData();
  const { showToast } = useToast();
  const [initialized, setInitialized] = useState<boolean | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    isTournamentInitialized().then(setInitialized).catch(() => setInitialized(false));
  }, [tournament]);

  async function handleInitialize() {
    setInitializing(true);
    try {
      await initializeTournament();
      showToast('Tournament initialized.', 'success');
      setInitialized(true);
    } catch {
      showToast('Initialization failed. Check your connection and try again.', 'error');
    } finally {
      setInitializing(false);
      setConfirmOpen(false);
    }
  }

  const hasResults = leaderboard.some((s) => s.matchesPlayed > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 560 }}>
      <div className="card">
        <h3 style={{ fontSize: 15, marginBottom: 6 }}>Initialize tournament</h3>
        <p style={{ fontSize: 13, color: 'var(--color-text-dim)', marginBottom: 14, lineHeight: 1.5 }}>
          Creates the tournament document, 12 players, 8 rounds, 24 matches, and 2 breaks using fixed IDs.
          Safe to run again — it won't create duplicates, but it will reset any data already entered under
          those IDs, so confirm before running it on a live tournament.
        </p>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setConfirmOpen(true)}
          disabled={initializing || loading}
        >
          {initializing ? 'Initializing…' : initialized ? 'Re-initialize tournament' : 'Initialize tournament'}
        </button>
        {initialized === false && (
          <p style={{ fontSize: 12, color: 'var(--color-clay)', marginTop: 8 }}>Not initialized yet.</p>
        )}
      </div>

      <div className="card">
        <h3 style={{ fontSize: 15, marginBottom: 6 }}>Exports</h3>
        <p style={{ fontSize: 13, color: 'var(--color-text-dim)', marginBottom: 14 }}>
          Download CSVs of the current standings and match results.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" className="btn btn--secondary btn--sm" onClick={() => exportLeaderboardCsv(leaderboard)} disabled={!hasResults}>
            Export leaderboard CSV
          </button>
          <button type="button" className="btn btn--secondary btn--sm" onClick={() => exportMatchesCsv(matches)} disabled={matches.length === 0}>
            Export matches CSV
          </button>
          <Link to="/print" className="btn btn--secondary btn--sm">
            Open printable page
          </Link>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={initialized ? 'Re-initialize tournament data?' : 'Initialize tournament?'}
        message={
          initialized
            ? 'This overwrites the tournament, players, rounds, and matches with the fixed schedule. Any scores already entered will be cleared. This cannot be undone.'
            : 'This creates the tournament document, all players, rounds, and matches from the fixed schedule.'
        }
        confirmLabel={initialized ? 'Overwrite and re-initialize' : 'Initialize'}
        danger={Boolean(initialized)}
        onConfirm={handleInitialize}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
