"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Coins, Menu, LogOut } from "lucide-react";
import { useSidebar } from "./DashboardLayout";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { useUserInfo } from "@/components/contexts/UserInfoContext";
import { logout } from "@/lib/redux/slices/authSlice";
import { authAPI } from "@/lib/api/auth";

// Define page configurations for different dashboard pages
type PageConfig = {
  title?: string;
  description: string;
  getTitle?: (context: { displayName: string }) => string;
};

const pageConfigs: Record<string, PageConfig> = {
  "/dashboard": {
    description: "Get Started with AI-powered essay evaluation",
    getTitle: ({ displayName }) => {
      const trimmedName = displayName.trim();
      if (!trimmedName) {
        return "Welcome to Aghaai AI!";
      }
      return `Welcome to Aghaai AI, ${trimmedName}!`;
    },
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
   "/essay-results": {
    title: "Essay Evaluation Results",
    description: "Comprehensive AI-Powered feedback on your essay ",
  },
  "/profile-settings": {
    title: "Profile Settings",
    description: "Manage your personal details and account preferences",
  },
  "/history": {
    title: "Essay History",
    description: "View your previous essays and feedback",
  },
};

const DashboardHeaderWithSidebar = () => {
  const { setIsMobileOpen, isMobileOpen } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { userInfo } = useUserInfo();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear Redux state and localStorage
      dispatch(logout());
      localStorage.removeItem('_aT');
      localStorage.removeItem('_rT');
      localStorage.removeItem('user');
      router.push('/');
    }
  };

  // Get current page config or default to dashboard
  const currentPage =
    pageConfigs[pathname as keyof typeof pageConfigs] ||
    pageConfigs["/dashboard"];

  const displayName =
    (userInfo?.name ?? user?.name ?? "").trim();
  const headerTitle = currentPage.getTitle
    ? currentPage.getTitle({ displayName })
    : currentPage.title ?? "";
  const headerDescription = currentPage.description;

  const email = userInfo?.email ?? user?.email ?? "";
  const tokens = userInfo?.tokens;
  const avatarSrc = userInfo?.avatar || "/assets/avatar.jpg";
  const avatarIsRemote = userInfo?.avatar
    ? userInfo.avatar.startsWith("http")
    : false;

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
              {headerTitle}
            </h1>
            <p className="text-gray-600 mt-1 text-base">
              {headerDescription}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Tokens - Always visible */}
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-xs font-medium">
              <Coins />
            </span>
            <span className="text-sm font-medium">
              {typeof tokens === "number" ? `${tokens} Tokens` : "Tokens"}
            </span>
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
                src={avatarSrc}
                alt="User Avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                unoptimized={avatarIsRemote}
              />
            </button>

            {/* Dropdown Menu - Shows on all screens */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-400 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={avatarSrc}
                        alt="User Avatar"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        unoptimized={avatarIsRemote}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {displayName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {/* Buy more tokens - Only on mobile/tablet */}
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      // Handle buy more action
                    }}
                    className="lg:hidden w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                  >
                    <Coins className="w-4 h-4" />
                    <span>Buy more tokens</span>
                  </button>

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
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
