"use client";

import React from 'react';
import { useContent, CONTENT_TYPES } from '@/context/ContentContext';
import AIChat from './AIChat';
import NotesPanel from './NotesPanel';
import ResizableSplitView from './ResizableSplitView';

/**
 * DynamicContent - Renders different components based on the active content type in ContentContext
 * This prevents full page reloads when switching between components like chat, notes, etc.
 */
const DynamicContent = () => {
  const { activeContent, contentParams } = useContent();

  // If no content is active, show nothing or a placeholder
  if (!activeContent) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select an option from the sidebar
      </div>
    );
  }

  // Render different components based on active content type
  switch (activeContent) {
    case CONTENT_TYPES.CHAT:
      return <AIChat subjectId={contentParams.subjectId} />;
      
    case CONTENT_TYPES.NOTES:
      return <NotesPanel subjectId={contentParams.subjectId} />;
      
    case CONTENT_TYPES.DASHBOARD:
      // For dashboard content - you can create a separate Dashboard component
      return (
        <div className="p-4">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <p>Dashboard content goes here</p>
        </div>
      );
      
    case CONTENT_TYPES.SETTINGS:
      // For settings content
      return (
        <div className="p-4">
          <h2 className="text-xl font-bold">Settings</h2>
          <p>Settings content goes here</p>
        </div>
      );
      
    // Split view for showing both notes and chat
    case 'split-view':
      return (
        <ResizableSplitView
          leftContent={<NotesPanel subjectId={contentParams.subjectId} />}
          rightContent={<AIChat subjectId={contentParams.subjectId} />}
          initialSplit={50}
        />
      );
      
    default:
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          Unknown content type
        </div>
      );
  }
};

export default DynamicContent;