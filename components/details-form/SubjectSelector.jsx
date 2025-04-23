import React from "react";

const SubjectSelector = ({ subjects, selectedSubject, setSelectedSubject }) => {
  return (
    <div>
      <label className="text-gray-700 font-medium mb-2 block" htmlFor="subject">
        הוסף נושא
      </label>
      <select
        id="subject"
        className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right transition-all appearance-none"
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
  );
};

export default SubjectSelector;
