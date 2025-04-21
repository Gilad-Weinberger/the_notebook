import React from "react";

const SubjectsList = ({ subjects }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">נושאים קיימים</h2>

      {subjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="border border-gray-200 rounded-md p-4"
            >
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-medium">{subject.name}</h3>
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
