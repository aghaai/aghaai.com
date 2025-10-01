"use client";

import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Mail } from "lucide-react";
import { authAPI } from "@/lib/api/auth";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setCredentials } from "@/lib/redux/slices/authSlice";
import { clearTempRegistrationData } from "@/lib/redux/slices/registrationSlice";
import { ErrorDialog, SuccessDialog } from "./index";

interface EmailVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email?: string;
  onSuccessfulVerification?: () => void;
  isPasswordReset?: boolean; // New prop to distinguish between signup and password reset flows
}

export const EmailVerificationDialog = ({ open, onOpenChange, email = "yourname@gmail.com", onSuccessfulVerification, isPasswordReset = false }: EmailVerificationDialogProps) => {
  const dispatch = useAppDispatch();
  const tempData = useAppSelector((state) => state.registration.tempData);
  
  const [codes, setCodes] = useState(['', '', '', '', '', '']); // Changed to 6 digits
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });
  const [success, setSuccess] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (open && timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, open]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    
    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    // Auto-focus next input
    if (value && index < 5) {
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
    if (verificationCode.length !== 6) {
      setError({ show: true, message: "Please enter a valid 6-digit code" });
      return;
    }

    if (!tempData) {
      setError({ show: true, message: "Registration data not found. Please try again." });
      return;
    }

    setIsLoading(true);
    setError({ show: false, message: "" });

    try {
      const response = await authAPI.registerVerify({
        email: tempData.email,
        otp: verificationCode,
        name: tempData.name,
        password: tempData.password,
        phoneNumber: tempData.phoneNumber,
      });

      // Store authentication data in Redux
      dispatch(
        setCredentials({
          user: response.data.user,
          accessToken: response.data._aT,
          refreshToken: response.data._rT,
        })
      );

      // Clear temporary registration data
      dispatch(clearTempRegistrationData());

      // Show success message
      setSuccess({
        show: true,
        message: "Account created successfully! Welcome to Aghaai AI.",
      });

      // Close dialog and trigger success callback after a delay
      setTimeout(() => {
        setSuccess({ show: false, message: "" });
        onOpenChange(false);
        onSuccessfulVerification?.();
      }, 1500);
    } catch (err) {
      console.error("Verification failed:", err);
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error?.response?.data?.message || "Invalid verification code. Please try again.";
      setError({ show: true, message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError({ show: false, message: "" });

    try {
      await authAPI.resendOtp({ email: email || tempData?.email || "" });
      setSuccess({ show: true, message: "Verification code sent successfully!" });
      setTimer(60);
      setCanResend(false);
      setCodes(['', '', '', '', '', '']);
      setTimeout(() => {
        setSuccess({ show: false, message: "" });
        inputRefs.current[0]?.focus();
      }, 1500);
    } catch (err) {
      console.error("Resend OTP failed:", err);
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error?.response?.data?.message || "Failed to resend code. Please try again.";
      setError({ show: true, message: errorMessage });
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (open) {
      // Focus first input when dialog opens
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
      // Reset timer when dialog opens
      setTimer(60);
      setCanResend(false);
    } else {
      // Reset codes when dialog closes
      setCodes(['', '', '', '', '', '']);
    }
  }, [open]);

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
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">
              {isPasswordReset ? "Reset Password Verification" : "Verify Your Email"}
            </DialogTitle>
            <p className="text-sm text-gray-600 leading-relaxed px-4">
              We&apos;ve sent a 6-digit verification code to
              <br />
              <span className="font-semibold text-gray-900">{email}</span>
            </p>
          </DialogHeader>
          
          <div className="px-6 pb-6">
            <div className="flex justify-center gap-2 mb-6">
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

            {/* Timer and Resend */}
            <div className="text-center mb-4">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="text-sm text-[#1C6758] hover:underline font-medium disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resend Code"}
                </button>
              ) : (
                <p className="text-sm text-gray-600">
                  Resend code in <span className="font-semibold">{timer}s</span>
                </p>
              )}
            </div>

            <Button 
              onClick={handleVerification}
              disabled={isLoading || codes.some(code => !code)}
              className="w-full py-2.5 bg-[#1C6758] hover:bg-[#155a4d] text-white"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ErrorDialog
        isOpen={error.show}
        onClose={() => setError({ show: false, message: "" })}
        message={error.message}
      />

      <SuccessDialog
        isOpen={success.show}
        onClose={() => setSuccess({ show: false, message: "" })}
        message={success.message}
      />
    </>
  );
};