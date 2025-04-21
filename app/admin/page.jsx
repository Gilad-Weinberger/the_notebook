"use client";

import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IoCalculatorOutline } from "react-icons/io5";
import { IoMdSchool } from "react-icons/io";
import { FaFlask } from "react-icons/fa";
import { MdHistory } from "react-icons/md";

export default function AdminPage() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [iconIndex, setIconIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Available icons for subjects
  const icons = [
    { icon: IoCalculatorOutline, name: "מתמטיקה" },
    { icon: IoMdSchool, name: "אנגלית" },
    { icon: FaFlask, name: "פיזיקה" },
    { icon: MdHistory, name: "היסטוריה" },
  ];

  // Available levels
  const levels = ["3 יחידות", "4 יחידות", "5 יחידות"];

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

  const handleLevelToggle = (level) => {
    if (selectedLevels.includes(level)) {
      setSelectedLevels(selectedLevels.filter((l) => l !== level));
    } else {
      setSelectedLevels([...selectedLevels, level]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    // Validate inputs
    if (!name.trim()) {
      setFormError("שם הנושא הוא שדה חובה");
      return;
    }

    setSubmitting(true);

    try {
      // Create the subject document
      const subjectData = {
        name: name.trim(),
        description: description.trim(),
        levels: selectedLevels,
        iconIndex: iconIndex,
        createdAt: new Date().toISOString(),
      };

      // Add to Firestore
      await addDoc(collection(db, "subjects"), subjectData);

      // Reset form
      setName("");
      setDescription("");
      setSelectedLevels([]);
      setIconIndex(0);
      setFormSuccess("הנושא נוצר בהצלחה!");

      // Refresh subjects list
      const querySnapshot = await getDocs(collection(db, "subjects"));
      const subjectsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubjects(subjectsList);
    } catch (error) {
      console.error("Error creating subject:", error);
      setFormError("אירעה שגיאה ביצירת הנושא. אנא נסה שוב מאוחר יותר.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto p-4">
          <p className="text-center">טוען...</p>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-700">אנא התחבר כדי לגשת לעמוד זה.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!isAdmin) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-red-50 border-r-4 border-red-400 p-4 mb-4">
            <p className="text-red-700">אין לך הרשאות לצפות בעמוד זה.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">ניהול מערכת</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">יצירת נושא חדש</h2>

          {formError && (
            <div className="bg-red-50 border-r-4 border-red-400 p-3 mb-4">
              <p className="text-red-700">{formError}</p>
            </div>
          )}

          {formSuccess && (
            <div className="bg-green-50 border-r-4 border-green-400 p-3 mb-4">
              <p className="text-green-700">{formSuccess}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                שם הנושא <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="לדוגמה: מתמטיקה"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-2"
              >
                תיאור הנושא
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="תיאור קצר של הנושא..."
                rows="4"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                רמות לימוד
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {levels.map((level) => (
                  <div key={level} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`level-${level}`}
                      checked={selectedLevels.includes(level)}
                      onChange={() => handleLevelToggle(level)}
                      className="ml-2"
                    />
                    <label htmlFor={`level-${level}`} className="text-gray-700">
                      {level}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                אייקון לנושא
              </label>
              <div className="grid grid-cols-4 gap-4">
                {icons.map((iconObj, index) => {
                  const Icon = iconObj.icon;
                  return (
                    <div
                      key={index}
                      onClick={() => setIconIndex(index)}
                      className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer transition-all ${
                        iconIndex === index
                          ? "bg-blue-100 border-blue-500"
                          : "border-gray-300 hover:border-blue-300"
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-2" />
                      <span className="text-sm text-center">
                        {iconObj.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? "מוסיף..." : "הוסף נושא"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">נושאים קיימים</h2>

          {subjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((subject) => {
                const SubjectIcon =
                  icons[subject.iconIndex]?.icon || icons[0].icon;
                return (
                  <div
                    key={subject.id}
                    className="border border-gray-200 rounded-md p-4"
                  >
                    <div className="flex items-center mb-2">
                      <SubjectIcon className="w-5 h-5 ml-2 text-gray-600" />
                      <h3 className="text-lg font-medium">{subject.name}</h3>
                    </div>
                    {subject.description && (
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {subject.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      רמות: {subject.levels?.join(", ") || "כל הרמות"}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600">אין נושאים להצגה.</p>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
