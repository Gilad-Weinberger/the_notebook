import React from "react";

const SelectedSubjectsPanel = ({ selectedSubjects, bgColors, removeModel }) => {
  return (
    <div className="w-full md:w-1/3 h-full max-h-full">
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 h-full overflow-auto">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">הנושאים שנבחרו</h2>

        {Object.keys(selectedSubjects).length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            לא נבחרו נושאים עדיין
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(selectedSubjects).map(
              ([subjectId, subject], index) => (
                <div
                  key={subjectId}
                  className={`${
                    bgColors[index % bgColors.length]
                  } rounded-lg p-4 transition-all`}
                >
                  <h3 className="font-bold text-lg mb-2">{subject.name}</h3>
                  <ul className="space-y-2">
                    {subject.models.map((model) => (
                      <li
                        key={model.id}
                        className="group relative flex items-center"
                      >
                        <span className="flex-grow">{model.code}</span>
                        <button
                          type="button"
                          onClick={() => removeModel(subjectId, model.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition-opacity"
                          aria-label="הסר"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedSubjectsPanel;
