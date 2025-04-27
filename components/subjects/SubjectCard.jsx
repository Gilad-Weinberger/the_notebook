import React from "react";
import Link from "next/link";

const SubjectCard = ({ subject }) => {
  return (
    <div key={subject.id} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-2">{subject.name}</h2>
      <Link
        href={`/subjects/${subject.id}`}
        className="text-blue-600 hover:text-blue-800"
      >
        צפה בחומרי לימוד
      </Link>
    </div>
  );
};

export default SubjectCard;
