// src/containers/Dashboard.js
import React from 'react';
import useLogin from '../../services/login.service'; // Adjust the path as needed
import SideBar from '../../components/SideBar/SideBar';
import styles from './Dashboard.module.scss';
import useProjects from '../../services/project.service';
import'../../index.css';
const Dashboard = () => {
  const { user } = useLogin(); // Use the custom hook
  const { activeProjectsCount, getProjects } = useProjects(); // Use the custom hook

  // Log the user object to check its value
  console.log(user);
  const projects = getProjects();
  console.log('Projects:', projects);
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
        <p></p> {/* Implement logic to calculate this */}
      </div>
      <div className={styles.statItem}>
        <h4>Upcoming Deadlines</h4>
        <p></p> {/* Implement logic for this */}
      </div>
    </div>
    <SideBar />   
    <h3 className={styles.header}>Notifications</h3>

    <h3 style={{ marginTop: '200px' }} className={styles.header}>Active Projects</h3>
    <h3 className={styles.header}>Upcoming Deadlines</h3>

  </>
  );
};

export default Dashboard;
