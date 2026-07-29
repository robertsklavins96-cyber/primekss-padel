import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Nav.css';

const PUBLIC_LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/players', label: 'Players' },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAuth();

  return (
    <header className="nav no-print">
      <div className="nav__bar">
        <NavLink to="/" className="nav__brand" onClick={() => setOpen(false)}>
          <span className="nav__ball" aria-hidden="true" />
          Americano Padel
        </NavLink>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-label="Toggle navigation menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav__links ${open ? 'nav__links--open' : ''}`}>
          {PUBLIC_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav__link ${isActive ? 'nav__link--active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to={isAdmin ? '/admin' : '/admin/login'}
            className={({ isActive }) => `nav__link nav__link--admin ${isActive ? 'nav__link--active' : ''}`}
            onClick={() => setOpen(false)}
          >
            {isAdmin ? 'Admin' : 'Admin login'}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
