import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const fetchUserData = async (userId) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  return userDoc.exists() ? userDoc.data() : null;
};

export const fetchSubjects = async () => {
  const subjectsSnapshot = await getDocs(collection(db, "subjects"));
  return subjectsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const fetchModels = async () => {
  const modelsSnapshot = await getDocs(collection(db, "models"));
  return modelsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const fetchModelsBySubject = async (subjectId) => {
  const allModels = await fetchModels();
  return allModels.filter((model) => model.subjectId === subjectId);
};

export const saveUserData = async (userId, userData) => {
  await setDoc(doc(db, "users", userId), userData, { merge: true });
};
