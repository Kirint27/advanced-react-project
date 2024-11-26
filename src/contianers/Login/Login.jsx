// src/components/Login.js
import React, {useEffect} from "react";
import useLogin from "../../services/login.service";
import styles from "./Login.module.scss";
const Login = () => {
  const { loginWithGooglePopup, user, loading } = useLogin(); // Destructure login methods and user state


  return (
    <div className={styles.login} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h1>TaskFlow</h1>
      <button onClick={loginWithGooglePopup} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Sign in with Google
      </button>
      <footer>
        <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
      </footer>
    </div>
  );
};

export default Login;
