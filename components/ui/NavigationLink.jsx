"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useContent } from '@/context/ContentContext';

/**
 * NavigationLink - A custom Link component that can either:
 * 1. Navigate between pages (traditional navigation)
 * 2. Switch content components within the same page (using ContentContext)
 */
const NavigationLink = ({ 
  href, 
  className, 
  children, 
  onClick,
  activeClassName = "",
  contentType = null, // New prop to specify content type
  contentParams = {}, // New prop for content-specific parameters
  useContentSwitch = false, // Whether to use content switching instead of navigation
  ...props 
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { switchContent, activeContent } = useContent();
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Determine if this link is active - either by path or content type
  const isActive = useContentSwitch 
    ? activeContent === contentType 
    : pathname === href;
  
  // Combine classes based on active state
  const combinedClassName = `${className} ${isActive ? activeClassName : ''}`;

  const handleClick = (e) => {
    // If using content switching
    if (useContentSwitch && contentType) {
      e.preventDefault();
      
      // Switch content instead of navigating
      switchContent(contentType, contentParams);
      
      // Execute any additional onClick handler if provided
      if (onClick) onClick(e);
      
      return;
    }
    
    // Traditional navigation behavior
    if (pathname !== href) {
      // Prevent default navigation behavior
      e.preventDefault();
      
      // Set navigating state
      setIsNavigating(true);
      
      // Execute any additional onClick handler if provided
      if (onClick) onClick(e);
      
      // Use router.push for client-side navigation
      router.push(href);
      
      // Reset navigation state after a short delay
      setTimeout(() => {
        setIsNavigating(false);
      }, 300);
    } else if (onClick) {
      // Just execute the onClick if we're already on this page
      onClick(e);
    }
  };

  return (
    <Link 
      href={useContentSwitch ? '#' : href} 
      onClick={handleClick} 
      className={`${combinedClassName} ${isNavigating ? 'pointer-events-none' : ''}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavigationLink;