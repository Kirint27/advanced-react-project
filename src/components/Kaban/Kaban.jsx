import React, { useEffect, useState } from "react";
import { useParams } from "@reach/router"; // Use this for routing
import { db } from '../../firebase'; // Your Firestore configuration
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions

const KanbanBoard = () => {
  const { id } = useParams(); // Get the project ID from URL
  const [project, setProject] = useState(null); // State for project data

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, 'projects', id); // Reference to the specific project
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() }); // Set project state
        } else {
          console.log("No such project!");
        }
      } catch (error) {
        console.error("Error fetching project: ", error);
      }
    };

    fetchProject(); // Fetch project when component mounts
  }, [id]);

  return (
    <div>
      {project ? <h3>{project.name} - Kanban Board</h3> : <p>Loading...</p>}
    </div>
  );
};

export default KanbanBoard;
