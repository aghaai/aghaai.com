"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, X } from "lucide-react";

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({
  isOpen,
  onClose,
  title = "Success",
  message,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full mx-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900 mb-2 text-center">
            {title}
          </DialogTitle>
          <p className="text-sm text-gray-600 leading-relaxed text-center px-4">
            {message}
          </p>
        </DialogHeader>

        <div className="px-6 pb-6 flex justify-center">
          <Button
            type="button"
            onClick={onClose}
            className="bg-[#1C6758] hover:bg-[#155a4d] text-white px-8 py-2.5"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
