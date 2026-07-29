import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, firebaseConfigured } from './config';

export function subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
  if (!firebaseConfigured) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function signIn(email: string, password: string): Promise<void> {
  if (!firebaseConfigured) throw new Error('Firebase is not configured.');
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signOutAdmin(): Promise<void> {
  if (!firebaseConfigured) return;
  await firebaseSignOut(auth);
}

/**
 * Checks whether the given UID has a document in the top-level `admins`
 * collection, which is what grants write access under Firestore rules.
 */
export async function checkIsAdmin(uid: string): Promise<boolean> {
  if (!firebaseConfigured) return false;
  const ref = doc(db, 'admins', uid);
  const snap = await getDoc(ref);
  return snap.exists();
}
