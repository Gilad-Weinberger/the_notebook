"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoAddOutline } from "react-icons/io5";
import icons from "@/lib/data/icons";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

const SubjectsList = ({ shrink }) => {
  const [userSubjects, setUserSubjects] = useState([]);
  const [userModels, setUserModels] = useState([]);
  const [subjectModelsMap, setSubjectModelsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Step 1: Get user's models from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists() && userDoc.data().models) {
          const userModelIds = userDoc.data().models;
          setUserModels(userModelIds);

          // Step 2: Get all models details
          const modelsSnapshot = await getDocs(collection(db, "models"));
          const modelsData = modelsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Step 3: Filter models that the user has
          const userModelsData = modelsData.filter((model) =>
            userModelIds.includes(model.id)
          );

          // Step 4: Create a map of subject IDs to model IDs
          const subjectToModels = {};
          userModelsData.forEach((model) => {
            if (model.subjectId) {
              if (!subjectToModels[model.subjectId]) {
                subjectToModels[model.subjectId] = [];
              }
              subjectToModels[model.subjectId].push({
                id: model.id,
                code: model.code,
              });
            }
          });
          setSubjectModelsMap(subjectToModels);

          // Step 5: Get subjects that match the user's models
          const subjectsSnapshot = await getDocs(collection(db, "subjects"));
          const allSubjects = subjectsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            iconIndex: 0, // Default icon
          }));

          // Step 6: Filter subjects to only include those in the user's models
          const userSubjectsList = allSubjects.filter(
            (subject) => subjectToModels[subject.id]
          );

          setUserSubjects(userSubjectsList);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching user subjects:", err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Check if current subject or model is active based on path
  const isActiveSubject = (subjectId) => {
    return pathname.startsWith(`/subjects/${subjectId}`);
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
        ) : userSubjects.length > 0 ? (
          userSubjects.map((subject) => {
            const IconComponent = icons[subject.iconIndex || 0];
            const isActive = isActiveSubject(subject.id);
            // Get the first model ID for this subject to use in the link
            const firstModelId = subjectModelsMap[subject.id]?.[0]?.id;

            return (
              <div key={subject.id} className="relative mb-3">
                {!shrink && isActive ? (
                  <div className="absolute right-[10px] h-full w-1.5 bg-red-500 opacity-100 transition-opacity z-10 rounded-full"></div>
                ) : (
                  <></>
                )}
                <Link
                  href={firstModelId ? `/subjects/${firstModelId}` : "#"}
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
          <Link href="/auth/details-form">
            <button
              className={`flex items-center cursor-pointer justify-center h-12 w-12 rounded-full bg-gray-100 shadow-md hover:bg-gray-200 transition-all duration-500 ease-in-out`}
            >
              <IoAddOutline className="h-6 w-6 text-gray-500" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubjectsList;
