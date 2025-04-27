import React from "react";

const SubjectInfo = ({ subject }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-2">אודות הנושא</h2>
      <p className="text-gray-700 mb-4">
        {subject.description || "אין תיאור זמין לנושא זה."}
      </p>
      <p className="text-sm text-gray-500">
        רמות: {subject.levels?.join(", ") || "כל הרמות"}
      </p>
    </div>
  );
};

export default SubjectInfo;
