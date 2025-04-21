"use client";

import React, { useState, useEffect, useTransition } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ResizableSplitView from "@/components/ui/ResizableSplitView";
import NotesPanel from "@/components/ui/NotesPanel";
import AIChat from "@/components/ui/AIChat";

export default function SubjectPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // State management
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(true);
  const subjectId = params.id;
  const [subject, setSubject] = useState(null);
  const [activeModelId, setActiveModelId] = useState(null);

  // Transition effect when content changes
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    // Reset content visibility when subject ID changes
    setContentVisible(false);
    setContentLoading(true);

    const fetchSubject = async () => {
      try {
        // Fetch subject details
        const subjectDoc = await getDoc(doc(db, "subjects", subjectId));

        if (subjectDoc.exists()) {
          // Start transition for smoother state updates
          startTransition(() => {
            setSubject({
              id: subjectDoc.id,
              ...subjectDoc.data(),
            });

            // For now, just use the subject ID as the model ID to ensure subject-specific notes
            setActiveModelId(subjectId);
          });
        } else {
          console.error("Subject not found");
        }
      } catch (err) {
        console.error("Error fetching subject:", err);
      } finally {
        // Short delay to allow transition effect
        setTimeout(() => {
          setLoading(false);
          setContentLoading(false);

          // Show content with slight delay for smoother transition
          setTimeout(() => {
            setContentVisible(true);
          }, 100);
        }, 200);
      }
    };

    if (subjectId) {
      fetchSubject();
    }
  }, [subjectId]);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PageLayout>
    );
  }

  if (!subject) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-700">הנושא המבוקש לא נמצא.</p>
          </div>
          <Link href="/subjects" className="text-blue-600 hover:text-blue-800">
            חזרה לרשימת הנושאים
          </Link>
        </div>
      </PageLayout>
    );
  }

  // Content for the split view panels - pass the specific subjectId to ensure subject-specific notes
  const notesPanel = (
    <NotesPanel subjectId={subjectId} modelId={activeModelId} />
  );
  const aiChatPanel = (
    <AIChat subjectId={subjectId} subjectName={subject.name} />
  );

  return (
    <PageLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Simple header with minimal styling - no border */}
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">{subject.name}</h1>
          <Link href="/subjects" className="text-blue-600 hover:text-blue-800">
            חזרה לנושאים
          </Link>
        </div>

        {user ? (
          <div
            className={`flex-grow overflow-hidden transition-opacity duration-300 ${
              contentVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {contentLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-6 py-1">
                    <div className="h-2 bg-slate-200 rounded"></div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                        <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                      </div>
                      <div className="h-2 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <ResizableSplitView
                leftContent={notesPanel}
                rightContent={aiChatPanel}
                initialSplit={60}
                minWidth="30%"
              />
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 m-4">
            <p className="text-yellow-700">אנא התחבר כדי להשתמש בכלי הנושא.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
