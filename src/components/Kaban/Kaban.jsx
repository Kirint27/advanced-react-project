import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Use react-router-dom hooks
import { getProject, getTasks, addTask } from "../../services/kaban.service";
import Task from "../Tasks/Tasks"; // Import Task component
import styles from "./Kaban.module.scss";

const KanbanBoard = () => {
  const { projectId } = useParams(); // Get the project ID from the URL
  const [project, setProject] = useState(null); // State for project data
  const [tasks, setTasks] = useState([]);
  const [endDate, setEndDate] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "", // Ensure status is initialized correctly
  });
  const [showForm, setShowForm] = useState(false);
  const columns = {
    todo: { name: "To-Do" },
    inProgress: { name: "In Progress" },
    done: { name: "Done" },
  };

  const navigate = useNavigate(); // Use useNavigate for programmatic navigation

  useEffect(() => {
    console.log("Project ID:", projectId); // Check if the ID changes when navigating
    // Fetch project and tasks based on projectId
    getProject(projectId)
      .then((projectData) => {
        setProject(projectData);
      })
      .catch((error) => {
        console.error("Error fetching project:", error);
      });

    getTasks(projectId)
      .then((taskData) => {
        setTasks(taskData);
        console.log("Tasks:", taskData);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, [projectId]); // Ensure it runs whenever the `projectId` changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const taskToAdd = {
      title: newTask.title || "",
      description: newTask.description || "",
      status: newTask.status || "todo",
      createdAt: new Date(),
      dueDate: endDate || "",
      assignedTo: newTask.assignedTo || "",
    };
    addTask(projectId, taskToAdd)
      .then((docId) => {
        console.log("Task added successfully with ID:", docId);
        setNewTask({}); // Reset task form
        setShowForm(false);
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  };

  const handleMoveTask = (taskId, newStatus) => {
    const newTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, status: newStatus };
      }
      return task;
    });

    setTasks(newTasks);
  };

  const allTasksCompleted = () => {
    const completedTasks = tasks.filter((task) => task.status === "done");
    return completedTasks.length === tasks.length && completedTasks.length > 0;
  };

  const goBack = () => {
    navigate("/projects"); // Use navigate to programmatically go back
  };

  return (
    <div className={styles.kanbanBoard}>
      {project ? (
        <>
          <div className={styles.kanbanHeader}>
            <h3 className={styles.kanbanTitle}>{project.name}</h3>
          </div>
          <a onClick={goBack} className={styles.backLink}>
            ← Back to Projects
          </a>
          {!showForm && (
            <button
              onClick={toggleFormVisibility}
              className={styles.toggleButton}
            >
              Add New Task
            </button>
          )}
          {showForm && (
            <form onSubmit={handleAddTask} className={styles.taskForm}>
              <h4>Add New Task</h4>
              <div>
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  className={styles.label}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label>Description:</label>
                <textarea
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  className={styles.description}
                  required
                />
              </div>
              <div>
                <label>Due Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <button type="submit">Add Task</button>
              <button
                type="button"
                onClick={toggleFormVisibility}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </form>
          )}

          <div className={styles.kanbanColumns}>
            {Object.keys(columns).map((column) => (
              <div key={column} className={styles.kanbanColumn}>
                <h4 className={styles.columnTitle}>{columns[column].name}</h4>
                {tasks.filter((task) => task.status === column).length === 0 ? (
                  <p className={styles.emptyMessage}>
                    No tasks in {columns[column].name}
                  </p>
                ) : (
                  tasks
                    .filter((task) => task.status === column)
                    .map((task) => (
                      <Task
                        key={task.id} // Use Task component
                        task={task}
                        columns={columns}
                        handleMoveTask={handleMoveTask}
                      />
                    ))
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Loading project...</p>
      )}
    </div>
  );
};

export default KanbanBoard;
