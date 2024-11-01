import React from "react";
import { navigate } from "@reach/router"; // Import navigate from Reach Router
import { auth, provider } from '../../firebase'; // Adjust the path as needed
import { signInWithRedirect } from "firebase/auth"; // Import the method for redirect sign-in
import useLogin from "../../services/login.service";
const Login = () => {
  const { loginWithGoogle} = useLogin()

const handleLogin = () => {
    loginWithGoogle()
    navigate('/dashboard')
  };
    

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Project Management Tool</h1>
      <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
