"use client";

import React, { createContext, useContext, useState } from 'react';

// Define content types that can be dynamically loaded
export const CONTENT_TYPES = {
  DASHBOARD: 'dashboard',
  NOTES: 'notes',
  CHAT: 'chat',
  SETTINGS: 'settings',
};

// Create the context
const ContentContext = createContext();

// Custom hook to use the context
export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

// Provider component
export const ContentProvider = ({ children }) => {
  // State to track which content is currently active
  const [activeContent, setActiveContent] = useState(null);
  
  // Additional state for content-specific parameters
  const [contentParams, setContentParams] = useState({});

  // Function to switch the active content
  const switchContent = (contentType, params = {}) => {
    setActiveContent(contentType);
    setContentParams(params);
  };

  // Context value to be provided
  const contextValue = {
    activeContent,
    contentParams,
    switchContent,
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
};