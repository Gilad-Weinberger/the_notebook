import React from "react";
import Link from "next/link";
import { MdDashboard } from "react-icons/md";

const DashboardLink = ({ shrink, pathname }) => {
  return (
    <Link
      href="/subjects"
      className={`${
        pathname === "/subjects"
          ? "bg-blue-50 text-blue-600"
          : "text-gray-700 hover:bg-gray-100"
      } ${
        shrink ? "p-3 flex justify-center" : "p-4"
      } transition-all duration-500 ease-in-out mt-2`}
    >
      <div className="flex items-center">
        <MdDashboard className="h-6 w-6" />
        {!shrink && <span className="mr-2">לוח בקרה</span>}
      </div>
    </Link>
  );
};

export default DashboardLink;
