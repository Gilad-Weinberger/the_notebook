import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
      {/* Logo Section */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <div className="w-10 h-10 relative mr-2">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <span className="text-xl font-bold">The Notebook</span>
        </Link>
      </div>

      {/* Links Section */}
      <div className="hidden md:flex space-x-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <Link href="/notes" className="hover:text-blue-600 transition-colors">
          Notes
        </Link>
        <Link href="/about" className="hover:text-blue-600 transition-colors">
          About
        </Link>
      </div>

      {/* Auth Section */}
      <div className="relative">
        {user ? (
          <div className="flex items-center">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="w-8 h-8 relative rounded-full overflow-hidden mr-2">
                <Image
                  src={user.photoURL || "/default-user.png"}
                  alt="User"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <span className="mr-2">{user.displayName}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
