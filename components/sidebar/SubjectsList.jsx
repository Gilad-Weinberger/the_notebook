"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IoAddOutline } from "react-icons/io5";
import icons from "@/lib/data/icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import NavigationLink from "../ui/NavigationLink";

const SubjectsList = ({ shrink }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  
  // Track current active subject to avoid unnecessary re-renders
  const [activeSubjectId, setActiveSubjectId] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "subjects"));
        const subjectsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          iconIndex: doc.data().iconIndex || 0, // Default icon
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

  // Update active subject when path changes
  useEffect(() => {
    // Extract subject id from pathname if it's a subject page
    const match = pathname.match(/\/subjects\/([^/]+)/);
    if (match && match[1]) {
      setActiveSubjectId(match[1]);
    } else {
      setActiveSubjectId(null);
    }
  }, [pathname]);

  // Handler for subject click
  const handleSubjectClick = (e, subjectId) => {
    // If already on this subject, prevent default to avoid unnecessary navigation
    if (activeSubjectId === subjectId) {
      e.preventDefault();
      return;
    }
    
    // Otherwise, let NavigationLink handle it
    setActiveSubjectId(subjectId);
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
            const isActive = activeSubjectId === subject.id;

            return (
              <div key={subject.id} className="relative mb-3">
                {!shrink && isActive ? (
                  <div className="absolute right-[10px] h-full w-1.5 bg-red-500 opacity-100 transition-opacity z-10 rounded-full"></div>
                ) : (
                  <></>
                )}
                <NavigationLink
                  href={`/subjects/${subject.id}`}
                  onClick={(e) => handleSubjectClick(e, subject.id)}
                  className={`relative flex items-center w-[83%] mx-auto shadow-md rounded-lg ${
                    shrink ? "py-3 justify-center" : "py-3 px-4"
                  } hover:bg-gray-100 transition-all duration-300 ease-in-out group`}
                  activeClassName="bg-gray-100"
                >
                  <div className={shrink ? "" : "ml-2"}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  {!shrink && <span className="mr-2">{subject.name}</span>}
                </NavigationLink>
              </div>
            );
          })
        ) : (
          <div className="text-center py-4">אין נושאים להצגה</div>
        )}

        {/* Add new subject button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => router.push("/admin")}
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
