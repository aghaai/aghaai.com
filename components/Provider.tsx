"use client";

import React from "react";
import HeaderSection from "./Header";
import FooterSection from "./FooterSection";

export default function Provider({ children }: { children: React.ReactNode }) {

  return (
        <div className="flex flex-col min-h-screen">
          <HeaderSection /> 
          <main className="flex-grow">{children}</main>
          <FooterSection />
        </div>
  );
}
