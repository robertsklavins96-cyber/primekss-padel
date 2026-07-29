import { useState } from 'react';
import type { Match, MatchStatus } from '../../types';
import { playerName } from '../../data/schedule';
import { validateNormalScore, validateOverrideScore } from '../../utils/ranking';
import { saveMatchResult, resetMatchResult, setMatchStatus } from '../../firebase/firestore';
import { useToast } from '../../hooks/useToast';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { MatchStatusBadge } from '../common/StatusBadge';

const OVERRIDE_REASONS = ['Match stopped early', 'Injury', 'Technical interruption', 'Other'];

export function AdminMatchEntry({ match }: { match: Match }) {
  const { showToast } = useToast();
  const [team1Score, setTeam1Score] = useState(match.team1Score !== null ? String(match.team1Score) : '');
  const [team2Score, setTeam2Score] = useState(match.team2Score !== null ? String(match.team2Score) : '');
  const [override, setOverride] = useState(match.resultOverride);
  const [overrideReasonPreset, setOverrideReasonPreset] = useState(
    match.overrideReason && OVERRIDE_REASONS.includes(match.overrideReason) ? match.overrideReason : OVERRIDE_REASONS[0]
  );
  const [overrideReasonCustom, setOverrideReasonCustom] = useState(
    match.overrideReason && !OVERRIDE_REASONS.includes(match.overrideReason) ? match.overrideReason : ''
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const isEditing = match.status === 'completed';

  async function handleSave() {
    if (saving) return;
    setError(null);

    const s1 = Number(team1Score);
    const s2 = Number(team2Score);

    if (team1Score.trim() === '' || team2Score.trim() === '') {
      setError('Enter both scores.');
      return;
    }

    const reason = overrideReasonPreset === 'Other' ? overrideReasonCustom.trim() : overrideReasonPreset;

    if (override && !reason) {
      setError('An explanation is required when using an override.');
      return;
    }

    const validationError = override ? validateOverrideScore(s1, s2) : validateNormalScore(s1, s2);
    if (validationError) {
      setError(validationError.message);
      return;
    }

    setSaving(true);
    try {
      await saveMatchResult(match.id, s1, s2, { override, overrideReason: override ? reason : null });
      showToast(`Result saved: Round ${match.roundNumber}, Court ${match.courtNumber}.`, 'success');
    } catch {
      setError('Could not save — check your connection and try again. Your entered scores are still here.');
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    setSaving(true);
    try {
      await resetMatchResult(match.id);
      setTeam1Score('');
      setTeam2Score('');
      setOverride(false);
      showToast('Result reset.', 'info');
    } catch {
      showToast('Could not reset the result. Try again.', 'error');
    } finally {
      setSaving(false);
      setConfirmReset(false);
    }
  }

  async function handleStatusChange(status: MatchStatus) {
    try {
      await setMatchStatus(match.id, status);
    } catch {
      showToast('Could not update match status.', 'error');
    }
  }

  return (
    <div className="card admin-match">
      <div className="admin-match__header">
        <span className="admin-match__title">
          R{match.roundNumber} · Court {match.courtNumber} · {match.startTime}
        </span>
        <MatchStatusBadge status={match.status} />
      </div>

      <div className="admin-match__teams">
        <span>{playerName(match.team1PlayerIds[0])} &amp; {playerName(match.team1PlayerIds[1])}</span>
        <span className="admin-match__vs">vs</span>
        <span>{playerName(match.team2PlayerIds[0])} &amp; {playerName(match.team2PlayerIds[1])}</span>
      </div>

      <div className="admin-match__scores">
        <input
          type="number"
          inputMode="numeric"
          aria-label={`${playerName(match.team1PlayerIds[0])} and ${playerName(match.team1PlayerIds[1])} score`}
          value={team1Score}
          onChange={(e) => setTeam1Score(e.target.value)}
          min={0}
        />
        <span>–</span>
        <input
          type="number"
          inputMode="numeric"
          aria-label={`${playerName(match.team2PlayerIds[0])} and ${playerName(match.team2PlayerIds[1])} score`}
          value={team2Score}
          onChange={(e) => setTeam2Score(e.target.value)}
          min={0}
        />
      </div>

      <label className="admin-match__override-toggle">
        <input type="checkbox" checked={override} onChange={(e) => setOverride(e.target.checked)} />
        Unusual situation (admin override)
      </label>

      {override && (
        <div className="field" style={{ marginTop: 8 }}>
          <label htmlFor={`reason-${match.id}`}>Reason</label>
          <select id={`reason-${match.id}`} value={overrideReasonPreset} onChange={(e) => setOverrideReasonPreset(e.target.value)}>
            {OVERRIDE_REASONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {overrideReasonPreset === 'Other' && (
            <input
              style={{ marginTop: 8 }}
              placeholder="Describe what happened"
              value={overrideReasonCustom}
              onChange={(e) => setOverrideReasonCustom(e.target.value)}
            />
          )}
        </div>
      )}

      {error && <p className="field-error">{error}</p>}

      <div className="admin-match__actions">
        <button type="button" className="btn btn--primary btn--sm" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : isEditing ? 'Update result' : 'Save result'}
        </button>
        {match.status === 'upcoming' && (
          <button type="button" className="btn btn--secondary btn--sm" onClick={() => handleStatusChange('in_progress')}>
            Mark in progress
          </button>
        )}
        {isEditing && (
          <button type="button" className="btn btn--danger btn--sm" onClick={() => setConfirmReset(true)} disabled={saving}>
            Reset
          </button>
        )}
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Reset this result?"
        message="This clears the saved score and returns the match to upcoming. This cannot be undone."
        confirmLabel="Reset result"
        danger
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
