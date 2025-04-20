import React from "react";
import PageLayout from "@/components/PageLayout";

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About The Notebook</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
          <p className="mb-4">
            The Notebook is a simple yet powerful application designed to help
            you organize your thoughts, ideas, and important information in one
            place.
          </p>
          <p>
            We believe in creating tools that enhance productivity without
            complexity.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Simple and intuitive interface</li>
            <li>Secure user authentication</li>
            <li>Cloud-based storage for your notes</li>
            <li>Access your notes from anywhere</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
}
