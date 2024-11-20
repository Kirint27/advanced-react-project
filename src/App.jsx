import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Corrected imports
import Projects from "./contianers/Projects/Projects";
import Dashboard from "./contianers/Dashboard/Dashboard";
import KanbanBoard from "./components/Kaban/Kaban";
import Login from "./contianers/Login";
/**
 * App component that renders the main routes of the application.
 * 
 * @returns {JSX.Element} The JSX element representing the App component.
 */
const App = () => {
  
  return (
    <Router>  {/* Ensure Router is wrapping everything */}
      <Routes>  {/* Routes is used to define path-to-component mappings */}
      <Route path="" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/projects" element={<Projects />} />
        <Route path="/project/:projectId/tasks" element={<KanbanBoard />} />
      </Routes>
    </Router>
  );
};
export default App;
