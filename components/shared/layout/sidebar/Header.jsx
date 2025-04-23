import React from "react";
import Image from "next/image";

const Header = ({ shrink, setShrink, disableShrink = false }) => {
  return (
    <div className="p-4 flex items-center justify-between border-b border-gray-200">
      {shrink ? (
        <div className="w-8 h-8 mx-auto relative">
          <Image
            src="/logo.png"
            alt="לוגו"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
      ) : (
        <div className="flex items-center">
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
        </div>
      )}

      {!shrink && !disableShrink && (
        <button
          onClick={() => setShrink(true)}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="כווץ תפריט"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Header;
