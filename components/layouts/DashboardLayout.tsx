"use client";

import React, { useState, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import DashboardHeaderWithSidebar from "./DashboardHeaderWithSidebar";
import ProtectedLink from "@/components/ui/protected-link";
import {
  LayoutDashboard,
  Settings,
  History,
  LogOut,
  X,
  PanelRightOpen,
  PanelRightClose,
  Hourglass,
} from "lucide-react";

// Context for sidebar state
interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const sidebarValue = {
    isCollapsed,
    setIsCollapsed,
    isMobileOpen,
    setIsMobileOpen,
  };

  return (
    <SidebarContext.Provider value={sidebarValue}>
      <div className="min-h-screen bg-[#F7F7F7] flex">
        {/* Mobile Sidebar Overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-opacity-100 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={`fixed left-0 top-0 h-full w-full bg-white shadow-lg transform transition-transform duration-300 z-50 lg:hidden ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Sidebar Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <Image
                src="/logo.png"
                alt="Aghaai Logo"
                width={120}
                height={40}
                className="w-auto h-10"
              />
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-2">
                <li>
                  <ProtectedLink
                    href="/dashboard"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      pathname === "/dashboard"
                        ? "bg-[#1F6B63] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="font-medium">Home</span>
                  </ProtectedLink>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Profile Settings</span>
                  </a>
                </li>
              </ul>

              {/* History Section - Moved up in mobile */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <a
                  href="#"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors mb-3"
                >
                  <History className="w-5 h-5 text-[#6B7280]" />
                  <span className="font-medium text-[#6B7280]">History</span>
                </a>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Hourglass className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    You haven&apos;t submitted your essay yet
                  </p>
                </div>
              </div>
            </nav>

            {/* Mobile Bottom Section - Only Logout */}
            <div className="p-4 border-t border-gray-200">
              <button className="flex items-center gap-3 px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors w-full">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Sidebar - Sticky */}
        <div
          className={`hidden lg:flex bg-white shadow-sm border-r border-gray-200 flex-col transition-all duration-300 h-screen sticky top-0 ${
            isCollapsed ? "w-20" : "w-64"
          }`}
        >
          {/* Logo */}
          <div className="p-6 flex items-center justify-between">
            {!isCollapsed && (
              <Image
                src="/logo.png"
                alt="Aghaai Logo"
                width={200}
                height={100}
                className="w-auto h-11"
              />
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? (
                <PanelRightClose className="w-5 h-5" />
              ) : (
                <PanelRightOpen className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <ProtectedLink
                  href="/dashboard"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${
                    pathname === "/dashboard"
                      ? "bg-[#1F6B63] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  title={isCollapsed ? "Home" : ""}
                >
                  <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">Home</span>}
                </ProtectedLink>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors group"
                  title={isCollapsed ? "Profile Settings" : ""}
                >
                  <Settings className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium">Profile Settings</span>
                  )}
                </a>
              </li>
            </ul>
            <div className=" ">
              {/* Essay Status */}
              {!isCollapsed && (
                <div className=" py-2 mb-4 border-t border-gray-200">
                  <a
                    href="#"
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors group"
                    title={isCollapsed ? "History" : ""}
                  >
                    <History className="w-5 h-5 flex-shrink-0 text-[#6B7280]" />
                    {!isCollapsed && (
                      <span className="font-medium text-[#6B7280]">
                        History
                      </span>
                    )}
                  </a>
                  <div className="flex items-center justify-center mb-3 mt-10">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <Hourglass className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center px-2">
                    You haven&apos;t submitted your essay yet
                  </p>
                </div>
              )}
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="p-4">
            <ProtectedLink
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors w-full justify-center lg:justify-start"
              title={isCollapsed ? "Logout" : ""}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Logout</span>}
            </ProtectedLink>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 h-screen">
          {/* Dashboard Header with Sidebar Integration - Sticky */}
          <div className="sticky top-0 z-30">
            <DashboardHeaderWithSidebar />
          </div>

          {/* Page Content - Scrollable */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default DashboardLayout;
