"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import TestWarningDialog from "@/components/dialogs/TestWarningDialog";

interface TestNavigationContextType {
  isTestActive: boolean;
  setTestActive: (active: boolean) => void;
  requestNavigation: (destination: string) => Promise<boolean>;
}

const TestNavigationContext = createContext<TestNavigationContextType | null>(
  null
);

export const useTestNavigation = () => {
  const context = useContext(TestNavigationContext);
  if (!context) {
    throw new Error(
      "useTestNavigation must be used within TestNavigationProvider"
    );
  }
  return context;
};

interface TestNavigationProviderProps {
  children: React.ReactNode;
}

export const TestNavigationProvider: React.FC<TestNavigationProviderProps> = ({
  children,
}) => {
  const [isTestActive, setIsTestActive] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [pendingDestination, setPendingDestination] = useState<string | null>(
    null
  );
  const router = useRouter();

  const setTestActive = useCallback((active: boolean) => {
    setIsTestActive(active);
  }, []);

  const requestNavigation = useCallback(
    (destination: string): Promise<boolean> => {
      return new Promise((resolve) => {
        if (!isTestActive) {
          // If test is not active, allow navigation immediately
          router.push(destination);
          resolve(true);
          return;
        }

        // If test is active, show warning dialog
        setPendingDestination(destination);
        setShowWarningDialog(true);

        // The promise will be resolved by the dialog handlers
        const checkInterval = setInterval(() => {
          if (!showWarningDialog) {
            clearInterval(checkInterval);
          }
        }, 100);
      });
    },
    [isTestActive, router, showWarningDialog]
  );

  const handleStayOnTest = () => {
    setShowWarningDialog(false);
    setPendingDestination(null);
  };

  const handleLeaveTest = () => {
    setShowWarningDialog(false);
    setIsTestActive(false);

    // Clear test data from session storage
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("selectedTopic");
      sessionStorage.removeItem("selectedTopicTitle");
      sessionStorage.removeItem("essayMethod");
    }

    // Navigate to pending destination
    if (pendingDestination) {
      router.push(pendingDestination);
      setPendingDestination(null);
    }
  };

  return (
    <TestNavigationContext.Provider
      value={{
        isTestActive,
        setTestActive,
        requestNavigation,
      }}
    >
      {children}
      <TestWarningDialog
        isOpen={showWarningDialog}
        onCancel={handleStayOnTest}
        onConfirm={handleLeaveTest}
      />
    </TestNavigationContext.Provider>
  );
};
