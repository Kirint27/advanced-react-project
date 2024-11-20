import { useState, useEffect } from "react";
import { auth, provider } from "../firebase"; 
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"; 
import { useNavigate } from "react-router-dom"; 

const useLogin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(false); 
      if (currentUser) {
        setUser(currentUser);
        console.log("User logged in:", currentUser); // Log user details
        
      } else {
        setUser(null);
        console.log("User is logged out");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loginWithGooglePopup = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user; 
        console.log("User logged in with popup: ", user); 
        setUser(user); 
        navigate("/dashboard"); // Redirect to dashboard after login
      })
      .catch((error) => {
        console.error("Error during Google sign-in with popup:", error);
        setError(error.message);
      });
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        setUser(null); 
        navigate("/"); // Redirect to login page after logout
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
        setError(error.message); 
      });
  };

  return { user, loading, error, loginWithGooglePopup, logout };
};

export default useLogin;
