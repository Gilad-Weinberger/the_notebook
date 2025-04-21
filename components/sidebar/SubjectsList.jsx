"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoAddOutline } from "react-icons/io5";
import icons from "@/lib/data/icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SubjectsList = ({ shrink }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "subjects"));
        const subjectsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          iconIndex: 0, // Default icon
        }));
        setSubjects(subjectsList);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // Check if current subject is active based on path
  const isActiveSubject = (subjectId) => {
    return pathname === `/subjects/${subjectId}`;
  };

  return (
    <div
      className={`flex-1 overflow-y-auto mt-3 px-2 ${
        shrink ? "" : "pl-0"
      } pb-5`}
    >
      <div className="sticky top-0">
        {loading ? (
          <div className="text-center py-4">טוען נושאים...</div>
        ) : subjects.length > 0 ? (
          subjects.map((subject) => {
            const IconComponent = icons[subject.iconIndex || 0];
            const isActive = isActiveSubject(subject.id);

            return (
              <div key={subject.id} className="relative mb-3">
                {!shrink && isActive ? (
                  <div className="absolute right-[10px] h-full w-1.5 bg-red-500 opacity-100 transition-opacity z-10 rounded-full"></div>
                ) : (
                  <></>
                )}
                <Link
                  href={`/subjects/${subject.id}`}
                  className={`relative flex items-center w-[83%] mx-auto shadow-md rounded-lg ${
                    shrink ? "py-3 justify-center" : "py-3 px-4"
                  } ${
                    isActive ? "bg-gray-100" : ""
                  } hover:bg-gray-100 transition-all duration-500 ease-in-out group`}
                >
                  <div className={shrink ? "" : "ml-2"}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  {!shrink && <span className="mr-2">{subject.name}</span>}
                </Link>
              </div>
            );
          })
        ) : (
          <div className="text-center py-4">אין נושאים להצגה</div>
        )}

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
