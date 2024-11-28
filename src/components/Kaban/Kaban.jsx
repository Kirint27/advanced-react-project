import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProject,
  getTasks,
  addTask,
  updateTaskStatus,
} from "../../services/kaban.service";
import Task from "../Tasks/Tasks";
import styles from "./Kaban.module.scss";
import useProjects from "../../services/project.service";



const KanbanBoard = (props) => {
  const { projectId } = useParams();
  const { updateProjectStatus,updateProjectStatusBasedOnTasks } = useProjects();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({});
  const [showForm, setShowForm] = useState(false);

  const columns = {
    todo: { name: "To-Do" },
    inProgress: { name: "In Progress" },
    done: { name: "Done" },
  };
  const members = project?.memberNames;

  console.log("Members:", members);
  useEffect(() => {
    getProject(projectId)
      .then((projectData) => setProject(projectData))
      .catch((error) => console.error("Error fetching project:", error));

    getTasks(projectId)
      .then((taskData) => setTasks(taskData))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [projectId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "assignedTo") {
      const selectedOptions = [...e.target.selectedOptions].map(
        (option) => option.value
      );
      setNewTask({ ...newTask, assignedTo: selectedOptions });
    } else {
      setNewTask({ ...newTask, [name]: value });
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const taskToAdd = { ...newTask, createdAt: new Date(), status:"todo" };
    addTask(projectId, taskToAdd)
      .then((docId) => {
        console.log("Task added successfully with ID:", docId);
        getTasks(projectId)
          .then((tasks) => {
            setTasks(tasks);
          })
          .catch((error) => console.error("Error fetching tasks:", error));
        setNewTask({}); // Reset task form
        setShowForm(false);
      })
      .catch((error) => console.error("Error adding task:", error));
  };
  const handleCancel = () => {
    setShowForm(false); // add this line
  };
const handleMoveTask = (taskId, newStatus) => {
  updateTaskStatus(projectId, taskId, newStatus)
    .then(() => {
      // Update local tasks state with the new task status
      const newTasks = tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, status: newStatus };
        }
        return task;
      });

      setTasks(newTasks);
      // After task status change, update project status
      updateProjectStatusBasedOnTasks();
    })
    .catch((error) => console.error("Error updating task status:", error));
};





return(

    <div className={styles.kanbanBoard}>
      {project ? (
        <>
          <div className={styles.kanbanHeader}>
            <h3 className={styles.kanbanTitle}>{project.name}</h3>
          </div>
          <a onClick={() => navigate("/projects")} className={styles.backLink}>
            ← Back to Projects
          </a>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
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
              <div className={styles.inputGroup}>
                <label>Assigned to:</label>
                <select
                  multiple
                  name="assignedTo"
                  onChange={handleInputChange}
                  className={styles.assignedTo}
                  required
                >
                  {members.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit">Add Task</button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
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
