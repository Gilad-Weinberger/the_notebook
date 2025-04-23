"use client";

import React, { useState, useEffect } from "react";
import PageLayout from "@/components/shared/layout/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { IoChevronDownOutline } from "react-icons/io5";

export default function ModelPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const modelId = params.id;
  const [model, setModel] = useState(null);
  const [subject, setSubject] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [userModelsForSubject, setUserModelsForSubject] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchModelAndSubject = async () => {
      try {
        // Step 1: Fetch model details
        const modelDoc = await getDoc(doc(db, "models", modelId));

        if (modelDoc.exists()) {
          const modelData = {
            id: modelDoc.id,
            ...modelDoc.data(),
          };
          setModel(modelData);

          // Step 2: Fetch the subject the model belongs to
          if (modelData.subjectId) {
            const subjectDoc = await getDoc(
              doc(db, "subjects", modelData.subjectId)
            );

            if (subjectDoc.exists()) {
              const subjectData = {
                id: subjectDoc.id,
                ...subjectDoc.data(),
              };
              setSubject(subjectData);

              // Step 3: Fetch materials related to this subject
              const materialsQuery = await getDocs(
                collection(db, "subjects", modelData.subjectId, "materials")
              );
              const materialsList = materialsQuery.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));

              setMaterials(materialsList);

              // Step 4: Get user's models for this subject
              if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists() && userDoc.data().models) {
                  const userModelIds = userDoc.data().models;

                  // Fetch all models the user has access to
                  const modelsSnapshot = await getDocs(
                    collection(db, "models")
                  );
                  const allModels = modelsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                  }));

                  // Filter for models that belong to the same subject and are in the user's models
                  const subjectModels = allModels.filter(
                    (m) =>
                      m.subjectId === subjectData.id &&
                      userModelIds.includes(m.id)
                  );

                  setUserModelsForSubject(subjectModels);
                }
              }
            } else {
              console.error("Subject not found");
            }
          } else {
            console.error("Model does not have a subject ID");
          }
        } else {
          console.error("Model not found");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (modelId) {
      fetchModelAndSubject();
    }
  }, [modelId, user]);

  const handleModelChange = (newModelId) => {
    router.push(`/subjects/${newModelId}`);
    setDropdownOpen(false);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto">
          <p className="text-center">טוען נתונים...</p>
        </div>
      </PageLayout>
    );
  }

  if (!model || !subject) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-700">
              {!model ? "הדגם המבוקש לא נמצא." : "הנושא המבוקש לא נמצא."}
            </p>
          </div>
          <Link href="/subjects" className="text-blue-600 hover:text-blue-800">
            חזרה לרשימת הנושאים
          </Link>
        </div>
      </PageLayout>
    );
  }

  const showModelSwitcher = userModelsForSubject.length > 1;

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{subject.name}</h1>
            <div className="flex items-center text-xl text-gray-600 mt-1">
              <span>דגם: {model.code}</span>

              {/* Model Switcher */}
              {showModelSwitcher && (
                <div className="relative mr-4">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <span>החלף דגם</span>
                    <IoChevronDownOutline className="mr-1" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute top-full right-0 mt-1 bg-white shadow-lg rounded-md border z-10 min-w-[160px]">
                      <div className="py-1">
                        {userModelsForSubject.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => handleModelChange(m.id)}
                            className={`block w-full text-right px-4 py-2 text-sm hover:bg-gray-100 ${
                              m.id === model.id ? "font-bold bg-gray-50" : ""
                            }`}
                          >
                            {m.code}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <Link href="/subjects" className="text-blue-600 hover:text-blue-800">
            חזרה לנושאים
          </Link>
        </div>

        {user ? (
          <div>
            {/* Model Info */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-2">פרטי הדגם</h2>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 flex-1">
                  <div className="text-gray-500 text-sm">קוד דגם</div>
                  <div className="font-semibold">{model.code}</div>
                </div>
                {model.level && (
                  <div className="bg-green-50 rounded-lg p-3 flex-1">
                    <div className="text-gray-500 text-sm">רמה</div>
                    <div className="font-semibold">{model.level}</div>
                  </div>
                )}
              </div>
              {model.description && (
                <div className="text-gray-700">{model.description}</div>
              )}
            </div>

            {/* Subject Info */}
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
                      href={`/subjects/${subject.id}/materials/${material.id}`}
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
              אנא התחבר כדי לצפות בחומרי לימוד לדגם זה.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
