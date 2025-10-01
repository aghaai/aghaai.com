"use client";

import React from "react";
import { usePathname } from "next/navigation";
import HeaderSection from "./Header";
import FooterSection from "./FooterSection";
import { TestNavigationProvider } from "./contexts/TestNavigationContext";

export default function Provider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardPage =
    pathname === "/dashboard" ||
    pathname === "/essay-evaluation" ||
    pathname === "/essay-test" ||
    pathname === "/essay-writing" ||
    pathname === "/essay-upload";

  return (
    <TestNavigationProvider>
      <div className="flex flex-col min-h-screen">
        <HeaderSection />
        <main className="flex-grow">{children}</main>
        {!isDashboardPage && <FooterSection />}
      </div>
    </TestNavigationProvider>
  );
}
