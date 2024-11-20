import { useState, useEffect } from "react";
import { auth, provider } from "../firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loginWithGooglePopup = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setUser(user);
        console.log("User logged in with popup:", user);
        navigate("/dashboard"); // Redirect to dashboard after login
      })
      .catch((error) => {
        console.error("Error during Google sign-in with popup:", error);
        setError(error.message);
        setLoading(false); // Set loading to false when login fails

      });
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
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
