import type { Announcement } from '../../types';

export function AnnouncementList({ announcements }: { announcements: Announcement[] }) {
  if (announcements.length === 0) {
    return <p style={{ color: 'var(--color-text-dim)', fontSize: 14 }}>No announcements yet.</p>;
  }
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {announcements.map((a) => (
        <li
          key={a.id}
          className="card"
          style={{ padding: '12px 14px', borderLeft: '3px solid var(--color-clay)', fontSize: 14, lineHeight: 1.5 }}
        >
          {a.message}
        </li>
      ))}
    </ul>
  );
}
