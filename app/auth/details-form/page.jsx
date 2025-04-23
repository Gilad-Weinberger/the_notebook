"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const DetailsForm = () => {
  const [name, setName] = useState("");
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [availableModels, setAvailableModels] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if no user is logged in
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    // Pre-fill name if it exists from auth
    if (user.displayName) {
      setName(user.displayName);
    }

    // Fetch subjects and their models
    const fetchSubjectsAndModels = async () => {
      try {
        const subjectsSnapshot = await getDocs(collection(db, "subjects"));
        const subjectsList = subjectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSubjects(subjectsList);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjectsAndModels();
  }, [user, router]);

  // Fetch models when a subject is selected
  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedSubject) {
        setAvailableModels([]);
        return;
      }

      try {
        const modelsSnapshot = await getDocs(collection(db, "models"));
        const modelsList = modelsSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((model) => model.subjectId === selectedSubject);
        setAvailableModels(modelsList);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    fetchModels();
  }, [selectedSubject]);

  const addModel = (modelId) => {
    const modelToAdd = availableModels.find((model) => model.id === modelId);
    if (modelToAdd && !models.includes(modelToAdd.id)) {
      setModels([...models, modelToAdd.id]);
    }
  };

  const removeModel = (modelId) => {
    setModels(models.filter((id) => id !== modelId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (name.trim() === "") {
      return setError("שם הוא שדה חובה");
    }

    setLoading(true);

    try {
      // Create new user document in Firestore for the first time
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        models: models,
        email: user.email,
        role: "student",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      router.push("/subjects");
    } catch (error) {
      console.error("Error creating user:", error);
      setError("אירעה שגיאה בשמירת הפרטים");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">השלמת פרטים</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              שם מלא
            </label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="subject"
            >
              בחר נושא
            </label>
            <select
              id="subject"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">בחר נושא</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {selectedSubject && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                בחר דגמים
              </label>
              <div className="max-h-40 overflow-y-auto border rounded p-2">
                {availableModels.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50"
                  >
                    <span>{model.code}</span>
                    <button
                      type="button"
                      onClick={() => addModel(model.id)}
                      className={`px-2 py-1 rounded ${
                        models.includes(model.id)
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                      disabled={models.includes(model.id)}
                    >
                      {models.includes(model.id) ? "נבחר" : "בחר"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {models.length > 0 && (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                הדגמים שנבחרו
              </label>
              <ul className="bg-gray-100 p-3 rounded">
                {models.map((modelId) => {
                  const model = availableModels.find((m) => m.id === modelId);
                  return (
                    <li
                      key={modelId}
                      className="flex justify-between items-center mb-1 last:mb-0"
                    >
                      <span>{model?.code}</span>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => removeModel(modelId)}
                      >
                        הסר
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? "שומר פרטים..." : "שמור והמשך"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DetailsForm;
