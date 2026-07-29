import type { Match, PlayerStats } from '../types';
import { playerName } from '../data/schedule';

function escapeCsvField(value: string | number): string {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(rows: (string | number)[][]): string {
  return rows.map((row) => row.map(escapeCsvField).join(',')).join('\r\n');
}

function downloadCsv(filename: string, csvContent: string) {
  // Prepend BOM so Latvian characters (ā) render correctly in Excel.
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportLeaderboardCsv(stats: PlayerStats[]) {
  const header = ['Position', 'Player', 'Matches played', 'Wins', 'Draws', 'Losses', 'Points scored', 'Points against', 'Point difference'];
  const rows = stats.map((s) => [
    s.position,
    playerName(s.playerId),
    s.matchesPlayed,
    s.wins,
    s.draws,
    s.losses,
    s.pointsScored,
    s.pointsAgainst,
    s.pointDifference,
  ]);
  downloadCsv('leaderboard.csv', toCsv([header, ...rows]));
}

export function exportMatchesCsv(matches: Match[]) {
  const header = ['Round', 'Time', 'Court', 'Team 1', 'Team 2', 'Team 1 score', 'Team 2 score', 'Match status', 'Override reason'];
  const rows = matches
    .slice()
    .sort((a, b) => (a.roundNumber - b.roundNumber) || (a.courtNumber - b.courtNumber))
    .map((m) => [
      m.roundNumber,
      `${m.startTime}-${m.endTime}`,
      m.courtNumber,
      `${playerName(m.team1PlayerIds[0])} & ${playerName(m.team1PlayerIds[1])}`,
      `${playerName(m.team2PlayerIds[0])} & ${playerName(m.team2PlayerIds[1])}`,
      m.team1Score ?? '',
      m.team2Score ?? '',
      m.status,
      m.overrideReason ?? '',
    ]);
  downloadCsv('matches.csv', toCsv([header, ...rows]));
}
