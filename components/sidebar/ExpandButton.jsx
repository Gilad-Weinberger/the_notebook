import React from "react";

const ExpandButton = ({ setShrink }) => {
  return (
    <button
      onClick={() => setShrink(false)}
      className="absolute -left-3 top-12 bg-white rounded-full p-1.5 shadow-xl border border-gray-200 hover:scale-110 transition-transform"
      aria-label="הרחב תפריט"
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
          d="M11 19l-7-7 7-7M18 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
};

export default ExpandButton;
