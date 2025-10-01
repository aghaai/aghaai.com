"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, X } from "lucide-react";
import { authAPI } from "@/lib/api/auth";
import { ErrorDialog, SuccessDialog } from "./index";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBackToLogin?: () => void;
  onEmailSent?: (email: string) => void;
}

export const ForgotPasswordDialog = ({ open, onOpenChange, onBackToLogin, onEmailSent }: ForgotPasswordDialogProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ show: boolean; message: string }>({ show: false, message: "" });
  const [success, setSuccess] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError({ show: false, message: "" });
    
    try {
      // Call forgot password API
      await authAPI.forgotPasswordRequest({ email });
      
      // Show success dialog
      setSuccess({ 
        show: true, 
        message: `Password reset OTP has been sent to ${email}. Please check your inbox.` 
      });
    } catch (err) {
      console.error("Password reset failed:", err);
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error?.response?.data?.message || "Failed to send reset code. Please try again.";
      setError({ show: true, message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setSuccess({ show: false, message: "" });
    // Close forgot password dialog and open create password dialog
    onOpenChange(false);
    onEmailSent?.(email);
  };

  return (
    <>
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
            Forgot Password
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Enter your email to reset password
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Enter your email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <Button 
            type="submit"
            disabled={isLoading || !email}
            className="w-full py-2.5 bg-[#1C6758] hover:bg-[#155a4d] text-white mt-6"
          >
            {isLoading ? "Sending..." : "Reset Password"}
          </Button>

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={onBackToLogin}
              className="flex items-center gap-2 text-sm text-[#1C6758] hover:underline font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <ErrorDialog
      isOpen={error.show}
      onClose={() => setError({ show: false, message: "" })}
      message={error.message}
    />

    <SuccessDialog
      isOpen={success.show}
      onClose={handleSuccessDialogClose}
      title="OTP Sent Successfully!"
      message={success.message}
    />
    </>
  );
};