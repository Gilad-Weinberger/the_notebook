import React from "react";
import Link from "next/link";

const MaterialsList = ({ materials, subjectId }) => {
  if (materials.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p>אין חומרי לימוד זמינים לנושא זה כרגע.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {materials.map((material) => (
        <div key={material.id} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">{material.title}</h3>
          <p className="text-sm text-gray-500 mb-4">{material.type}</p>
          <p className="text-gray-700 mb-4 line-clamp-2">
            {material.description}
          </p>
          <Link
            href={`/subjects/${subjectId}/materials/${material.id}`}
            className="text-blue-600 hover:text-blue-800"
          >
            צפה בחומר
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MaterialsList;
