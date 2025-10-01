"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";

interface TestWarningDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const TestWarningDialog: React.FC<TestWarningDialogProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-md w-full mx-auto">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900 mb-2 text-center">
            Warning: Test in Progress
          </DialogTitle>
          <p className="text-sm text-gray-600 leading-relaxed text-center px-4">
            You are currently in the middle of an essay test. If you leave this
            page, your test will be{" "}
            <span className="font-semibold text-red-600">cancelled</span> and
            you will have to{" "}
            <span className="font-semibold">start from scratch</span>.
          </p>
        </DialogHeader>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mx-6 mb-4">
          <p className="text-sm text-amber-900">
            <strong>Note:</strong> All your progress, including the timer and
            any content you&apos;ve written, will be lost.
          </p>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 py-2.5 border hover:bg-gray-50 text-gray-700"
          >
            Stay on Test
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white"
          >
            Leave & Cancel Test
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestWarningDialog;
