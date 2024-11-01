import React, { useState } from "react";
import styles from "./Projects.module.scss";
import useProjects from "../../services/project.service"; // Adjust the path as needed
import SideBar from "../../components/SideBar/SideBar";
const Projects = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [projects, setProjects] = useState([]); // Initialize projects as an empty array
  const [dueDate, setDueDate] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const { addProject, activeProjectsCount } = useProjects(); // Use the custom hook

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
      priority: priority, // Use the selected priority here
    };
    setProjects([...projects, newProject]);
    addProject(newProject);
    setIsFormVisible(false);
    setProjectName("");
    setProjectDescription("");
    setDueDate("");
    setPriority("");

  };

  return (
    <>
      <h2>Projects</h2>
      <SideBar/>
      {!isFormVisible && (
        <button className={styles.button}  onClick={toggleForm}>Create a new project</button>
      )}
      {isFormVisible && (
        <form onSubmit={handleSubmit} className={styles.projectForm}>
          <h3>Add New Project</h3>
          <div>
            <label>Project Name:</label>
            <input
              type="tex t"
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
          <button type="button" onClick={toggleForm}>
            Cancel
          </button>
        </form>
      )}
<h3>Active Projects</h3>
{!isFormVisible && (
      <div className={styles.projectsContainer}>
        {projects.map((project, index) => (
          <div key={index} className={styles.projectCard}>
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
              <strong>Progress:</strong> [{`=`.repeat(project.progress / 10)}
              {`-`.repeat(10 - project.progress / 10)}] {project.progress}%
              Complete
            </p>
            <p>
              <strong>Priority:</strong> {project.priority}
            </p>
            {/* <label>
                <input type="checkbox" onChange={handleComplete} />
                Mark as Complete
            </label> */}
            <button>View tasks</button>
          </div>
        ))}
      </div>
)}
    </>
  );
};

export default Projects;
