"use client";

import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface EmailVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email?: string;
  onSuccessfulVerification?: () => void;
  isPasswordReset?: boolean; // New prop to distinguish between signup and password reset flows
}

export const EmailVerificationDialog = ({ open, onOpenChange, email = "yourname@gmail.com", onSuccessfulVerification, isPasswordReset = false }: EmailVerificationDialogProps) => {
  const [codes, setCodes] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerification = async () => {
    const verificationCode = codes.join('');
    if (verificationCode.length !== 4) return;

    setIsLoading(true);
    try {
      // Handle verification logic here
      console.log("Verify code:", verificationCode);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call success callback
      onSuccessfulVerification?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    // Handle resend code logic
    console.log("Resend verification code");
    setCodes(['', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  useEffect(() => {
    if (open) {
      // Focus first input when dialog opens
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [open]);

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
            {isPasswordReset ? "Reset Password Verification" : "Email Verification"}
          </DialogTitle>
          <p className="text-sm text-gray-600">
            We sent the code to {email}
          </p>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          <div className="flex justify-center gap-3 mb-6">
            {codes.map((code, index) => (
              <Input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={code}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-200 focus:border-[#1C6758] rounded-lg"
              />
            ))}
          </div>

          <Button 
            onClick={handleVerification}
            disabled={isLoading || codes.some(code => !code)}
            className="w-full py-2.5 bg-[#1C6758] hover:bg-[#155a4d] text-white mb-4"
          >
            {isLoading ? "Verifying..." : "Verification"}
          </Button>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Don&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                className="text-[#1C6758] hover:underline font-medium"
              >
                Resend Code
              </button>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};