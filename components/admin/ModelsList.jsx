import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ModelsList = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "models"));
        const modelsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setModels(modelsList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching models:", err);
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading) {
    return <p className="text-center py-4">טוען מודלים...</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">מודלים קיימים</h2>

      {models.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {models.map((model) => (
            <div
              key={model.id}
              className="border border-gray-200 rounded-md p-4"
            >
              <h3 className="text-lg font-medium mb-1">קוד: {model.code}</h3>
              <p className="text-sm mb-2">נושא: {model.subjectName || "N/A"}</p>
              <p className="text-sm mb-2">
                יחידות לימוד:{" "}
                {Array.isArray(model.units)
                  ? model.units.join(", ")
                  : "לא צוין"}
              </p>
              <p className="text-xs text-gray-500">מזהה: {model.id}</p>
              <p className="text-xs text-gray-500">
                מזהה נושא: {model.subjectId}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">אין מודלים להצגה.</p>
      )}
    </div>
  );
};

export default ModelsList;
