import { db } from "../firebase";
import { collection, doc, getDocs, getDoc, addDoc } from "firebase/firestore";

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

export const addTask = (id, task) => {
  const tasksCollectionRef = collection(db, "projects", id, "tasks");
  return addDoc(tasksCollectionRef, task)
    .then((docRef) => {
      return docRef.id; // Return the ID of the newly added task
    })
    .catch((error) => {
      return Promise.reject(`Error adding task: ${error.message}`);
    });
};
