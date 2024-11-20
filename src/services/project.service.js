import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const useProjects = () => {
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [projects, setProjects] = useState([]); // State for storing projects
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Fetch projects for the logged-in user
  const fetchProjects = () => {
    const currentUser = auth.currentUser
    if (!currentUser) {
      console.error("No user is authenticated");
      setIsLoading(false); // Set loading to false if no user is authenticated
      return Promise.resolve([]); // Return an empty array if no user
    }
    const q = query(
      collection(db, "projects"),
      where("userId", "==", currentUser.uid)
    );
    return getDocs(q)
      .then((querySnapshot) => {
        const projectsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Set projects state and stop loading
        setProjects(projectsArray);
        setIsLoading(false);
        return projectsArray; // Return the projects array
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setIsLoading(false);
        return []; // Return an empty array in case of an error
      });
  };

  useEffect(() => {
    fetchProjects(); // Call fetch on initial load
  }, []); // Empty dependency array to run only once on mount

  // Update the active projects count
  const updateProjectCount = () => {
    setActiveProjectsCount(projects.length);
  };

  useEffect(() => {
    updateProjectCount(); // Update the project count when the projects list changes
  }, [projects]); // Runs whenever the projects array changes

  // Add a new project
  const addProject = (project) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const newProject = { ...project, userId: currentUser.uid };
      setProjects((prevProjects) => [...prevProjects, newProject]); // Add new project to state
    } else {
      console.error("No user is logged in. Project cannot be added.");
    }
  };

  // Delete a project
  const deleteProject = (projectId) => {
    const warningMessage =
      "Are you sure you want to delete this project? All tasks and data associated with this project will be permanently deleted.";
    if (window.confirm(warningMessage)) {
      deleteDoc(doc(db, "projects", projectId))
        .then(() => {
          console.log("Project deleted successfully with ID:", projectId);
          // Instead of refetching, filter out the deleted project from the state
          setProjects((prevProjects) =>
            prevProjects.filter((project) => project.id !== projectId)
          );
        })
        .catch((error) => {
          console.error("Error deleting project: ", error);
        });
    }
  };

  return {
    addProject,
    activeProjectsCount,
    projects, // Return the projects state
    isLoading,
    deleteProject,
    fetchProjects, // Provide the fetchProjects function if needed elsewhere
  };
};

export default useProjects;
