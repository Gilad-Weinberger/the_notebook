"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Create the AuthContext
const AuthContext = createContext();

// Create a hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create the AuthProvider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  async function signup(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });

      // No longer creating user document in Firestore - will be done in details form

      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  // Google sign-in function
  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      // No longer creating user document in Firestore - will be done in details form

      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  // Login function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout function
  function logout() {
    return signOut(auth);
  }

  // Reset password
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Update user profile
  async function updateUserProfile(displayName) {
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user, { displayName });
      // Update user document in Firestore
      await setDoc(
        doc(db, "users", user.uid),
        { displayName },
        { merge: true }
      );
    }
  }

  // Update user email
  async function updateUserEmail(email) {
    const user = auth.currentUser;
    if (user) {
      await updateEmail(user, email);
      // Update user document in Firestore
      await setDoc(doc(db, "users", user.uid), { email }, { merge: true });
    }
  }

  // Update user password
  function updateUserPassword(newPassword) {
    const user = auth.currentUser;
    if (user) {
      return updatePassword(user, newPassword);
    }
  }

  // Get user data from Firestore
  async function getUserData() {
    if (!user) return null;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Context value
  const value = {
    user,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    getUserData,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
