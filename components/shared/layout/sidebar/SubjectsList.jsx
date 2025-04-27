"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { IoAddOutline } from "react-icons/io5";
import icons from "@/lib/data/icons";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/shared/ui/LoadingSpinner";

// Add a more robust cache mechanism
const cache = {
  subjects: null,
  models: null,
  userModels: {},
  timestamp: 0,
  CACHE_DURATION: 2 * 60 * 1000, // Reduced to 2 minutes in milliseconds
  invalidate: () => {
    console.log("Invalidating cache");
    cache.timestamp = 0;
    cache.subjects = null;
    cache.models = null;
    cache.userModels = {};
  },
};

const SubjectsList = ({ shrink }) => {
  const [userSubjects, setUserSubjects] = useState([]);
  const [subjectModelsMap, setSubjectModelsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const userId = useMemo(() => user?.uid, [user]);

  // Use the refresh param to force a refresh when adding new data
  const refreshFlag = searchParams.get("refresh");

  // Create a lastPathRef to detect when we're returning from details-form
  const lastPathRef = React.useRef(pathname);

  // Function to force refresh data
  const refreshData = useCallback(() => {
    console.log("Refreshing subject list data");
    cache.invalidate();
    setLoading(true);
  }, []);

  // Check for path changes that should invalidate cache
  useEffect(() => {
    // If we're coming back from details-form, refresh the data
    if (
      lastPathRef.current.includes("/auth/details-form") &&
      !pathname.includes("/auth/details-form")
    ) {
      console.log("Detected return from details form, refreshing");
      refreshData();
    }

    lastPathRef.current = pathname;
  }, [pathname, refreshData]);

  // Handle refresh param
  useEffect(() => {
    // Invalidate cache when refresh param is present
    if (refreshFlag === "true") {
      console.log("Refresh parameter detected");
      refreshData();

      // Remove the refresh param from the URL to avoid refreshing again on subsequent renders
      const newUrl = pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [refreshFlag, refreshData, pathname, router]);

  // React to user changes
  useEffect(() => {
    if (userId) {
      setLoading(true);
    }
  }, [userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const now = Date.now();
        let userModelIds = [];
        let modelsData = [];
        let subjectsData = [];

        // Check if cache is valid
        const isCacheValid =
          cache.timestamp > 0 &&
          now - cache.timestamp < cache.CACHE_DURATION &&
          cache.subjects &&
          cache.models &&
          cache.userModels[userId];

        if (!isCacheValid) {
          console.log("Cache invalid, fetching fresh data");
          // Fetch all data in parallel
          const [userDocSnapshot, modelsSnapshot, subjectsSnapshot] =
            await Promise.all([
              getDoc(doc(db, "users", userId)),
              getDocs(collection(db, "models")),
              getDocs(collection(db, "subjects")),
            ]);

          // Process user models
          if (userDocSnapshot.exists() && userDocSnapshot.data().models) {
            userModelIds = userDocSnapshot.data().models;
            cache.userModels[userId] = userModelIds;
          } else {
            userModelIds = [];
            cache.userModels[userId] = [];
          }

          // Process models and subjects
          modelsData = modelsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          subjectsData = subjectsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            iconIndex: 0, // Default icon
          }));

          // Update cache
          cache.models = modelsData;
          cache.subjects = subjectsData;
          cache.timestamp = now;
          console.log("Updated cache with fresh data");
        } else {
          // Use cached data
          console.log("Using cached data");
          userModelIds = cache.userModels[userId];
          modelsData = cache.models;
          subjectsData = cache.subjects;
        }

        // Filter models that the user has access to
        const userModelsData = modelsData.filter((model) =>
          userModelIds.includes(model.id)
        );

        // Create subject to models mapping
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

        // Filter subjects to only include those in user's models
        const userSubjectsList = subjectsData.filter(
          (subject) => subjectToModels[subject.id]
        );

        console.log("Setting user subjects:", userSubjectsList.length);
        setUserSubjects(userSubjectsList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user subjects:", err);
        setLoading(false);
      }
    };

    // Start loading immediately, reset state if needed
    if (userId && loading) {
      fetchUserData();
    } else if (!userId) {
      setLoading(false);
      setUserSubjects([]);
      setSubjectModelsMap({});
    }
  }, [userId, loading]);

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
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
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
              onClick={refreshData}
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
