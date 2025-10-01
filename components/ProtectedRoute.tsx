"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, accessToken } = useAppSelector((state) => state.auth);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Check authentication on client side
    const checkAuth = () => {
      const storedToken = window.localStorage.getItem("_aT");

      // Check Redux state
      if (!isAuthenticated) {
        if (!storedToken) {
          router.replace("/");
          setIsCheckingAuth(false);
          return;
        }
      }

      // Double check if token exists
      if (!accessToken) {
        if (!storedToken) {
          router.replace("/");
          setIsCheckingAuth(false);
          return;
        }
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [isAuthenticated, accessToken, router]);

  // Show loading or nothing while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-[#1C6758] rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
};
