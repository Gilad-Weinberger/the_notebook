import React from "react";

const AdminTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "subjects", label: "נושאים" },
    { id: "models", label: "מודלים" },
  ];

  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="flex -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`mr-8 py-4 px-1 border-b-2 font-medium text-md ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminTabs;
