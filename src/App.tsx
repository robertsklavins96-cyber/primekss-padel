import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './hooks/useToast';
import { Nav } from './components/layout/Nav';
import { Dashboard } from './pages/Dashboard';
import { Schedule } from './pages/Schedule';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { PlayersList } from './pages/PlayersList';
import { PlayerDetail } from './pages/PlayerDetail';
import { Print } from './pages/Print';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminResults } from './pages/admin/AdminResults';
import { AdminControl } from './pages/admin/AdminControl';
import { AdminAnnouncements } from './pages/admin/AdminAnnouncements';
import { AdminValidation } from './pages/admin/AdminValidation';
import { AdminSetup } from './pages/admin/AdminSetup';

function NotFound() {
  return (
    <div className="page state-block">
      <span className="eyebrow">404</span>
      <p>That page doesn't exist.</p>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="app-shell">
            <Nav />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/players" element={<PlayersList />} />
              <Route path="/players/:playerId" element={<PlayerDetail />} />
              <Route path="/print" element={<Print />} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminResults />} />
                <Route path="control" element={<AdminControl />} />
                <Route path="announcements" element={<AdminAnnouncements />} />
                <Route path="validation" element={<AdminValidation />} />
                <Route path="setup" element={<AdminSetup />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
