import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function isConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
}

export const firebaseConfigured = isConfigured();

let app: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;

if (firebaseConfigured) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  dbInstance = getFirestore(app);
  authInstance = getAuth(app);
}

export { app };
// db and auth are asserted non-null at call sites guarded by firebaseConfigured
export const db = dbInstance as Firestore;
export const auth = authInstance as Auth;

export const TOURNAMENT_ID = import.meta.env.VITE_TOURNAMENT_ID || 'main';
