import React, { useEffect, useState } from "react";
import styles from "./Projects.module.scss";
import useProjects from "../../services/project.service";
import SideBar from "../../components/SideBar/SideBar";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { db } from "../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { auth } from "../../firebase";
import { getTasks, updateProjectStatus } from "../../services/kaban.service"; // Assuming you have a getTasks function

const Projects = () => {
  const { deleteProject, fetchProjects, user, updateProjectStatus, updateProjectStatusBasedOnTasks } =
    useProjects();
  const navigate = useNavigate(); // Initialize navigate
  const [userSearch, setUserSearch] = useState(""); // State for the user's input in autocomplete
  const [users, setUsers] = useState([]); // State for storing all users in Firestore

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserNames, setSelectedUserNames] = useState("");
  const currentUser = auth.currentUser; // Get the current logged-in user

  // Toggle form visibility
  const toggleForm = ({ tasks }) => {
    setIsFormVisible(!isFormVisible);
    setUserSearch(""); // Reset the user search input
  setSelectedUsers([]); // Also reset the selected users
  setSelectedUserNames(""); // And reset the selected user names
  };

  // Fetch projects only when the component mounts (and when the user changes)
  useEffect(() => {
    if (currentUser) {
      fetchProjects().then((projectsData) => {
        setProjects(projectsData);
        setIsLoading(false);
        projectsData.forEach((project) => {
          updateProjectStatusBasedOnTasks(project.id);
        });
      });
    } else {
      setIsLoading(false); // No user, stop loading
    }
  }, [currentUser]); // Only run once when component mounts or when user changes


 useEffect(() => {
  const fetchUsers = () => {
    getDocs(collection(db, "users"))
      .then((usersSnapshot) => {
        const usersList = usersSnapshot.docs.map((doc) => doc.data());
        setUsers(usersList);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };
  fetchUsers();
}, []);
  // Handle form submission (adding new project)

const handleUserSearch = (e) => {
  setUserSearch(e.target.value);
};



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
      memberNames: selectedUsers.map((user) => user.displayName), // Use selectedUsers state
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
        setSelectedUsers([]);
        setUserSearch(""); // Also reset the user search input
      })
      .catch((error) => {
        console.error("Error adding project: ", error);
      });
  };

  console.log(selectedUserNames);

  const filteredUsers = users.filter(user => 
    user.displayName.toLowerCase().includes(userSearch.toLowerCase())
  );

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

  console.log(projects);
  
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
            value={userSearch}
            onChange={handleUserSearch}
            placeholder="Search users"
          />
   {userSearch && (
            <div className={styles.autocompleteResults}>
           {filteredUsers.map((user) => (
  <div
    key={user.uid}
    className={styles.autocompleteItem}
    onClick={() => {
      if (!selectedUsers.some(user => selectedUsers.uid === user.uid)) {

      setSelectedUsers((prevUsers) => [...prevUsers, user]);
      setSelectedUserNames((prevNames) => `${prevNames}, ${user.displayName}`);
      
      }
    }}
  >
    {user.displayName}
  </div>
))}
              
             
      
            </div>
          )}
          </div>
          <button type="submit">Submit</button>
          <button type="button" onClick={toggleForm}>
            Cancel
          </button>
        </form>
      )}

      <h3 className={styles.activeProjects}>Active Projects</h3>

      {!isFormVisible &&
        (isLoading ? (
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
                <p>
                <strong>Members:</strong> {project.memberNames.join(', ')}
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
        ))}
    </div>
  );
};

export default Projects;
