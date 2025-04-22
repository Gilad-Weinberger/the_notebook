"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const DetailsForm = () => {
  const [name, setName] = useState("");
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

    // Check if user already exists in database - if so, redirect to subjects
    const checkUserInDb = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          // User already exists in database, redirect to subjects
          router.push("/subjects");
        }
      } catch (error) {
        console.error("Error checking user in database:", error);
      }
    };

    checkUserInDb();
  }, [user, router]);

  const addModel = () => {
    if (currentModel.trim() === "") return;
    setModels([...models, currentModel.trim()]);
    setCurrentModel("");
  };

  const removeModel = (index) => {
    setModels(models.filter((_, i) => i !== index));
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
            <label className="block text-gray-700 text-sm font-bold mb-2">
              הוספת דגמים
            </label>
            <div className="flex">
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right"
                value={currentModel}
                onChange={(e) => setCurrentModel(e.target.value)}
                placeholder="הזן דגם"
              />
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={addModel}
              >
                הוסף
              </button>
            </div>
          </div>

          {models.length > 0 && (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                הדגמים שנבחרו
              </label>
              <ul className="bg-gray-100 p-3 rounded">
                {models.map((model, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center mb-1 last:mb-0"
                  >
                    <span>{model}</span>
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => removeModel(index)}
                    >
                      הסר
                    </button>
                  </li>
                ))}
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
