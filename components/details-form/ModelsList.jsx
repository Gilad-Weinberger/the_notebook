import React from "react";

const ModelsList = ({
  selectedSubject,
  availableModels,
  selectedSubjects,
  addModel,
  removeModel,
}) => {
  if (!selectedSubject) return null;

  return (
    <div>
      <label className="text-gray-700 font-medium mb-2 block">בחר דגמים</label>
      <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50">
        {availableModels.length === 0 ? (
          <p className="text-center text-gray-500 py-4">אין דגמים זמינים</p>
        ) : (
          [...availableModels]
            .sort((a, b) => {
              // Extract numeric parts if model codes are mixed with letters
              const aNum = parseInt(a.code.replace(/\D/g, "")) || 0;
              const bNum = parseInt(b.code.replace(/\D/g, "")) || 0;
              return aNum - bNum;
            })
            .map((model) => (
              <div
                key={model.id}
                className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-md transition-colors mb-1 last:mb-0"
              >
                <span className="font-medium">{model.code}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      selectedSubjects[selectedSubject]?.models.some(
                        (m) => m.id === model.id
                      )
                    ) {
                      // If already selected, remove it
                      removeModel(selectedSubject, model.id);
                    } else {
                      // Otherwise add it
                      addModel(model.id);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    selectedSubjects[selectedSubject]?.models.some(
                      (m) => m.id === model.id
                    )
                      ? "bg-green-500 hover:bg-red-500 text-white"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {selectedSubjects[selectedSubject]?.models.some(
                    (m) => m.id === model.id
                  )
                    ? "נבחר ✓"
                    : "הוסף"}
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default ModelsList;
