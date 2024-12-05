import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  deleteDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";

export const getProject = (id) => {
  const projectDocRef = doc(db, "projects", id); // Reference to the specific project
  return getDoc(projectDocRef)
    .then((projectDocSnap) => {
      if (projectDocSnap.exists()) {
        return { id: projectDocSnap.id, ...projectDocSnap.data() };
      } else {
        return Promise.reject("Project not found");
      }
    })
    .catch((error) => {
      return Promise.reject(`Error fetching project: ${error.message}`);
    });
};

export const getTasks = (id) => {
  const tasksCollectionRef = collection(db, "projects", id, "tasks");
  return getDocs(tasksCollectionRef)
    .then((querySnapshot) => {
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    })
    .catch((error) => {
      return Promise.reject(`Error getting tasks: ${error.message}`);
    });
};

export const addTask = (projectId, taskToAdd) => {
  const tasksCollectionRef = collection(db, "projects", projectId, "tasks");

  return addDoc(tasksCollectionRef, taskToAdd) // Pass taskData as the second argument
    .then((docRef) => {
      return docRef.id; // Return the ID of the newly added task
    })
    .catch((error) => {
      return Promise.reject(`Error adding task: ${error.message}`);
    });
};

export const deleteTask = (projectId, taskId) => {
  if (!projectId || !taskId) {
    console.error("Invalid projectId or taskId");
    return Promise.reject("Invalid projectId or taskId");
  }

  const taskRef = doc(db, "projects", projectId, "tasks", taskId);

  // First, check if the document exists
  return getDoc(taskRef)
    .then((docSnap) => {
      if (!docSnap.exists()) {
        // If the document doesn't exist, reject with an appropriate message
        console.error("Task not found");
        return Promise.reject("Task not found");
      }

      // If the document exists, proceed to delete it
      return deleteDoc(taskRef);
    })
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.error("Error deleting task:", error);
      throw error; // Re-throw the error to be caught in the calling function
    });
};
export const updateCompletedProjectsCount = () => {
  return getTasks()
    .then((allTasks) => {
      const completedProjectsCount = {};
      allTasks.forEach((task) => {
        if (task.status === "done") {
          if (!completedProjectsCount[task.projectId]) {
            completedProjectsCount[task.projectId] = 1;
          } else {
            completedProjectsCount[task.projectId]++;
          }
        }
      });
      return completedProjectsCount;
    })
    .catch((error) =>
      console.error("Error updating completed projects count:", error)
    );
};

export const updateTaskStatus = (projectId, taskId, newStatus) => {
  const taskRef = doc(collection(db, "projects", projectId, "tasks"), taskId);
  return updateDoc(taskRef, { status: newStatus })
    .then(() => {
      console.log("Task status updated successfully");
    })
    .catch((error) => {
      console.error("Error updating task status:", error);
    });
};
