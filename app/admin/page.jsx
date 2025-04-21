"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Admin components
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTabs from "@/components/admin/AdminTabs";
import SubjectForm from "@/components/admin/SubjectForm";
import SubjectsList from "@/components/admin/SubjectsList";
import ModelForm from "@/components/admin/ModelForm";
import ModelsList from "@/components/admin/ModelsList";

export default function AdminPage() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("subjects");
  const [modelsRefreshTrigger, setModelsRefreshTrigger] = useState(0);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Check if user has admin role
        const userDoc = await getDocs(collection(db, "users"));
        const userData = userDoc.docs.find((doc) => doc.id === user.uid);

        if (userData && userData.data().role === "admin") {
          setIsAdmin(true);
          fetchSubjects();
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
        setLoading(false);
      }
    };

    const fetchSubjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "subjects"));
        const subjectsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSubjects(subjectsList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setLoading(false);
      }
    };

    checkAdmin();
  }, [user]);

  const handleSubjectAdded = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "subjects"));
      const subjectsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubjects(subjectsList);
    } catch (err) {
      console.error("Error refreshing subjects:", err);
    }
  };

  const handleModelAdded = () => {
    // Increment the trigger to cause the ModelsList to refresh
    setModelsRefreshTrigger((prev) => prev + 1);
  };

  return (
    <AdminLayout user={user} isAdmin={isAdmin} loading={loading}>
      <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "subjects" ? (
        <>
          <SubjectForm onSubjectAdded={handleSubjectAdded} />
          <SubjectsList subjects={subjects} />
        </>
      ) : (
        <>
          <ModelForm onModelAdded={handleModelAdded} />
          <ModelsList key={modelsRefreshTrigger} />
        </>
      )}
    </AdminLayout>
  );
}
