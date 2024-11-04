import React from "react";
import { Router } from "@reach/router"; // Import Router from @reach/router
import Login from "../Login/Login";
import Dashboard from "../Dashboard";
import Projects from '../Projects';
import KanbanBoard from '../../components/Kaban/Kaban';

const Routes = () => {
  return (
    <Router>
      <Login path="/" />
      <Dashboard path="/dashboard" />
      <Projects path="/projects" />
      <KanbanBoard path="/project/:id/tasks" /> {/* Correctly set the path for KanbanBoard */}
    </Router>
  );
};

export default Routes;
