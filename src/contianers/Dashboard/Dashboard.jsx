// src/containers/Dashboard.js
import React, { useState, useEffect} from 'react';
import useLogin from '../../services/login.service'; // Adjust the path as needed
import SideBar from '../../components/SideBar/SideBar';
import { useParams, useNavigate } from "react-router-dom";

import styles from './Dashboard.module.scss';
import useProjects from '../../services/project.service';
import'../../index.css';
import { useLocation } from '@reach/router'; // Import useLocation from Reach Router
import { updateCompletedProjectsCount } from '../../components/Kaban/Kaban';
const Dashboard = ({Complete }) => {
  const { user } = useLogin()
  const { completedProjectsCount, isLoading } = useProjects();
console.log("completedProjectsCount:", completedProjectsCount);
  const { projectId } = useParams();
   // Use the custom hook
  const { activeProjectsCount,projects } = useProjects(); // Corrected variable name
  console.log("Active Projects Count:", activeProjectsCount);
  const [tasks, setTasks] = useState([]);

  // useEffect(() => {
  //   updateCompletedProjectsCount().then((completedProjectsCount) => {
  //     console.log('received completedProjectsCount:', completedProjectsCount);
  //     setCompletedProjectsCount(completedProjectsCount);
  //   });
  // }, []);
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  const assignedTasks = tasks.filter(
    (task) => 
      task.assignedTo.includes(user?.displayName || user?.email) && task.status !== 'completed'
  );

  // Notifications based on tasks assigned to the user and not completed
  const notifications = assignedTasks.map((task) => ({
    const timeDiff = dueDate - today;

    title: `Task Assigned: ${task.title}`,
    message: `You are part of the team responsible for this task, that is not completed yet.`,
    dueDate: `Due Date: ${task.dueDate}`,
    taskId: task.id,
  }));
  
 const today = new Date(); // Current date
  const nextWeek = new Date(today); // Create a new Date object for next week
  nextWeek.setDate(today.getDate() + 7);



  // Split YYYY-MM-DD into parts
const upcomingDeadlines = projects.filter((project) => {
  const projectDueDate = new Date(project.dueDate);
  return projectDueDate > today && projectDueDate < nextWeek;

})
.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
const formattedDueDate = (dueDate) => {
  const [year, month, day] = dueDate.split('-');
  return `${day}/${month}/${year}`;
}

console.log(notifications);


  return (
    <>
    <h2 >Welcome, {user ? user.displayName || user.email : 'Guest'}!</h2>
    <h3 className={styles.header}>Quick Stats</h3>       
    <div className={styles.quickStats}>
      <div className={styles.statItem}>
        <h4>Active Projects</h4>
        <p>{activeProjectsCount}</p>
      </div>
      <div className={styles.statItem}>
        <h4>Completed Projects</h4>
        <p>{completedProjectsCount}</p> {/* Implement logic to calculate this */}
      </div>
      <div className={styles.statItem}>       
        <h4>Upcoming Deadlines</h4>
      <ul>  
      {upcomingDeadlines.length > 0 ? (
   
            upcomingDeadlines.map((project) => (
              <li key={project.id}>
                {project.name} - Due: {project.dueDate}
              </li>
            ))
             ) : (
               <li>No projects with upcoming deadlines in the next 7 days.</li>
             )}
        </ul>
      </div>
    </div>
    <SideBar />   
    <h3 className={styles.header}>Notifications</h3>
    <ul className={styles.notificationsContainer}>
  {notifications.length > 0 ? (
    notifications.map((notification, index) => (
      <li key={index} className={styles.notificationItem}>
        <strong>{notification.title}</strong>
        <p>{notification.message}</p>
        <p>{notification.dueDate}</p>

      </li>
    ))
  ) : (
    <li className="no-notifications">No notifications.</li>
  )}
</ul>

  </>
  );
};

export default Dashboard;
