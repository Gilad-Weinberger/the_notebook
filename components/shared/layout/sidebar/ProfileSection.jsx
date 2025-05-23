import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IoSettingsSharp } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";

const ProfileSection = ({ shrink }) => {
  const { user, loading } = useAuth();

  const profileImage = user?.photoURL || "/default-user.png";
  const displayName = user?.displayName || "משתמש";

  if (loading) {
    return (
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-center">
          <span className="text-sm text-gray-500">טוען...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 p-4">
      {shrink ? (
        <div className="flex flex-col items-center space-y-3">
          <Link
            href="/settings"
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="הגדרות"
          >
            <IoSettingsSharp className="h-6 w-6 text-gray-700" />
          </Link>
          <Link href="/profile" className="p-1">
            <div className="w-8 h-8 relative rounded-full overflow-hidden">
              <Image
                src={profileImage}
                alt="פרופיל"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <Link href="/profile" className="flex items-center">
            <div className="w-8 h-8 relative rounded-full overflow-hidden ml-2">
              <Image
                src={profileImage}
                alt="פרופיל"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <span>{displayName}</span>
          </Link>
          <Link
            href="/settings"
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="הגדרות"
          >
            <IoSettingsSharp className="h-5 w-5 text-gray-700" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
