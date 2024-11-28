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
const Dashboard = ({tasks,completed }) => {
  const { user } = useLogin()
  const { completedProjectsCount, isLoading } = useProjects();
console.log("completedProjectsCount:", completedProjectsCount);
  const { projectId } = useParams();
   // Use the custom hook
  const { activeProjectsCount,projects } = useProjects(); // Corrected variable name
  console.log("Active Projects Count:", activeProjectsCount);
  const notifications = [];
  // useEffect(() => {
  //   updateCompletedProjectsCount().then((completedProjectsCount) => {
  //     console.log('received completedProjectsCount:', completedProjectsCount);
  //     setCompletedProjectsCount(completedProjectsCount);
  //   });
  // }, []);

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
    <ul>
        {notifications.map((notification) => (
          <li key={notification.title}>
            {notification.title} - {notification.message}
          </li>
        ))}
      </ul>

  </>
  );
};

export default Dashboard;
