"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FinishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FinishDialog = ({ open, onOpenChange }: FinishDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleContinueWriting = () => {
    onOpenChange(false);
  };

  const handleUpload = async () => {
    setIsLoading(true);
    
    try {
      // Handle upload logic here
      console.log("Upload and finish");
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onOpenChange(false);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full mx-auto">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">
            Are you sure you want to finish now?
          </DialogTitle>
          <p className="text-sm text-gray-600 leading-relaxed">
            Once you proceed to upload your 3 hour session will end, and you cannot return.
          </p>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          <div className="space-y-3">
            <Button 
              onClick={handleContinueWriting}
              variant="outline" 
              className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700"
            >
              Continue Writing
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={isLoading}
              className="w-full py-2.5 bg-[#1C6758] hover:bg-[#155a4d] text-white"
            >
              {isLoading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};