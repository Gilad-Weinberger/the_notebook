"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "../sidebar/Header";
import ExpandButton from "../sidebar/ExpandButton";
import DashboardLink from "../sidebar/DashboardLink";
import SubjectsList from "../sidebar/SubjectsList";
import ProfileSection from "../sidebar/ProfileSection";
import { ContentProvider } from "@/context/ContentContext";

const Sidebar = ({ onShrinkChange, disableShrink = false }) => {
  const [shrink, setShrink] = useState(false);
  const pathname = usePathname();

  // Function to handle shrink state change
  const handleShrinkChange = (newShrink) => {
    setShrink(newShrink);
    if (onShrinkChange) {
      onShrinkChange(newShrink);
    }
  };

  // Reset shrink state when disableShrink changes
  useEffect(() => {
    if (disableShrink && shrink) {
      handleShrinkChange(false);
    }
  }, [disableShrink]);

  return (
    <ContentProvider>
      <div
        className={`h-[calc(100vh-2rem)] border border-gray-200 bg-white flex flex-col fixed right-4 top-4 rounded-xl shadow-xl transition-all duration-500 ease-in-out ${
          shrink ? "w-18" : "w-72"
        } ${disableShrink ? "pt-10" : ""}`}
        dir="rtl"
      >
        <Header
          shrink={shrink}
          setShrink={handleShrinkChange}
          disableShrink={disableShrink}
        />

        {shrink && !disableShrink && (
          <ExpandButton setShrink={handleShrinkChange} />
        )}

        <DashboardLink shrink={shrink} pathname={pathname} />

        <SubjectsList shrink={shrink} />

        <ProfileSection shrink={shrink} />
      </div>
    </ContentProvider>
  );
};

export default Sidebar;
