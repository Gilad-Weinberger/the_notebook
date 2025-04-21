import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav
      className="flex items-center justify-between p-4 bg-white shadow-sm"
      dir="rtl"
    >
      {/* Logo Section */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <div className="w-10 h-10 relative ml-2">
            <Image
              src="/logo.png"
              alt="לוגו"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <span className="text-xl font-bold">המחברת</span>
        </Link>
      </div>

      {/* Links Section */}
      <div className="hidden md:flex space-x-reverse space-x-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          ראשי
        </Link>
        <Link href="/notes" className="hover:text-blue-600 transition-colors">
          הערות
        </Link>
        <Link
          href="/subjects"
          className="hover:text-blue-600 transition-colors"
        >
          נושאים
        </Link>
        <Link href="/about" className="hover:text-blue-600 transition-colors">
          אודות
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
              <div className="w-8 h-8 relative rounded-full overflow-hidden ml-2">
                <Image
                  src={user.photoURL || "/default-user.png"}
                  alt="משתמש"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <span className="ml-2">{user.displayName}</span>
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
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-right px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  התנתק
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth/signin"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            התחבר
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
