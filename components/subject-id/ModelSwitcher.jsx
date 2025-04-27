import React, { useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";

const ModelSwitcher = ({ currentModel, models, onModelChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleModelChange = (modelId) => {
    onModelChange(modelId);
    setDropdownOpen(false);
  };

  return (
    <div className="relative mr-4">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
      >
        <span>החלף דגם</span>
        <IoChevronDownOutline className="mr-1" />
      </button>

      {dropdownOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white shadow-lg rounded-md border z-10 min-w-[160px]">
          <div className="py-1">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelChange(model.id)}
                className={`block w-full text-right px-4 py-2 text-sm hover:bg-gray-100 ${
                  model.id === currentModel.id ? "font-bold bg-gray-50" : ""
                }`}
              >
                {model.code}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSwitcher;
