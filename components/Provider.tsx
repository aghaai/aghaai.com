"use client";

import React from "react";
import { usePathname } from "next/navigation";
import HeaderSection from "./Header";
import FooterSection from "./FooterSection";

export default function Provider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  return (
        <div className="flex flex-col min-h-screen">
          <HeaderSection /> 
          <main className="flex-grow">{children}</main>
          {!isDashboard && <FooterSection />}
        </div>
  );
}
