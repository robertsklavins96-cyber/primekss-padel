import { useState, type FormEvent } from 'react';
import { useTournamentData } from '../../hooks/useTournamentData';
import { addAnnouncement, editAnnouncement, deleteAnnouncement } from '../../firebase/firestore';
import { useToast } from '../../hooks/useToast';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { LoadingBlock, EmptyBlock } from '../../components/common/States';
import type { Announcement } from '../../types';

export function AdminAnnouncements() {
  const { announcements, loading } = useTournamentData();
  const { showToast } = useToast();
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);

  if (loading) return <LoadingBlock label="Loading announcements" />;

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (submitting || !message.trim()) return;
    setSubmitting(true);
    try {
      await addAnnouncement(message.trim());
      setMessage('');
      showToast('Announcement posted.', 'success');
    } catch {
      showToast('Could not post the announcement. Your text is still in the box — try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveEdit(id: string) {
    if (!editingText.trim()) return;
    try {
      await editAnnouncement(id, editingText.trim());
      setEditingId(null);
      showToast('Announcement updated.', 'success');
    } catch {
      showToast('Could not save the edit.', 'error');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteAnnouncement(deleteTarget.id);
      showToast('Announcement deleted.', 'info');
    } catch {
      showToast('Could not delete the announcement.', 'error');
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <form className="card" onSubmit={handleAdd}>
        <div className="field">
          <label htmlFor="new-announcement">New announcement</label>
          <textarea
            id="new-announcement"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Round 5 starts in 5 minutes on all courts."
          />
        </div>
        <button type="submit" className="btn btn--primary" disabled={submitting || !message.trim()}>
          {submitting ? 'Posting…' : 'Post announcement'}
        </button>
      </form>

      {announcements.length === 0 ? (
        <EmptyBlock eyebrow="No announcements" message="Announcements you post will appear on the public dashboard." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {announcements.map((a) => (
            <div key={a.id} className="card">
              {editingId === a.id ? (
                <div>
                  <textarea
                    rows={2}
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    style={{ width: '100%', background: 'var(--color-court-2)', border: '1px solid var(--color-line)', borderRadius: 8, padding: 10, marginBottom: 10 }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" className="btn btn--primary btn--sm" onClick={() => handleSaveEdit(a.id)}>Save</button>
                    <button type="button" className="btn btn--secondary btn--sm" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 14, marginBottom: 10, lineHeight: 1.5 }}>{a.message}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      className="btn btn--secondary btn--sm"
                      onClick={() => {
                        setEditingId(a.id);
                        setEditingText(a.message);
                      }}
                    >
                      Edit
                    </button>
                    <button type="button" className="btn btn--danger btn--sm" onClick={() => setDeleteTarget(a)}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this announcement?"
        message="This removes it from the public dashboard immediately. This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
