import React, { useState, useEffect } from "react";
import styles from "./Tasks.module.scss";
import {
  getProject,
  getTasks,
  addTask,
  updateTaskStatus,
  deleteTask,
} from "../../services/kaban.service";

const Task = ({
  task,
  columns,
  handleMoveTask,
  setTasks,
  tasks,
  projectId,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  useEffect(() => {
    console.log("Popup is now:", isPopupOpen ? "open" : "closed");
  }, [isPopupOpen]); // This runs whenever isPopupOpen changes

  const handleTaskClick = (taskId) => {
    if (!isPopupOpen) {
      setIsPopupOpen(true);
    }
  };
  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };
  const handelDeleteTask = (taskId) => {
    console.log("Deleting task with ID:", taskId);
    deleteTask(projectId, taskId) // Call deleteTask from service
      .then(() => {
        // Filter out the deleted task from the local tasks array
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks); // Update the state in the parent component
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  return (
    <div className={styles.taskCard}>
      <div onClick={handleTaskClick}>
        <h5 className={styles.taskTitle}>
          {task.title.charAt(0).toUpperCase() + task.title.slice(1)}
        </h5>

        <p>Due Date: {task.dueDate}</p>
        <p>
          Assigned To:
          <ul>
            {task.assignedTo.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </p>

        {isPopupOpen && (
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <p className={styles.detailsTitle}>Details:</p>{" "}
              {/* Apply the new class */}
              <p>{task.description}</p>
              <button className={styles.closeButton} onClick={handlePopupClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <p> Move To:</p>

      <select
        value={task.status}
        onChange={(e) => handleMoveTask(task.id, e.target.value)}
      >
        {Object.keys(columns).map((col) => (
          <option key={col} value={col} disabled={col === task.status}>
            {columns[col].name}
          </option>
        ))}
      </select>

      <button
        className={styles.deleteButton}
        onClick={() => handelDeleteTask(task.id)}
      >
        Delete Task
      </button>
    </div>
  );
};

export default Task;
