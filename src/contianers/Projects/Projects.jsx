import React, { useEffect, useState } from "react";
import styles from "./Projects.module.scss";
import useProjects from "../../services/project.service";
import SideBar from "../../components/SideBar/SideBar";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { db } from "../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { auth } from '../../firebase';

const Projects = () => {
  const { deleteProject, fetchProjects, user, updateProjectStatus } = useProjects();
  const navigate = useNavigate(); // Initialize navigate

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
const[selectedUserNames, setSelectedUserNames] = useState('');
  const currentUser = auth.currentUser;  // Get the current logged-in user

  // Toggle form visibility
  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  // Fetch projects only when the component mounts (and when the user changes)
  useEffect(() => {
    if (currentUser) {
      fetchProjects().then((projectsData) => {
        setProjects(projectsData);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false); // No user, stop loading
    }
  }, [currentUser]); // Only run once when component mounts or when user changes

  // Handle form submission (adding new project)
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const memberNames = selectedUserNames.split(",");
  
    const newProject = {
      name: projectName,
      description: projectDescription,
      dueDate: dueDate || "MM/DD/YYYY",
      status: "Not Started", // Default to "Not Started"
      priority,
      userId: currentUser && currentUser.uid,
      memberNames: memberNames.map((name) => name.trim()),
    };
  
    addDoc(collection(db, "projects"), newProject)
      .then((docRef) => {
        console.log("Project added successfully with ID:", docRef.id);
  
        // Directly update the local state to avoid refetching from Firestore
        setProjects((prevProjects) => [
          ...prevProjects,
          { id: docRef.id, ...newProject },
        ]);
  
        setIsFormVisible(false);
        setProjectName("");
        setProjectDescription("");
        setDueDate("");
        setPriority("");
        setSelectedUserNames("");
      })
      .catch((error) => {
        console.error("Error adding project: ", error);
      });
  };

  // Handle viewing tasks (navigate to the project's tasks page)
  const handleViewTasks = (projectId) => {
    navigate(`/project/${projectId}/tasks`);
  };

  // Delete project (update the local state instead of refetching)
  const handleDeleteProject = (projectId) => {
    deleteProject(projectId)
      .then(() => {
        // Directly remove the project from the state to reflect the deletion
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== projectId)
        );
      })
      .catch((error) => {
        console.error("Error deleting project: ", error);
      });
  };

  return (
    <div className={styles.projects}>
      <h2>Projects</h2>

      <SideBar />
      {!isFormVisible && (
        <button className={styles.button} onClick={toggleForm}>
          Create a new project
        </button>
      )}

      {isFormVisible && (
        <form onSubmit={handleSubmit} className={styles.projectForm}>
          <h3>Add New Project</h3>
          <div>
            <label>Project Name:</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Project Description:</label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Due Date:</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div>
            <label>Priority Level:</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <option value="" disabled>
                Select priority
              </option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label>Project Members:</label>
            <input
              type="text"
              value={selectedUserNames}
              onChange={(e) => selectedUserNames(e.target.value)}
              placeholder="Add the names of project members separated by commas"
            />
          </div>
          <button type="submit">Submit</button>
          <button type="button" onClick={toggleForm}>
            Cancel
          </button>
        </form>
      )}

      <h3 className={styles.activeProjects}>Active Projects</h3>

      {!isFormVisible && (
        isLoading ? (
          <div>Loading projects...</div>
        ) : (
          <div className={styles.projectsContainer}>
            {projects.map((project) => (
              <div key={project.id} className={styles.projectCard}>
                <p>
                  <strong>Project Name:</strong> {project.name}
                </p>
                <p>
                  <strong>Due Date:</strong> {project.dueDate}
                </p>
                <p>
                  <strong>Status:</strong> {project?.status}
                </p>
                <p>
                  <strong>Priority:</strong> {project.priority}
                </p>
                <div className={styles.buttonContainer}>
                  <button
                    className={styles.viewTasks}
                    onClick={() => handleViewTasks(project.id)}
                  >
                    View Tasks
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    Delete Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Projects;
