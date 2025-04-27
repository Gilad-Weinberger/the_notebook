"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "./sidebar/Header";
import ExpandButton from "./sidebar/ExpandButton";
import DashboardLink from "./sidebar/DashboardLink";
import SubjectsList from "./sidebar/SubjectsList";
import ProfileSection from "./sidebar/ProfileSection";
import Link from "next/link";
import { MdAdminPanelSettings } from "react-icons/md";

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

      <Link
        href="/admin"
        className={`${
          pathname === "/admin"
            ? "bg-blue-50 text-blue-600"
            : "text-gray-700 hover:bg-gray-100"
        } ${
          shrink ? "p-3 flex justify-center" : "p-4"
        } transition-all duration-500 ease-in-out mt-2`}
      >
        <div className="flex items-center">
          <MdAdminPanelSettings className="h-6 w-6" />
          {!shrink && <span className="mr-2">ניהול</span>}
        </div>
      </Link>

      <ProfileSection shrink={shrink} />
    </div>
  );
};

export default Sidebar;
