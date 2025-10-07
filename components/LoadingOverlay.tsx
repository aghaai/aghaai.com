"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isLoading: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center">
      <Loader2 className="h-16 w-16 animate-spin text-white drop-shadow-lg" />
    </div>
  );
};

export default LoadingOverlay;
