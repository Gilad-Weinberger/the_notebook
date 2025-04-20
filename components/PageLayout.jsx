"use client";

import React from "react";
import Navbar from "./Navbar";

const PageLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </>
  );
};

export default PageLayout;
