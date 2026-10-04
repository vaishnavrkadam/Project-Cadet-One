import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  type User 
} from '../firebase';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import type { CadetProfile, UserRole } from '../types';

export const ANO_EMAIL = 'vaishnavkadam57@gmail.com'.toLowerCase();

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  cadetProfile: CadetProfile | null;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('Unauthorized');
  const [cadetProfile, setCadetProfile] = useState<CadetProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkUserAuthorization = async (user: User) => {
    const userEmail = (user.email || '').toLowerCase().trim();

    // 1. Check if user is the Designated ANO
    if (userEmail === ANO_EMAIL) {
      setRole('ANO');
      setCadetProfile(null);
      
      // Ensure ANO doc exists in users collection
      try {
        const anoRef = doc(db, 'users', user.uid);
        const anoDoc = await getDoc(anoRef);
        if (!anoDoc.exists()) {
          await setDoc(anoRef, {
            email: userEmail,
            role: 'ANO',
            displayName: user.displayName || 'Associate NCC Officer',
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (e) {
        console.warn('Could not sync ANO profile document', e);
      }
      return;
    }

    // 2. Check if user is in Cadets nominal roll
    try {
      const cadetsRef = collection(db, 'cadets');
      const q = query(cadetsRef, where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const cadetDoc = querySnapshot.docs[0];
        const data = cadetDoc.data() as CadetProfile;
        const profile: CadetProfile = {
          ...data,
          id: cadetDoc.id
        };

        if (profile.status === 'Inactive') {
          setRole('Unauthorized');
          setCadetProfile(null);
          setError('Your cadet account is marked as inactive. Please contact your ANO.');
          return;
        }

        const resolvedRole: UserRole = profile.role === 'Senior' ? 'Senior' : 'Cadet';
        setRole(resolvedRole);
        setCadetProfile(profile);

        // Sync user auth doc
        try {
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, {
            email: userEmail,
            role: resolvedRole,
            cadetId: cadetDoc.id,
            displayName: user.displayName || profile.fullName,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch {
          // Non-blocking
        }
        return;
      }

      // 3. Fallback: Check if authorized directly in users collection (for additional designated roles)
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'ANO') {
          setRole('ANO');
          return;
        }
      }

      // Not found in nominal roll
      setRole('Unauthorized');
      setCadetProfile(null);
    } catch (err: unknown) {
      console.error('Error verifying user authorization:', err);
      // Fallback if offline/network error occurs
      setError('Failed to verify user credentials. Please check your network connection.');
      setRole('Unauthorized');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setError(null);
      if (user) {
        setCurrentUser(user);
        await checkUserAuthorization(user);
      } else {
        setCurrentUser(null);
        setRole('Unauthorized');
        setCadetProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setCurrentUser(result.user);
        await checkUserAuthorization(result.user);
      }
    } catch (err: unknown) {
      console.error('Google Sign-In failed:', err);
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
      setCurrentUser(null);
      setRole('Unauthorized');
      setCadetProfile(null);
    } catch (err: unknown) {
      console.error('Logout error:', err);
    }
  };

  const refreshRole = async () => {
    if (currentUser) {
      setLoading(true);
      await checkUserAuthorization(currentUser);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      role,
      cadetProfile,
      loading,
      error,
      loginWithGoogle,
      logout,
      refreshRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
