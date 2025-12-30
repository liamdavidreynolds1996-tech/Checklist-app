import { useState, useEffect, useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import {
  initializeFirebase,
  signInWithGoogle,
  signOut as firebaseSignOut,
  onAuthChange,
} from '../services/firebase';
import type { User } from '../types';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(false);

  useEffect(() => {
    const configured = initializeFirebase();
    setIsFirebaseConfigured(configured);

    if (configured) {
      const unsubscribe = onAuthChange((firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Local mode - create anonymous user
      const localUser = localStorage.getItem('checklistLocalUser');
      if (localUser) {
        setUser(JSON.parse(localUser));
      } else {
        const newUser: User = {
          uid: `local_${Date.now()}`,
          email: null,
          displayName: 'Local User',
          photoURL: null,
        };
        localStorage.setItem('checklistLocalUser', JSON.stringify(newUser));
        setUser(newUser);
      }
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async () => {
    if (isFirebaseConfigured) {
      setLoading(true);
      await signInWithGoogle();
      setLoading(false);
    }
  }, [isFirebaseConfigured]);

  const signOut = useCallback(async () => {
    if (isFirebaseConfigured) {
      await firebaseSignOut();
    }
    setUser(null);
  }, [isFirebaseConfigured]);

  return { user, loading, isFirebaseConfigured, signIn, signOut };
}
