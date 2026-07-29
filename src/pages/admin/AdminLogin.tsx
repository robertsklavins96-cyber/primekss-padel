import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { signIn } from '../../firebase/auth';
import { useToast } from '../../hooks/useToast';
import { EmptyBlock } from '../../components/common/States';

export function AdminLogin() {
  const { user, isAdmin, loading, firebaseConfigured } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!firebaseConfigured) {
    return (
      <div className="page" style={{ maxWidth: 480 }}>
        <EmptyBlock eyebrow="Setup needed" message="Firebase is not configured yet. Add your Firebase credentials to .env before signing in." />
      </div>
    );
  }

  if (!loading && user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      showToast('Signed in.', 'success');
    } catch {
      setError('Sign-in failed. Check the email and password and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page" style={{ maxWidth: 420 }}>
      <div className="section">
        <span className="eyebrow">Admin</span>
        <h1 style={{ fontSize: 24, marginTop: 4 }}>Sign in</h1>
      </div>

      {!loading && user && !isAdmin && (
        <div className="card section" style={{ borderColor: 'var(--color-danger)' }}>
          <p style={{ fontSize: 14 }}>This account is signed in but isn't listed as a tournament admin. Ask an existing admin to add your user ID to the admins collection.</p>
        </div>
      )}

      <form className="card section" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="field-error" style={{ marginBottom: 14 }}>{error}</p>}
        <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
