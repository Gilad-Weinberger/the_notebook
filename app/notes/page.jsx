"use client";

import React from "react";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/context/AuthContext";

export default function NotesPage() {
  const { user } = useAuth();

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Notes</h1>
        {user ? (
          <div>
            <p className="mb-4">Welcome back, {user.displayName}!</p>
            {/* Notes content would go here */}
            <div className="bg-white rounded-lg shadow p-6">
              <p>Your notes will appear here.</p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-700">Please log in to view your notes.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
