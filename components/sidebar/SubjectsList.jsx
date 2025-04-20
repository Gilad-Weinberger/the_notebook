import React from "react";
import Link from "next/link";
import { IoAddOutline, IoCalculatorOutline } from "react-icons/io5";
import { IoMdSchool } from "react-icons/io";
import { FaFlask } from "react-icons/fa";
import { MdHistory } from "react-icons/md";

const SubjectsList = ({ shrink }) => {
  // List of icons to use for subjects
  const icons = [
    IoCalculatorOutline, // Math
    IoMdSchool, // English
    FaFlask, // Physics
    MdHistory, // History
  ];

  // Sample subjects with icon indexes
  const subjects = [
    { id: 1, name: "מתמטיקה", iconIndex: 0 },
    { id: 2, name: "אנגלית", iconIndex: 1 },
    { id: 3, name: "פיזיקה", iconIndex: 2 },
    { id: 4, name: "היסטוריה", iconIndex: 3 },
  ];

  return (
    <div
      className={`flex-1 overflow-y-auto mt-3 px-2 ${
        shrink ? "" : "pl-0"
      } pb-5`}
    >
      <div className="sticky top-0">
        {subjects.map((subject) => {
          const IconComponent = icons[subject.iconIndex];

          return (
            <div key={subject.id} className="relative mb-3">
              {!shrink ? (
                <div className="absolute right-[10px] h-full w-1.5 bg-blue-500 opacity-100 transition-opacity z-10 rounded-full"></div>
              ) : (
                <></>
              )}
              <Link
                href={`/subjects/${subject.id}`}
                className={`relative flex items-center w-[83%] mx-auto shadow-md rounded-lg ${
                  shrink ? "py-3 justify-center" : "py-3 px-4"
                } hover:bg-gray-100 transition-all duration-500 ease-in-out group`}
              >
                <div className={shrink ? "" : "ml-2"}>
                  <IconComponent className="w-6 h-6" />
                </div>
                {!shrink && <span className="mr-2">{subject.name}</span>}
              </Link>
            </div>
          );
        })}

        {/* Add new subject button */}
        <div className="flex justify-center mt-4">
          <button
            className={`flex items-center cursor-pointer justify-center h-12 w-12 rounded-full bg-gray-100 shadow-md hover:bg-gray-200 transition-all duration-500 ease-in-out`}
          >
            <IoAddOutline className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectsList;
