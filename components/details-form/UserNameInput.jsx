import React from "react";

const UserNameInput = ({ name, setName }) => {
  return (
    <div>
      <label className="text-gray-700 font-medium mb-2 block" htmlFor="name">
        שם מלא
      </label>
      <input
        type="text"
        id="name"
        className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right transition-all"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="הזן את שמך המלא"
      />
    </div>
  );
};

export default UserNameInput;
