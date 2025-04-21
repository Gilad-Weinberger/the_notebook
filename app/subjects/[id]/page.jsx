"use client";

import React, { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function SubjectPage() {
  const { user } = useAuth();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const subjectId = params.id;
  const [subject, setSubject] = useState(null);

  useEffect(() => {
    const fetchSubjectAndMaterials = async () => {
      try {
        // Fetch subject details
        const subjectDoc = await getDoc(doc(db, "subjects", subjectId));

        if (subjectDoc.exists()) {
          setSubject({
            id: subjectDoc.id,
            ...subjectDoc.data(),
          });

          // Fetch materials related to this subject
          const materialsQuery = await getDocs(
            collection(db, "subjects", subjectId, "materials")
          );
          const materialsList = materialsQuery.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setMaterials(materialsList);
        } else {
          console.error("Subject not found");
        }
      } catch (err) {
        console.error("Error fetching subject:", err);
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) {
      fetchSubjectAndMaterials();
    }
  }, [subjectId]);

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto">
          <p className="text-center">טוען נושא...</p>
        </div>
      </PageLayout>
    );
  }

  if (!subject) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-700">הנושא המבוקש לא נמצא.</p>
          </div>
          <Link href="/subjects" className="text-blue-600 hover:text-blue-800">
            חזרה לרשימת הנושאים
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{subject.name}</h1>
          <Link href="/subjects" className="text-blue-600 hover:text-blue-800">
            חזרה לנושאים
          </Link>
        </div>

        {user ? (
          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-2">אודות הנושא</h2>
              <p className="text-gray-700 mb-4">
                {subject.description || "אין תיאור זמין לנושא זה."}
              </p>
              <p className="text-sm text-gray-500">
                רמות: {subject.levels?.join(", ") || "כל הרמות"}
              </p>
            </div>

            <h2 className="text-2xl font-semibold mb-4">חומרי לימוד</h2>

            {materials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="bg-white rounded-lg shadow p-6"
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      {material.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {material.type}
                    </p>
                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {material.description}
                    </p>
                    <Link
                      href={`/subjects/${subjectId}/materials/${material.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      צפה בחומר
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <p>אין חומרי לימוד זמינים לנושא זה כרגע.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-700">
              אנא התחבר כדי לצפות בחומרי לימוד לנושא זה.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
