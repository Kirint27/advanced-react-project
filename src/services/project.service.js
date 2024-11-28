import { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getTasks } from "./kaban.service";
const useProjects = () => {
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [projects, setProjects] = useState([]); // State for storing projects
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [completedProjectsCount, setCompletedProjectsCount] = useState(0); // Track completed projects count

  // Fetch projects for the logged-in user
  const fetchProjects = () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("No user is authenticated");
      setIsLoading(false); // Set loading to false if no user is authenticated
      return Promise.resolve([]); // Return an empty array if no user
    }

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


  const updateProjectStatusBasedOnTasks = (projectId,updateProjectStatus) => {
    getTasks(projectId)  // Call getTasks with the specific projectId
      .then((tasks) => {
        // If there are no tasks, set the status to "Not Started"
        const projectStatus = tasks.length === 0
          ? "Not Started"  // Explicitly set to "Not Started" if there are no tasks
          : tasks.every((task) => task.status === "done")
          ? "Completed"  // If all tasks are completed, set status to "Completed"
          : "In Progress";  // If there are tasks and not all are done, set status to "In Progress"
    
        // Update the project status only if it has changed
        updateProjectStatus(projectId, projectStatus); // Update status in Firestore
      })
      .catch((error) => {
        console.error("Error updating project status:", error);
      });
  };


  // Update the count of completed projects
  const updateCompletedProjectsCount = () => {
    // Count how many projects have 'Completed' status
    const completedCount = projects.filter(
      (project) => project.status.trim() === "Completed"
    ).length;

    // Update the state with the new count
    setCompletedProjectsCount(completedCount);
  };

  // Update active projects count
  const updateProjectCount = () => {
    setActiveProjectsCount(projects.length);
  };

  // Fetch projects and update the counts on mount
  useEffect(() => {
    fetchProjects(); // Fetch projects when component mounts
  }, []); // Empty dependency array ensures it runs once on mount

  useEffect(() => {
    updateProjectCount(); // Update active project count
    updateCompletedProjectsCount(); // Update completed projects count
  }, [projects]); // Runs whenever the projects array changes

  return {
    activeProjectsCount,
    projects,
    isLoading,
    completedProjectsCount,
    updateProjectStatusBasedOnTasks,
    fetchProjects,
  };
};

export default useProjects;
