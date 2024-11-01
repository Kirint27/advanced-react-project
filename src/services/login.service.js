// src/services/useLogin.js
import { useEffect, useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithRedirect, getRedirectResult, onAuthStateChanged } from 'firebase/auth';

const useLogin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up the authentication listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Stop loading when we have user information
      console.log('Current user:', currentUser); // Log the current user
    });

    // Check for redirect result after login
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          setUser(result.user); // Set user if a redirect result is available
        }
      })
      .catch((error) => {
        console.error("Error handling redirect:", error);
      });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = () => {
    return signInWithRedirect(auth, provider);
  };

  return { user, loading, loginWithGoogle };
};

export default useLogin;
