import { useState } from 'react';
import { useTournamentData } from '../../hooks/useTournamentData';
import { LoadingBlock, EmptyBlock } from '../../components/common/States';
import { setTournamentStatus, setActiveRound, clearManualOverrides } from '../../firebase/firestore';
import { useToast } from '../../hooks/useToast';
import { NUMBER_OF_ROUNDS } from '../../data/schedule';
import type { TournamentStatus } from '../../types';

const STATUS_OPTIONS: TournamentStatus[] = ['not_started', 'in_progress', 'break', 'completed'];

export function AdminControl() {
  const { tournament, loading, effectiveStatus, effectiveActiveRound } = useTournamentData();
  const { showToast } = useToast();
  const [busy, setBusy] = useState(false);

  if (loading) return <LoadingBlock label="Loading tournament" />;
  if (!tournament) {
    return <EmptyBlock eyebrow="Not initialized" message="Initialize the tournament from the Setup tab first." />;
  }

  async function handleStatusChange(status: TournamentStatus) {
    setBusy(true);
    try {
      await setTournamentStatus(status, true);
      showToast(`Status manually set to "${status.replace('_', ' ')}".`, 'success');
    } catch {
      showToast('Could not update status.', 'error');
    } finally {
      setBusy(false);
    }
  }

  async function handleRoundChange(round: number) {
    setBusy(true);
    try {
      await setActiveRound(round, true);
      showToast(`Active round manually set to ${round}.`, 'success');
    } catch {
      showToast('Could not update the active round.', 'error');
    } finally {
      setBusy(false);
    }
  }

  async function handleClearOverrides() {
    setBusy(true);
    try {
      await clearManualOverrides();
      showToast('Switched back to automatic scheduling.', 'info');
    } catch {
      showToast('Could not clear overrides.', 'error');
    } finally {
      setBusy(false);
    }
  }

  const rounds = Array.from({ length: NUMBER_OF_ROUNDS }, (_, i) => i + 1);
  const hasOverride = tournament.manualStatusOverride || tournament.manualRoundOverride;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
      <div className="card">
        <p style={{ fontSize: 13, color: 'var(--color-text-dim)', marginBottom: 4 }}>Currently showing</p>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>
          {effectiveStatus.replace('_', ' ')} · Round {effectiveActiveRound}
          {hasOverride ? ' (manual)' : ' (automatic, by clock)'}
        </p>
      </div>

      <div className="field">
        <label htmlFor="status-select">Tournament status</label>
        <select id="status-select" value={tournament.status} onChange={(e) => handleStatusChange(e.target.value as TournamentStatus)} disabled={busy}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="round-select">Active round</label>
        <select id="round-select" value={tournament.activeRound} onChange={(e) => handleRoundChange(Number(e.target.value))} disabled={busy}>
          {rounds.map((r) => (
            <option key={r} value={r}>Round {r}</option>
          ))}
        </select>
      </div>

      {hasOverride && (
        <button type="button" className="btn btn--secondary" onClick={handleClearOverrides} disabled={busy}>
          Switch back to automatic scheduling
        </button>
      )}
    </div>
  );
}
