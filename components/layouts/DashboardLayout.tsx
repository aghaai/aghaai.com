"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  Loader2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { essayHistoryAPI, type EssayHistoryItem } from "@/lib/api/essay";

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
  const [essayHistory, setEssayHistory] = useState<EssayHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Fetch essay history on component mount
  useEffect(() => {
    const fetchInitialHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const response = await essayHistoryAPI.getHistory(1, 20); // Load more items initially
        if (response.success) {
          setEssayHistory(response.data.history);
          setCurrentPage(1);
          setHasMoreData(
            response.data.pagination.currentPage <
              response.data.pagination.totalPages
          );
        }
      } catch (error) {
        console.error("Failed to fetch essay history:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchInitialHistory();
  }, []);

  // Function to load more history items
  const loadMoreHistory = async () => {
    if (!hasMoreData || isLoadingMore || isLoadingHistory) return;

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await essayHistoryAPI.getHistory(nextPage, 20);

      if (response.success) {
        setEssayHistory((prev) => [...prev, ...response.data.history]);
        setCurrentPage(nextPage);
        setHasMoreData(nextPage < response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to load more history:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Function to refresh history
  const refreshHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await essayHistoryAPI.getHistory(1, 20);
      if (response.success) {
        setEssayHistory(response.data.history);
        setCurrentPage(1);
        setHasMoreData(
          response.data.pagination.currentPage <
            response.data.pagination.totalPages
        );
      }
    } catch (error) {
      console.error("Failed to refresh essay history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleHistoryClick = (sessionId: string) => {
    console.log("History clicked - sessionId:", sessionId);
    
    // Get old value before setting new one
    const oldValue = sessionStorage.getItem("essaySessionId");
    
    // Store session ID and navigate to results page
    sessionStorage.setItem("essaySessionId", sessionId);

    // Dispatch custom event for sessionStorage change (since storage event doesn't fire for same window)
    window.dispatchEvent(
      new CustomEvent("sessionStorageChange", {
        detail: {
          key: "essaySessionId",
          newValue: sessionId,
          oldValue: oldValue,
        },
      })
    );

    // Clear essayMethod and other session states to avoid conflicts
    // The mode will be determined from the API response
    sessionStorage.removeItem("essayMethod");
    sessionStorage.removeItem("selectedTopic");
    sessionStorage.removeItem("selectedTopicTitle");
    sessionStorage.removeItem("essayResult");
    
    // Clear any pending submission data and set source as history
    sessionStorage.removeItem("pendingEssaySubmission");
    sessionStorage.setItem("essayResultSource", "history");

    router.push("/essay-results");
  };

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
            <nav className="flex-1 p-4 overflow-y-auto flex flex-col min-h-0">
              <ul className="space-y-2 flex-shrink-0">
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
                  <ProtectedLink
                    href="/profile-settings"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      pathname === "/profile-settings"
                        ? "bg-[#1F6B63] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Profile Settings</span>
                  </ProtectedLink>
                </li>
              </ul>

              {/* History Section - Moved up in mobile */}
              <div
                className={`mt-4 pt-4 border-t border-gray-200 flex-shrink-0 ${isHistoryExpanded ? "flex-1 flex flex-col min-h-0" : ""}`}
              >
                <div className="flex items-center justify-between px-3 py-2 mb-3">
                  <button
                    onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                    className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors flex-1"
                  >
                    <History className="w-5 h-5 text-[#6B7280]" />
                    <div className="flex items-center gap-2 flex-1">
                      <span className="font-medium text-[#6B7280]">
                        History
                      </span>
                      {essayHistory.length > 0 && (
                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                          {essayHistory.length}
                        </span>
                      )}
                    </div>
                    {isHistoryExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                    )}
                  </button>
                  {isHistoryExpanded && (
                    <button
                      onClick={refreshHistory}
                      className="p-1 rounded-md hover:bg-gray-100 transition-colors ml-2"
                      title="Refresh history"
                      disabled={isLoadingHistory}
                    >
                      <RotateCcw
                        className={`w-4 h-4 text-[#6B7280] ${isLoadingHistory ? "animate-spin" : ""}`}
                      />
                    </button>
                  )}
                </div>

                {isHistoryExpanded && (
                  <div
                    className={`${isHistoryExpanded ? "flex-1 flex flex-col min-h-0" : ""}`}
                  >
                    {isLoadingHistory ? (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-gray-600 animate-spin" />
                        </div>
                      </div>
                    ) : essayHistory.length > 0 ? (
                      <div
                        className={`space-y-2 overflow-y-auto scrollbar-thin border border-gray-100 rounded-lg p-2 ${isHistoryExpanded ? "flex-1 min-h-0" : "max-h-60"}`}
                        onScroll={(e) => {
                          const { scrollTop, scrollHeight, clientHeight } =
                            e.currentTarget;
                          if (
                            scrollHeight - scrollTop <= clientHeight + 5 &&
                            hasMoreData &&
                            !isLoadingMore
                          ) {
                            loadMoreHistory();
                          }
                        }}
                      >
                        {essayHistory.map((item, index) => (
                          <button
                            key={`${item.sessionId}-${index}`}
                            onClick={() => handleHistoryClick(item.sessionId)}
                            className="w-full text-left px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 capitalize">
                                  {item.date}
                                </p>
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {item.topicTitle}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}

                        {/* Loading indicator for infinite scroll */}
                        {isLoadingMore && (
                          <div className="flex items-center justify-center py-2">
                            <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                            <span className="ml-2 text-xs text-gray-600">
                              Loading more...
                            </span>
                          </div>
                        )}

                        {/* Show "No more data" message when all items are loaded */}
                        {!hasMoreData && essayHistory.length > 10 && (
                          <div className="flex items-center justify-center py-2">
                            <span className="text-xs text-gray-500">
                              No more history items
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
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
                    )}
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Bottom Section - Only Logout */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
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
          <nav className="flex-1 p-4 flex flex-col min-h-0">
            <ul className="space-y-2 flex-shrink-0">
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
                <ProtectedLink
                  href="/profile-settings"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${
                    pathname === "/profile-settings"
                      ? "bg-[#1F6B63] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  title={isCollapsed ? "Profile Settings" : ""}
                >
                  <Settings className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium">Profile Settings</span>
                  )}
                </ProtectedLink>
              </li>
            </ul>
            <div
              className={`${isHistoryExpanded && !isCollapsed ? "flex-1 flex flex-col min-h-0" : ""}`}
            >
              {/* Essay Status */}
              {!isCollapsed && (
                <div
                  className={`py-2 mb-4 border-t border-gray-200 flex-shrink-0 ${isHistoryExpanded ? "flex-1 flex flex-col min-h-0" : ""}`}
                >
                  <div className="flex items-center justify-between py-2 mb-3">
                    <button
                      onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                      className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors flex-1"
                    >
                      <History className="w-5 h-5 flex-shrink-0 text-[#6B7280]" />
                      <div className="flex items-center gap-2 flex-1">
                        <span className="font-medium text-[#6B7280]">
                          History
                        </span>
                        {essayHistory.length > 0 && (
                          <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                            {essayHistory.length}
                          </span>
                        )}
                      </div>
                      {isHistoryExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                      )}
                    </button>
                    {isHistoryExpanded && (
                      <button
                        onClick={refreshHistory}
                        className="p-1 rounded-md hover:bg-gray-100 transition-colors ml-2"
                        title="Refresh history"
                        disabled={isLoadingHistory}
                      >
                        <RotateCcw
                          className={`w-4 h-4 text-[#6B7280] ${isLoadingHistory ? "animate-spin" : ""}`}
                        />
                      </button>
                    )}
                  </div>

                  {isHistoryExpanded && (
                    <div
                      className={`${isHistoryExpanded ? "flex-1 flex flex-col min-h-0" : ""}`}
                    >
                      {isLoadingHistory ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 text-gray-600 animate-spin" />
                        </div>
                      ) : essayHistory.length > 0 ? (
                        <div
                          className={`space-y-2 overflow-y-auto scrollbar-thin ${isHistoryExpanded ? "flex-1 min-h-0" : "max-h-80"}`}
                          onScroll={(e) => {
                            const { scrollTop, scrollHeight, clientHeight } =
                              e.currentTarget;
                            if (
                              scrollHeight - scrollTop <= clientHeight + 5 &&
                              hasMoreData &&
                              !isLoadingMore
                            ) {
                              loadMoreHistory();
                            }
                          }}
                        >
                          {essayHistory.map((item, index) => (
                            <button
                              key={`${item.sessionId}-${index}`}
                              onClick={() => handleHistoryClick(item.sessionId)}
                              className="w-full text-left px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-gray-500 capitalize mt-1">
                                    {item.date}
                                  </p>
                                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                    {item.topicTitle}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}

                          {/* Loading indicator for infinite scroll */}
                          {isLoadingMore && (
                            <div className="flex items-center justify-center py-2">
                              <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                              <span className="ml-2 text-xs text-gray-600">
                                Loading more...
                              </span>
                            </div>
                          )}

                          {/* Show "No more data" message when all items are loaded */}
                          {!hasMoreData && essayHistory.length > 10 && (
                            <div className="flex items-center justify-center py-2">
                              <span className="text-xs text-gray-500">
                                No more history items
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                              <Hourglass className="w-6 h-6 text-gray-600" />
                            </div>
                            <p className="text-sm text-gray-600">
                              You haven&apos;t submitted your essay yet
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>


          {/* Bottom Section */}
          <div className="p-4 flex-shrink-0">
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
