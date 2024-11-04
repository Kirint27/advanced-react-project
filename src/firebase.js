// src/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Import Firebase Auth functions
import { getFirestore } from "firebase/firestore"; // Import Firestore functions

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJnpXeMLspjBL2OQuMcJcqCx30GHlYwnY",
  authDomain: "project-management-tool-70602.firebaseapp.com",
  projectId: "project-management-tool-70602",
  storageBucket: "project-management-tool-70602.appspot.com",
  messagingSenderId: "15830383641",
  appId: "1:15830383641:web:ba94a69dfae0f44e50be88",
  measurementId: "G-51Z6K6GQF1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Firebase Auth
const provider = new GoogleAuthProvider(); // Set up the Google provider

// Export auth and provider for use in other parts of your app
export { auth, provider };

const db = getFirestore(app); // Create a Firestore instance

export { db }; // Export the Firestore instance for use in your components

