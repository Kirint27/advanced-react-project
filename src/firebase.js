import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyCJnpXeMLspjBL2OQuMcJcqCx30GHlYwnY",
  authDomain: "project-management-tool-70602.firebaseapp.com",
  projectId: "project-management-tool-70602",
  storageBucket: "project-management-tool-70602.firebasestorage.app",
  messagingSenderId: "15830383641",
  appId: "1:15830383641:web:ba94a69dfae0f44e50be88",
  measurementId: "G-51Z6K6GQF1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // Firebase Auth
const provider = new GoogleAuthProvider();  // Google Auth provider

const db = getFirestore(app);  // Firestore setup

export { auth, provider, db };
