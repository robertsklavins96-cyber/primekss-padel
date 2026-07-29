import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { signOutAdmin } from '../../firebase/auth';
import { useToast } from '../../hooks/useToast';
import { LoadingBlock } from '../../components/common/States';

const TABS = [
  { to: '/admin', label: 'Results', end: true },
  { to: '/admin/control', label: 'Rounds & status' },
  { to: '/admin/announcements', label: 'Announcements' },
  { to: '/admin/validation', label: 'Validation' },
  { to: '/admin/setup', label: 'Setup & export' },
];

export function AdminLayout() {
  const { user, isAdmin, loading, firebaseConfigured } = useAuth();
  const { showToast } = useToast();

  if (!firebaseConfigured) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="page">
        <LoadingBlock label="Checking access" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  async function handleSignOut() {
    await signOutAdmin();
    showToast('Signed out.', 'info');
  }

  return (
    <div className="page page--wide">
      <div className="section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <span className="eyebrow">Admin area</span>
          <h1 style={{ fontSize: 24, marginTop: 4 }}>Tournament control</h1>
        </div>
        <button type="button" className="btn btn--secondary btn--sm" onClick={handleSignOut}>
          Sign out
        </button>
      </div>

      <div className="section admin-tabs">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) => `admin-tab ${isActive ? 'admin-tab--active' : ''}`}
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <div className="section">
        <Outlet />
      </div>
    </div>
  );
}
