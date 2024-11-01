import React from "react";
import { Router } from "@reach/router"; // Import Router from @reach/router
import Login from "../Login/Login";
import Dashboard from "../Dashboard";
import Projects from '../Projects'
const Routes = () => {

  return (
    <Router>
    <Login path="/"  />
  <Dashboard path="/dashboard" />
    <Projects path="/projects" />
  </Router>
  
  );
};

export default Routes;
