// src/components/Task.js
import React from 'react';
import styles from './Tasks.module.scss';

const Task = ({ task, columns, handleMoveTask }) => {
  return (
    <div className={styles.taskCard}>
      <h5 className={styles.taskTitle}>{task.title}</h5>
      <p>Details: {task.description}</p>
      <p>Due Date: {task.dueDate}</p>
      <p> Move To: {task.assignedTo}</p>

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
    </div>
  ); 
};

export default Task;
