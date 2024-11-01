import { useState, useEffect } from 'react';

// Simulated service file
let projects = []; // Local state to hold projects

const useProjects = () => {
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);

  // Function to add a project
  const addProject = (project) => {
    projects.push(project);
    updateProjectCount(); // Update the count when a project is added
  };

  // Function to get the active project count
  const updateProjectCount = () => {
    setActiveProjectsCount(projects.length);
    console.log('Updated Active Projects Count:', projects.length); // Log the count
  };

  // Initial count update on mount
  useEffect(() => {
    updateProjectCount();
  }, []);

  console.log('Projects:', projects); // Log the projects array

  return {
    addProject,
    activeProjectsCount,
    getProjects: () => projects,
  };
};

export default useProjects;
