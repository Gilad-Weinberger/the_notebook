import React from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaTrash } from "react-icons/fa";

const SubjectsList = ({ subjects }) => {
  const handleDelete = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק נושא זה?")) {
      try {
        await deleteDoc(doc(db, "subjects", id));
        // You would typically refresh the list here
        window.location.reload();
      } catch (err) {
        console.error("Error deleting subject:", err);
        alert("שגיאה במחיקת הנושא");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">נושאים קיימים</h2>

      {subjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="border border-gray-200 rounded-md p-4 relative group"
            >
              <div className="flex items-center mb-2 justify-between">
                <h3 className="text-lg font-medium">{subject.name}</h3>
                <button
                  onClick={() => handleDelete(subject.id)}
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="Delete subject"
                >
                  <FaTrash />
                </button>
              </div>
              <p className="text-xs text-gray-500">ID: {subject.id}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">אין נושאים להצגה.</p>
      )}
    </div>
  );
};

export default SubjectsList;
