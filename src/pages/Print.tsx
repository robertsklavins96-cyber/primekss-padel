import { useEffect } from 'react';
import { useTournamentData } from '../hooks/useTournamentData';
import { LoadingBlock } from '../components/common/States';
import { buildScheduleEntries, playerName, TOURNAMENT_NAME } from '../data/schedule';
import type { Match } from '../types';

export function Print() {
  const { matches, leaderboard, loading, configured } = useTournamentData();
  const entries = buildScheduleEntries();

  useEffect(() => {
    document.title = `${TOURNAMENT_NAME} — Print`;
  }, []);

  if (!configured || loading) {
    return (
      <div className="page">
        <LoadingBlock label="Preparing printable page" />
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
    <div className="page print-page">
      <div className="no-print" style={{ marginBottom: 16 }}>
        <button type="button" className="btn btn--primary" onClick={() => window.print()}>
          Print / Save as PDF
        </button>
      </div>

      <h1 style={{ marginBottom: 4 }}>{TOURNAMENT_NAME}</h1>
      <p style={{ color: '#555', marginBottom: 20 }}>16:30 – 19:00 · 12 players · 3 courts · 8 rounds</p>

      <h2 style={{ fontSize: 16, marginBottom: 8 }}>Leaderboard</h2>
      <table className="print-table">
        <thead>
          <tr>
            <th>#</th><th>Player</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>PF</th><th>PA</th><th>+/-</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((s) => (
            <tr key={s.playerId}>
              <td>{s.position}</td>
              <td>{playerName(s.playerId)}</td>
              <td>{s.matchesPlayed}</td>
              <td>{s.wins}</td>
              <td>{s.draws}</td>
              <td>{s.losses}</td>
              <td>{s.pointsScored}</td>
              <td>{s.pointsAgainst}</td>
              <td>{s.pointDifference}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: 16, margin: '24px 0 8px' }}>Schedule</h2>
      {entries.map((entry) => {
        if (entry.type === 'break') {
          return (
            <p key={entry.id} style={{ fontStyle: 'italic', margin: '10px 0', color: '#555' }}>
              Break {entry.breakNumber}: {entry.startTime}–{entry.endTime}
            </p>
          );
        }
        const roundMatches = matchesByRound.get(entry.roundNumber) ?? [];
        return (
          <div key={entry.id} style={{ marginBottom: 14, breakInside: 'avoid' }}>
            <h3 style={{ fontSize: 14, margin: '10px 0 4px' }}>
              Round {entry.roundNumber} ({entry.startTime}–{entry.endTime})
            </h3>
            <table className="print-table">
              <thead>
                <tr><th>Court</th><th>Team 1</th><th>Score</th><th>Team 2</th><th>Score</th><th>Status</th></tr>
              </thead>
              <tbody>
                {roundMatches.map((m) => (
                  <tr key={m.id}>
                    <td>{m.courtNumber}</td>
                    <td>{playerName(m.team1PlayerIds[0])} &amp; {playerName(m.team1PlayerIds[1])}</td>
                    <td>{m.team1Score ?? '–'}</td>
                    <td>{playerName(m.team2PlayerIds[0])} &amp; {playerName(m.team2PlayerIds[1])}</td>
                    <td>{m.team2Score ?? '–'}</td>
                    <td>{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
