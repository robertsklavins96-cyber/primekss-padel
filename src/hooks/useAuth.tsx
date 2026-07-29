import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { subscribeToAuthChanges, checkIsAdmin } from '../firebase/auth';
import { firebaseConfigured } from '../firebase/config';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  firebaseConfigured: boolean;
}

const AuthContext = createContext<AuthState>({ user: null, isAdmin: false, loading: true, firebaseConfigured: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAuthChanges(async (u) => {
      setUser(u);
      if (u) {
        try {
          const admin = await checkIsAdmin(u.uid);
          setIsAdmin(admin);
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, firebaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
