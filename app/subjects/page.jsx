"use client";

import React, { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

export default function SubjectsPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchSubjects();
  }, []);

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">נושאי לימוד</h1>
        {user ? (
          <div>
            <p className="mb-4">שלום, {user.displayName}!</p>

            {loading ? (
              <div className="bg-white rounded-lg shadow p-6">
                <p>טוען נושאים...</p>
              </div>
            ) : subjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="bg-white rounded-lg shadow p-6"
                  >
                    <h2 className="text-xl font-semibold mb-2">
                      {subject.name}
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                      רמות: {subject.levels?.join(", ") || "כל הרמות"}
                    </p>
                    <Link
                      href={`/subjects/${subject.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      צפה בחומרי לימוד
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <p>אין נושאים להצגה כרגע.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-700">
              אנא התחבר כדי לצפות בנושאי הלימוד.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
