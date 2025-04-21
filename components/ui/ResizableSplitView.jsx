"use client";

import React, { useState, useRef, useEffect } from 'react';

/**
 * ResizableSplitView component allows for two panels to be displayed side by side
 * with a resizable divider between them.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.leftContent - Content for the left panel
 * @param {React.ReactNode} props.rightContent - Content for the right panel
 * @param {number} props.initialSplit - Initial split percentage (0-100), default is 50
 * @param {string} props.minWidth - Minimum width for each panel, default is '20%'
 */
export default function ResizableSplitView({ 
  leftContent, 
  rightContent, 
  initialSplit = 50, 
  minWidth = '20%' 
}) {
  const [splitPosition, setSplitPosition] = useState(initialSplit);
  const containerRef = useRef(null);
  const resizingRef = useRef(false);
  const initialMousePosRef = useRef(0);
  const initialSplitRef = useRef(initialSplit);
  
  // Handle the mouse down event on the divider
  const startResizing = (e) => {
    e.preventDefault();
    resizingRef.current = true;
    initialMousePosRef.current = e.clientX;
    initialSplitRef.current = splitPosition;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };
  
  // Calculate the new split position based on mouse movement direction
  // This fixes the issue where the divider moves in the opposite direction
  const handleMouseMove = (e) => {
    if (!resizingRef.current || !containerRef.current) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    
    // Calculate mouse movement delta
    const delta = e.clientX - initialMousePosRef.current;
    
    // Convert delta to percentage of container width
    const deltaPercent = (delta / containerWidth) * 100;
    
    // Update split position based on initial position and delta
    // This ensures the divider follows the mouse direction correctly
    const newSplitPosition = initialSplitRef.current - deltaPercent;
    
    // Limit the split position to respect the minimum width
    const minWidthPct = parseInt(minWidth, 10);
    const limitedSplitPosition = Math.min(Math.max(newSplitPosition, minWidthPct), 100 - minWidthPct);
    
    setSplitPosition(limitedSplitPosition);
  };
  
  // Clean up event listeners when resizing stops
  const stopResizing = () => {
    resizingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResizing);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="flex h-full w-full relative"
      style={{ 
        userSelect: resizingRef.current ? 'none' : 'auto'
      }}
    >
      {/* Left Panel */}
      <div 
        className="overflow-auto transition-width duration-75 ease-in-out"
        style={{ 
          width: `${splitPosition}%`,
          minWidth: minWidth,
        }}
      >
        {leftContent}
      </div>
      
      {/* Resizing Handle - Improved with rounded edges */}
      <div 
        className="w-4 cursor-col-resize flex items-center justify-center z-10"
        onMouseDown={startResizing}
      >
        {/* Rounded divider with elegant design */}
        <div className="h-24 w-1 bg-gradient-to-b from-blue-300 via-blue-400 to-blue-300 rounded-full shadow-md"></div>
      </div>
      
      {/* Right Panel */}
      <div 
        className="overflow-auto transition-width duration-75 ease-in-out"
        style={{ 
          width: `${100 - splitPosition}%`,
          minWidth: minWidth,
        }}
      >
        {rightContent}
      </div>
    </div>
  );
}