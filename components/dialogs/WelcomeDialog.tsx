"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName?: string;
}

export const WelcomeDialog = ({ open, onOpenChange, userName = "AI user" }: WelcomeDialogProps) => {
  const handleExploreDashboard = () => {
    console.log("Exploring dashboard");
    onOpenChange(false);
  };

  const handleStartFirstEssay = () => {
    console.log("Navigate to essay writing");
    onOpenChange(false);
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

        <DialogHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
              <Image
                src="/party.svg"
                alt="Aghaai Logo"
                width={32}
                height={32}
                className="w-16 h-16"
              />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900 mb-2 text-center">
            Welcome to your Dashboard, {userName}!
          </DialogTitle>
          <p className="text-sm text-gray-600 leading-relaxed text-center">
            Start improving your CSS English essays with AI-powered feedback
          </p>
        </DialogHeader>
        
        <div className="px-6 pb-6 space-y-3 flex gap-3">
          <Button 
            onClick={handleExploreDashboard}
            variant="outline" 
            className="w-full py-2.5 border hover:bg-gray-50 text-gray-700"
          >
            Explore Dashboard
          </Button>
          <Button 
            onClick={handleStartFirstEssay}
            className="w-full py-2.5 bg-[#1C6758] hover:bg-[#155a4d] text-white"
          >
            Start Your First Essay
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};