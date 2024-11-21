import React from "react";
import { Navigate } from "react-router-dom";
import useLogin from "../services/login.service"; // Import the login hook

/**
 * ProtectedRoute component that checks if the user is authenticated.
 * 
 * @param {JSX.Element} children - The child components to render if authenticated.
 * @returns {JSX.Element} - The child elements or a redirect to the login page.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useLogin(); // Get user state from the login hook
console.log(user)
  // Display a loading message while checking authentication status
  if (loading) {
    return null;
  }
console.log(loading)
  // If user is not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/" />;
  }

  // If authenticated, render the child components (protected route content)
  return children;
};

export default ProtectedRoute;
