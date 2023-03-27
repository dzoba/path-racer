import { useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';

const useAnonymousAuth = () => {
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth).catch((error) => {
          console.error('Error signing in anonymously:', error);
        });
      } else {
        console.log('User signed in anonymously with uid:', user.uid);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
};

export default useAnonymousAuth;
