import { useMemo } from 'react';
import { validateSchedule } from '../../utils/scheduleValidation';

export function AdminValidation() {
  const result = useMemo(() => validateSchedule(), []);

  return (
    <div style={{ maxWidth: 640 }}>
      <div className={`card validation-banner ${result.valid ? 'validation-banner--ok' : 'validation-banner--fail'}`}>
        <span className="eyebrow" style={{ color: result.valid ? 'var(--color-win)' : 'var(--color-danger)' }}>
          {result.valid ? 'Schedule valid' : `${result.violations.length} issue${result.violations.length === 1 ? '' : 's'} found`}
        </span>
        <p style={{ marginTop: 6, fontSize: 13, color: 'var(--color-text-dim)' }}>
          {result.summary.totalRounds} rounds · {result.summary.totalMatches} matches · {result.summary.totalBreaks} breaks
        </p>
      </div>

      {!result.valid && (
        <div className="section" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {result.violations.map((v, i) => (
            <div key={i} className="card" style={{ borderColor: 'var(--color-danger)' }}>
              <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{v.rule}</p>
              <p style={{ fontSize: 13, color: 'var(--color-text-dim)' }}>{v.detail}</p>
              {(v.roundNumber || v.courtNumber) && (
                <p style={{ fontSize: 12, color: 'var(--color-text-faint)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                  {v.roundNumber ? `Round ${v.roundNumber}` : ''} {v.courtNumber ? `· Court ${v.courtNumber}` : ''}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
