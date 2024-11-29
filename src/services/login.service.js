import { useState, useEffect } from "react";
import { auth, provider } from "../firebase"; // Firebase auth and provider
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { db } from "../firebase";
import { doc, setDoc,  } from "firebase/firestore";

const useLogin = () => {
  const [user, setUser] = useState(null); // Store user object
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Store error messages


  useEffect(() => {
    // This is Firebase's listener for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // If user is logged in, set the user state
      } else {
        setUser(null); // If no user is logged in, reset the user state
      }
      setLoading(false); // Once auth state is checked, stop loading
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  const loginWithGooglePopup = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setUser(user); // Set user state after successful login
        console.log("User logged in with popup:", user);
        const userRef = doc(db, "users", user.uid); // Use the user's UID as the document ID
        setDoc(userRef, {
          displayName: user.displayName, 
          email: user.email,
id : user.uid        }, { merge: true }) // merge: true ensures it doesn't overwrite existing fields
          .then(() => {
            console.log("User saved to Firestore");
          })
          .catch((error) => {
            console.error("Error saving user to Firestore:", error);
          });
      })
      .catch((error) => {
        console.error("Error during Google sign-in with popup:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  const logout = () => {
    return signOut(auth)
      .then(() => {
        setUser(null); // Reset user state after logout
        return true; // Return a promise that resolves when the logout is complete
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
        setError(error.message); // Set error state if sign-out fails
        return false; // Return a promise that resolves with false if the logout fails
      });
  };

  return { user, loading, error, loginWithGooglePopup, logout };
};

export default useLogin;
