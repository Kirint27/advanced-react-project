import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Projects from "./contianers/Projects/Projects";
import Dashboard from "./contianers/Dashboard/Dashboard";
import KanbanBoard from "./components/Kaban/Kaban";
import Login from "./contianers/Login/Login";
import ProtectedRoute from "./components/ProtectedRoutes";
import useLogin from "./services/login.service";
import SideBar from "./components/SideBar/SideBar";
import { useNavigate } from "react-router-dom";

const App = () => {
  const { user, loading, logout } = useLogin();

  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to the login page after logout
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <Login />
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute user={user}>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:projectId/tasks"
          element={
            <ProtectedRoute user={user}>
              <KanbanBoard />
            </ProtectedRoute>
          }
        />

        {/* Other routes */}

      </Routes>
      {user && <SideBar handleLogout={handleLogout} />}
    </Router>
  );
};

export default App;