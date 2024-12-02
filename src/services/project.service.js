import { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Import the initialized Firestore instance
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore"; // Correct imports from Firebase v9 modular SDK
import { getTasks } from "./kaban.service"; // Assuming this is your task service

const useProjects = () => {
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completedProjectsCount, setCompletedProjectsCount] = useState(0);

  // Fetch projects for the logged-in user
  const fetchProjects = () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("No user is authenticated");
      setIsLoading(false);
      return Promise.resolve([]);
    }

    // Create query for projects where the user is either the owner or a member
    const q1 = query(
      collection(db, "projects"),
      where("userId", "==", currentUser.uid)
    );
    const q2 = query(
      collection(db, "projects"),
      where("memberNames", "array-contains", currentUser.displayName)
    );

    return Promise.all([getDocs(q1), getDocs(q2)])
      .then(([querySnapshot1, querySnapshot2]) => {
        const projectsArray = querySnapshot1.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .concat(
            querySnapshot2.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );

        setProjects(projectsArray);
        setIsLoading(false);
        return projectsArray;
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setIsLoading(false);
        return [];
      });
  };

  const updateProjectStatusBasedOnTasks = (projectId, updateProjectStatus) => {
    getTasks(projectId)
      .then((tasks) => {
        const projectStatus =
          tasks.length === 0
            ? "Not Started"
            : tasks.every((task) => task.status === "done")
            ? "Completed"
            : "In Progress";

        // Update project status if necessary
        updateProjectStatus(projectId, projectStatus);
      })
      .catch((error) => {
        console.error("Error updating project status:", error);
      });
  };
  const deleteProject = (projectId) => {
    const warningMessage =
      "Are you sure you want to delete this project? All tasks and data associated with this project will be permanently deleted.";
  
    // Show a confirmation dialog
    if (window.confirm(warningMessage)) {
      const projectRef = doc(db, "projects", projectId); // Correct way to get a reference to a document
  
      // Using deleteDoc from the modular API to delete the document
      return deleteDoc(projectRef)
        .then(() => {
          // Deletion successful, update the local state to reflect the deletion
          return true;
        })
        .catch((error) => {
          console.error("Error deleting project: ", error);
          return false;
        });
    }
  
    // If user cancels, return a resolved promise to prevent further action
    return Promise.resolve(false);
  };

  const updateCompletedProjectsCount = () => {
    const completedCount = projects.filter(
      (project) => project.status.trim() === "Completed"
    ).length;

    setCompletedProjectsCount(completedCount);
  };

  const updateProjectCount = () => {
    const activeCount = projects.filter(
      (project) => project.status.trim() !== "Completed"
    ).length;
    setActiveProjectsCount(activeCount);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    updateProjectCount();
    updateCompletedProjectsCount();
  }, [projects]);

  return {
    activeProjectsCount,
    projects,
    isLoading,
    completedProjectsCount,
    updateProjectStatusBasedOnTasks,
    fetchProjects,
    deleteProject,
  };
};

export default useProjects;
