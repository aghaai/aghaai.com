"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, X } from "lucide-react";

interface PasswordSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue?: () => void;
}

export const PasswordSuccessDialog = ({ open, onOpenChange, onContinue }: PasswordSuccessDialogProps) => {
  const handleContinue = () => {
    onContinue?.();
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full mx-auto">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">
            Password Changed Successfully
          </DialogTitle>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your password has been updated successfully. You can now login with your new password.
          </p>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          <Button 
            onClick={handleContinue}
            className="w-full py-2.5 bg-[#1C6758] hover:bg-[#155a4d] text-white"
          >
            Continue to Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};