"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";
import { IoMenu, IoClose } from "react-icons/io5";

const PageLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  // Landing page with Navbar
  if (isLandingPage) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
      </div>
    );
  }

  // Other pages with Sidebar
  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white shadow-sm text-gray-700"
        >
          {sidebarOpen ? (
            <IoClose className="h-6 w-6" />
          ) : (
            <IoMenu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:block bg-gray-50">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="py-8 px-4 md:px-8 mr-0 md:mr-72">{children}</main>
      </div>

      {/* Sidebar for mobile (off-canvas) */}
      <div
        className={`fixed inset-0 z-40 md:hidden transform ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="relative h-full">
          <div className="h-full" onClick={() => setSidebarOpen(false)}>
            <div
              className="absolute inset-0 bg-gray-600 opacity-75"
              onClick={(e) => e.stopPropagation()}
            ></div>
          </div>
          <div
            className="absolute top-4 right-4 h-[calc(100vh-2rem)] w-3/4 max-w-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
