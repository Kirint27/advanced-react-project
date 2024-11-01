import React from "react";
import styles from "./SideBar.module.scss";
import useLogin from '../../services/login.service'; // Adjust the path as needed

const SideBar = () => {

  const { user } = useLogin();
  return (
<div className={styles.sidebar}> 
<h2>{user ? user.displayName || user.email : 'Guest'}</h2>
<ul>
<li><a href="/dashboard">Dashboard</a></li>
<li ><a href="/projects">Projects</a></li>
<li><a href="/calendar">Calendar</a></li>



<li className={styles.signOut}><a href="/">Sign out</a></li>

</ul>
    </div>
  );
};

export default SideBar;
