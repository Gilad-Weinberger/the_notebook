import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SubjectForm = ({ onSubjectAdded }) => {
  // Form state
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    // Validate inputs
    if (!name.trim()) {
      setFormError("שם המקצוע הוא שדה חובה");
      return;
    }

    setSubmitting(true);

    try {
      // Create the subject document
      const subjectData = {
        name: name.trim(),
        createdAt: new Date().toISOString(),
      };

      // Add to Firestore
      await addDoc(collection(db, "subjects"), subjectData);

      // Reset form
      setName("");
      setFormSuccess("המקצוע נוצר בהצלחה!");

      // Notify parent component
      if (onSubjectAdded) {
        onSubjectAdded();
      }
    } catch (error) {
      console.error("Error creating subject:", error);
      setFormError("אירעה שגיאה ביצירת המקצוע. אנא נסה שוב מאוחר יותר.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">יצירת מקצוע חדש</h2>

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
            שם המקצוע <span className="text-red-500">*</span>
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

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "מוסיף..." : "הוסף מקצוע"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubjectForm;
