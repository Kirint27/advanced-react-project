// src/components/Login.js
import React, {useEffect} from "react";
import useLogin from "../../services/login.service";

const Login = () => {
  const { loginWithGooglePopup, user, loading } = useLogin(); // Destructure login methods and user state


  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h1>Project Management Tool</h1>
      <button onClick={loginWithGooglePopup} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
