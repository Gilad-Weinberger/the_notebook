import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ModelForm = ({ onModelAdded }) => {
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [code, setCode] = useState("");
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Available units
  const units = [1, 2, 3, 4, 5];

  // Fetch subjects for the dropdown
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "subjects"));
        const subjectsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSubjects(subjectsList);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    };

    fetchSubjects();
  }, []);

  const handleUnitToggle = (unit) => {
    if (selectedUnits.includes(unit)) {
      setSelectedUnits(selectedUnits.filter((u) => u !== unit));
    } else {
      setSelectedUnits([...selectedUnits, unit]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    // Validate inputs
    if (!subjectId) {
      setFormError("בחירת נושא היא חובה");
      return;
    }

    if (!code.trim()) {
      setFormError("קוד המודל הוא שדה חובה");
      return;
    }

    if (selectedUnits.length === 0) {
      setFormError("יש לבחור לפחות יחידת לימוד אחת");
      return;
    }

    setSubmitting(true);

    try {
      // Find the selected subject to get its data
      const selectedSubject = subjects.find(
        (subject) => subject.id === subjectId
      );

      // Create the model document
      const modelData = {
        subjectId: subjectId,
        subjectName: selectedSubject?.name || "", // For display purposes only
        code: code.trim(),
        units: selectedUnits.sort((a, b) => a - b), // Sort units numerically
        createdAt: new Date().toISOString(),
      };

      // Add to Firestore
      await addDoc(collection(db, "models"), modelData);

      // Reset form
      setSubjectId("");
      setCode("");
      setSelectedUnits([]);
      setFormSuccess("המודל נוצר בהצלחה!");

      // Notify parent component
      if (onModelAdded) {
        onModelAdded();
      }
    } catch (error) {
      console.error("Error creating model:", error);
      setFormError("אירעה שגיאה ביצירת המודל. אנא נסה שוב מאוחר יותר.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">יצירת מודל חדש</h2>

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
            htmlFor="subject"
            className="block text-gray-700 font-medium mb-2"
          >
            נושא <span className="text-red-500">*</span>
          </label>
          <select
            id="subject"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">בחר נושא</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="code"
            className="block text-gray-700 font-medium mb-2"
          >
            קוד המודל <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="לדוגמה: 35582"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            יחידות לימוד <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {units.map((unit) => (
              <div key={unit} className="flex items-center">
                <input
                  type="checkbox"
                  id={`unit-${unit}`}
                  checked={selectedUnits.includes(unit)}
                  onChange={() => handleUnitToggle(unit)}
                  className="ml-2"
                />
                <label htmlFor={`unit-${unit}`} className="text-gray-700">
                  {unit} יחידות
                </label>
              </div>
            ))}
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
            {submitting ? "מוסיף..." : "הוסף מודל"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModelForm;
