"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  UserNameInput,
  SubjectSelector,
  ModelsList,
  SelectedSubjectsPanel,
  LoadingSpinner,
  fetchUserData,
  fetchSubjects,
  fetchModels,
  fetchModelsBySubject,
  saveUserData,
} from "@/components/details-form";

const DetailsForm = () => {
  const [name, setName] = useState("");
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Create array of background colors for subject blocks
  const bgColors = [
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-indigo-100",
    "bg-red-100",
    "bg-orange-100",
    "bg-teal-100",
  ];

  useEffect(() => {
    // Redirect if no user is logged in
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    const initializeData = async () => {
      try {
        // Get user data
        const userData = await fetchUserData(user.uid);

        if (userData) {
          // User exists, we're in edit mode
          setIsEditMode(true);

          // Set name
          if (userData.name) {
            setName(userData.name);
          }

          // Fetch subjects
          const subjectsList = await fetchSubjects();
          setSubjects(subjectsList);

          // Process models if they exist
          if (
            userData.models &&
            Array.isArray(userData.models) &&
            userData.models.length > 0
          ) {
            setModels(userData.models);
            await populateSelectedSubjectsWithData(
              userData.models,
              subjectsList
            );
          }
        } else {
          // New user, fetch subjects only
          const subjectsList = await fetchSubjects();
          setSubjects(subjectsList);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error initializing data:", error);
        setError("אירעה שגיאה בטעינת הנתונים");
        setLoading(false);
      }
    };

    initializeData();
  }, [user, router]);

  // Helper function that takes explicit parameters instead of using state
  const populateSelectedSubjectsWithData = async (userModels, subjectsList) => {
    try {
      // Fetch all models
      const allModels = await fetchModels();

      // Find models that match the user's selected models
      const matchedModels = allModels.filter((model) =>
        userModels.includes(model.id)
      );

      // Group models by subject
      const subjectsWithModels = {};
      for (const model of matchedModels) {
        if (!model.subjectId) continue;

        if (!subjectsWithModels[model.subjectId]) {
          // Find subject name
          const subject = subjectsList.find((s) => s.id === model.subjectId);
          if (subject) {
            subjectsWithModels[model.subjectId] = {
              name: subject.name,
              models: [],
            };
          }
        }

        if (subjectsWithModels[model.subjectId]) {
          subjectsWithModels[model.subjectId].models.push({
            id: model.id,
            code: model.code,
          });
        }
      }

      setSelectedSubjects(subjectsWithModels);
    } catch (error) {
      console.error("Error populating selected subjects:", error);
    }
  };

  // Fetch models when a subject is selected
  useEffect(() => {
    const loadModelsForSubject = async () => {
      if (!selectedSubject) {
        setAvailableModels([]);
        return;
      }

      try {
        const modelsList = await fetchModelsBySubject(selectedSubject);
        setAvailableModels(modelsList);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    loadModelsForSubject();
  }, [selectedSubject]);

  const addModel = (modelId) => {
    const modelToAdd = availableModels.find((model) => model.id === modelId);
    if (!modelToAdd) return;

    // Add to general models list
    if (!models.includes(modelToAdd.id)) {
      setModels([...models, modelToAdd.id]);
    }

    // Add to selected subjects with models
    const currentSubject = subjects.find((s) => s.id === selectedSubject);

    setSelectedSubjects((prev) => {
      const updatedSubject = prev[selectedSubject] || {
        name: currentSubject?.name || "",
        models: [],
      };

      if (!updatedSubject.models.some((m) => m.id === modelToAdd.id)) {
        return {
          ...prev,
          [selectedSubject]: {
            ...updatedSubject,
            models: [
              ...updatedSubject.models,
              {
                id: modelToAdd.id,
                code: modelToAdd.code,
              },
            ],
          },
        };
      }

      return prev;
    });
  };

  const removeModel = (subjectId, modelId) => {
    // Remove from general models list
    setModels(models.filter((id) => id !== modelId));

    // Remove from selected subjects
    setSelectedSubjects((prev) => {
      const updatedSubjects = { ...prev };

      if (updatedSubjects[subjectId]) {
        updatedSubjects[subjectId] = {
          ...updatedSubjects[subjectId],
          models: updatedSubjects[subjectId].models.filter(
            (m) => m.id !== modelId
          ),
        };

        // If no models left for this subject, remove the subject
        if (updatedSubjects[subjectId].models.length === 0) {
          delete updatedSubjects[subjectId];
        }
      }

      return updatedSubjects;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (name.trim() === "") {
      return setError("שם הוא שדה חובה");
    }

    setLoading(true);

    try {
      const userData = {
        name: name,
        models: models,
        email: user.email,
        role: "student",
        updatedAt: new Date(),
      };

      // If not in edit mode, add createdAt
      if (!isEditMode) {
        userData.createdAt = new Date();
      }

      // Save user data
      await saveUserData(user.uid, userData);
      router.push("/subjects");
    } catch (error) {
      console.error("Error saving user:", error);
      setError("אירעה שגיאה בשמירת הפרטים");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className="h-screen w-screen overflow-auto flex items-center justify-center p-4 md:p-6 lg:p-8"
      dir="rtl"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Right Side - Form */}
        <div className="w-full md:w-2/3 h-full max-h-full overflow-auto">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">
              {isEditMode ? "עריכת פרטים" : "השלמת פרטים"}
            </h1>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <UserNameInput name={name} setName={setName} />

              <SubjectSelector
                subjects={subjects}
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
              />

              <ModelsList
                selectedSubject={selectedSubject}
                availableModels={availableModels}
                selectedSubjects={selectedSubjects}
                addModel={addModel}
                removeModel={removeModel}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "שומר פרטים..."
                  : isEditMode
                  ? "עדכן פרטים"
                  : "שמור והמשך"}
              </button>
            </form>
          </div>
        </div>

        {/* Left Side - Selected Subjects Panel */}
        <SelectedSubjectsPanel
          selectedSubjects={selectedSubjects}
          bgColors={bgColors}
          removeModel={removeModel}
        />
      </div>
    </div>
  );
};

export default DetailsForm;
