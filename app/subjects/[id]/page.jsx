"use client";

import React, { useState, useEffect } from "react";
import PageLayout from "@/components/shared/layout/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/shared/ui/LoadingSpinner";
import SubjectInfo from "@/components/subject-id/SubjectInfo";
import MaterialsList from "@/components/subject-id/MaterialsList";
import ModelSwitcher from "@/components/subject-id/ModelSwitcher";
import AIChat from "@/components/subject-id/AIChat";

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
  const [chatMessages, setChatMessages] = useState([]);
  const [chatExpanded, setChatExpanded] = useState(false);

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
  };

  const handleSendMessage = (message) => {
    if (message.trim()) {
      const newMessages = [
        ...chatMessages,
        { text: message, sender: "user", timestamp: new Date() },
      ];

      setChatMessages(newMessages);

      // Simulate AI response (replace with actual AI integration later)
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            text: `This is a simulated response about ${
              subject?.name || "this subject"
            }`,
            sender: "ai",
            timestamp: new Date(),
          },
        ]);
      }, 1000);

      // Auto-expand when chat is active
      if (!chatExpanded) {
        setChatExpanded(true);
      }
    }
  };

  const toggleChatExpanded = () => {
    setChatExpanded(!chatExpanded);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="h-[calc(100vh-200px)] flex items-center justify-center">
          <LoadingSpinner />
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
      {user ? (
        <div className="flex relative">
          {/* Main Content */}
          <div
            className={`w-full overflow-y-auto pr-0 lg:pr-6 transition-all duration-300 ease-in-out ${
              chatExpanded ? "ml-96" : "ml-24"
            }`}
          >
            {/* Model Info Header */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold">{subject.name}</h1>
                  <div className="flex items-center text-xl text-gray-600 mt-1">
                    <span>דגם: {model.code}</span>

                    {/* Model Switcher Component */}
                    {showModelSwitcher && (
                      <ModelSwitcher
                        currentModel={model}
                        models={userModelsForSubject}
                        onModelChange={handleModelChange}
                      />
                    )}
                  </div>
                </div>
                <Link
                  href="/subjects"
                  className="text-blue-600 hover:text-blue-800"
                >
                  חזרה לנושאים
                </Link>
              </div>
            </div>
            {/* Subject Info Component */}
            <SubjectInfo subject={subject} />
            {/* Materials List Component */}
            <h2 className="text-2xl font-semibold mb-4">חומרי לימוד</h2>
            <MaterialsList materials={materials} subjectId={subject.id} />
          </div>
          {/* Chat Sidebar Component */}
          <AIChat
            expanded={chatExpanded}
            messages={chatMessages}
            subjectName={subject.name}
            onToggleExpanded={toggleChatExpanded}
            onSendMessage={handleSendMessage}
          />
        </div>
      ) : (
        <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-700">
            אנא התחבר כדי לצפות בחומרי לימוד לדגם זה.
          </p>
        </div>
      )}
    </PageLayout>
  );
}
