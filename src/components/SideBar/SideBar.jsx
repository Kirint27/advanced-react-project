import React from "react";
import styles from "./SideBar.module.scss";
import useLogin from '../../services/login.service'; // Adjust the path as needed
import { getAuth, signOut } from "firebase/auth"; // Import Firebase signOut and getAuth

const SideBar = ({handleLogout}) => {

  const { user,signOut } = useLogin();

  return (
<div className={styles.sidebar}> 
<h2>{user ? user.displayName || user.email : 'Guest'}</h2>
<ul>
<li><a href="/dashboard">Dashboard</a></li>
<li ><a href="/projects">Projects</a></li>
<li><a href="/calendar">Calendar</a></li>



<li className={styles.signOut}>
<a href="/" onClick={handleLogout}>Sign Out</a>        </li>

</ul>
    </div>
  );
};

export default SideBar;
