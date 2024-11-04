import React, { useEffect, useState } from "react";
import styles from "./Projects.module.scss";
import useProjects from "../../services/project.service";
import SideBar from "../../components/SideBar/SideBar";
import { db } from '../../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useHistory } from "react-router/cjs/react-router.min";

const Projects = () => {
  const history = useHistory(); // Initialize useHistory

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [priority, setPriority] = useState("");

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      name: projectName,
      description: projectDescription,
      dueDate: dueDate || "MM/DD/YYYY",
      status: "In Progress",
      progress: 0,
      priority,
    };

    console.log("Submitting project:", newProject);
    
    addDoc(collection(db, 'projects'), newProject)
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

  const fetchProjects = () => {
    getDocs(collection(db, 'projects'))
      .then((querySnapshot) => {
        const projectsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(projectsArray);
      })
      .catch((error) => {
        console.error("Error fetching projects: ", error);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);


  const handleViewTasks = (projectId) => {
    // Navigate to the Kanban board for the specific project
    history.push(`/project/${projectId}/tasks`);
  };
  return (
    <>
      <h2>Projects</h2>
      <SideBar />
      {!isFormVisible && (
        <button className={styles.button} onClick={toggleForm}>Create a new project</button>
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
              <option value="" disabled>Select priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <button type="submit">Submit</button>
          <button type="button" onClick={toggleForm}>Cancel</button>
        </form>
      )}
      <h3>Active Projects</h3>
      {!isFormVisible && (
        <div className={styles.projectsContainer}>
          {projects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <p><strong>Project Name:</strong> {project.name}</p>
              <p><strong>Due Date:</strong> {project.dueDate}</p>
              <p><strong>Status:</strong> {project.status}</p>
              <p><strong>Progress:</strong> [{`=`.repeat(project.progress / 10)}{`-`.repeat(10 - project.progress / 10)}] {project.progress}% Complete</p>
              <p><strong>Priority:</strong> {project.priority}</p>
              <button onClick={() => handleViewTasks(project.id)}>View Tasks</button>

            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Projects;
