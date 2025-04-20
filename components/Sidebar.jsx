"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./sidebar/Header";
import ExpandButton from "./sidebar/ExpandButton";
import DashboardLink from "./sidebar/DashboardLink";
import SubjectsList from "./sidebar/SubjectsList";
import ProfileSection from "./sidebar/ProfileSection";

const Sidebar = () => {
  const [shrink, setShrink] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={`h-[calc(100vh-2rem)] border border-gray-200 bg-white flex flex-col fixed right-4 top-4 rounded-xl shadow-xl transition-all duration-500 ease-in-out ${
        shrink ? "w-18" : "w-72"
      }`}
      dir="rtl"
    >
      <Header shrink={shrink} setShrink={setShrink} />

      {shrink && <ExpandButton setShrink={setShrink} />}

      <DashboardLink shrink={shrink} pathname={pathname} />

      <SubjectsList shrink={shrink} />

      <ProfileSection shrink={shrink} />
    </div>
  );
};

export default Sidebar;
