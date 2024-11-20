import React, { useEffect, useState } from "react";
import styles from "./Projects.module.scss";
import useProjects from "../../services/project.service";
import SideBar from "../../components/SideBar/SideBar";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { db } from "../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { auth } from '../../firebase';
const Projects = () => {
  const { deleteProject, fetchProjects,user } = useProjects();
  const navigate = useNavigate(); // Initialize navigate

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = auth.currentUser;  // Get the current logged-in user

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  useEffect(() => {
    fetchProjects().then((projectsData) => {
      setProjects(projectsData);
      setIsLoading(false);
    });
  }, [currentUser, fetchProjects]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      name: projectName,
      description: projectDescription,
      dueDate: dueDate || "MM/DD/YYYY",

      priority,
  userId: currentUser && currentUser.uid,

    };
    addDoc(collection(db, "projects"), newProject)
      .then((docRef) => {
        console.log("Project added successfully with ID:", docRef.id);
        setIsFormVisible(false);
        setProjectName("");
        setProjectDescription("");
        setDueDate("");
        setPriority("");
        fetchProjects(); // Refresh project list
      })
      .catch((error) => {
        console.error("Error adding project: ", error);
      });
  };

  const handleViewTasks = (projectId) => {
    // Navigate to the project tasks page using react-router-dom's navigate function
    navigate(`/project/${projectId}/tasks`);
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
          <button type="submit">Submit</button>
          <button type="button" onClick={toggleForm}>
            Cancel
          </button>
        </form>
      )}

      <h3 className={styles.activeProjects}>Active Projects</h3>

      {/* Projects list */}


      {/* Show the list of projects */}
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
            <strong>Status:</strong> {project.status}
          </p>
          <p>
            <strong>Priority:</strong> {project.priority}
          </p>
          <p>
          </p>
          <div className={styles.buttonContainer}>
            <button
              className={styles.viewTasks}
              onClick={() => handleViewTasks(project.id)} // Use navigate to view tasks
            >
              View Tasks
            </button>
            <button
              className={styles.deleteButton}
              onClick={() => deleteProject(project.id)} // Deleting a project
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
