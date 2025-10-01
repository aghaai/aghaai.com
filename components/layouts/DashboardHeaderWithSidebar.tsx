"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Coins, Menu } from "lucide-react";
import { useSidebar } from "./DashboardLayout";

// Define page configurations for different dashboard pages
const pageConfigs = {
  "/dashboard": {
    title: "Welcome to Aghaai AI, Umer!",
    description: "Get Started with AI-powered essay evaluation",
  },
  "/essay-evaluation": {
    title: "Essay Evaluation Test",
    description: "Instant AI Feedback on Your Essays",
  },
  "/essay-test": {
    title: "Essay Test in Progress",
    description: "Choose your topic and start writing",
  },
  "/essay-writing": {
    title: "Essay Evaluation Test",
    description: "Instant AI Feedback on Your Essays",
  },
  "/essay-upload": {
    title: "Essay Evaluation Test",
    description: "Instant AI Feedback on Your Essays",
  },
  "/profile-settings": {
    title: "Profile Settings",
    description: "Manage your account and preferences",
  },
  "/history": {
    title: "Essay History",
    description: "View your previous essays and feedback",
  },
};

const DashboardHeaderWithSidebar = () => {
  const { setIsMobileOpen, isMobileOpen } = useSidebar();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Get current page config or default to dashboard
  const currentPage =
    pageConfigs[pathname as keyof typeof pageConfigs] ||
    pageConfigs["/dashboard"];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          {/* Logo for mobile */}
          <div className="lg:hidden">
            <Image
              src="/logo.png"
              alt="Aghaai Logo"
              width={100}
              height={32}
              className="w-auto h-8"
            />
          </div>
          {/* Title and Description - Hidden on mobile/tablet, shown on desktop */}
          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentPage.title}
            </h1>
            <p className="text-gray-600 mt-1 text-base">
              {currentPage.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Tokens - Always visible */}
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-xs font-medium">
              <Coins />
            </span>
            <span className="text-sm font-medium">2/5 Tokens</span>
          </div>

          {/* Buy More Button - Only on desktop */}
          <Button className="hidden lg:flex bg-[#1C6758] hover:bg-[#155a4d] text-white px-6 text-sm">
            Buy more
          </Button>

          {/* Avatar with dropdown on mobile/tablet */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 bg-orange-400 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#1C6758] focus:ring-offset-2"
            >
              <Image
                src="/assets/avatar.jpg"
                alt="User Avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </button>

            {/* Dropdown Menu - Only on mobile/tablet */}
            {showDropdown && (
              <div className="lg:hidden absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      // Handle buy more action
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Coins className="w-4 h-4" />
                    Buy more tokens
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeaderWithSidebar;
