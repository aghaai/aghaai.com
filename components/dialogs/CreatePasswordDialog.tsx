"use client";

import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, X } from "lucide-react";
import { authAPI } from "@/lib/api/auth";
import { ErrorDialog, SuccessDialog } from "./index";

interface CreatePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email?: string;
  onPasswordCreated?: () => void;
}

export const CreatePasswordDialog = ({ open, onOpenChange, email = "", onPasswordCreated }: CreatePasswordDialogProps) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<{ show: boolean; message: string }>({ show: false, message: "" });
  const [success, setSuccess] = useState<{ show: boolean; message: string }>({ show: false, message: "" });
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

  useEffect(() => {
    if (open) {
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
    }
  }, [open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({ show: false, message: "" });

    const otpCode = otp.join('');
    
    // Validation
    if (otpCode.length !== 6) {
      setError({ show: true, message: "Please enter a valid 6-digit OTP" });
      return;
    }

    if (formData.password.length < 6) {
      setError({ show: true, message: "Password must be at least 6 characters long" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError({ show: true, message: "Passwords do not match" });
      return;
    }

    setIsLoading(true);
    
    try {
      // Call forgot password verify API
      await authAPI.forgotPasswordVerify({
        email,
        otp: otpCode,
        newPassword: formData.password
      });
      
      // Show success dialog
      setSuccess({
        show: true,
        message: "Password reset successful! You can now login with your new password."
      });

      // Close dialog and trigger success callback after delay
      setTimeout(() => {
        setSuccess({ show: false, message: "" });
        onOpenChange(false);
        onPasswordCreated?.();
      }, 1500);
    } catch (err) {
      console.error("Password creation failed:", err);
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error?.response?.data?.message || "Failed to reset password. Please try again.";
      setError({ show: true, message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setError({ show: false, message: "" });

    try {
      await authAPI.forgotPasswordRequest({ email });
      setSuccess({ show: true, message: "OTP resent successfully!" });
      setTimer(60);
      setCanResend(false);
      setTimeout(() => setSuccess({ show: false, message: "" }), 1500);
    } catch (err) {
      console.error("Resend OTP failed:", err);
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error?.response?.data?.message || "Failed to resend OTP. Please try again.";
      setError({ show: true, message: errorMessage });
    } finally {
      setIsResending(false);
    }
  };

  const handleClose = () => {
    setFormData({ password: "", confirmPassword: "" });
    setOtp(['', '', '', '', '', '']);
    setError({ show: false, message: "" });
    onOpenChange(false);
  };

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full mx-auto">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader className="text-center pb-2">
          <DialogTitle className="text-xl font-semibold text-gray-900 mb-1">
            Reset Your Password
          </DialogTitle>
          <p className="text-sm text-gray-600 leading-relaxed px-4">
            Enter the 6-digit OTP sent to <span className="font-semibold text-gray-900">{email}</span> and create your new password
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP
            </label>
            <div className="flex justify-center gap-2 mb-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-200 focus:border-[#1C6758] rounded-lg"
                />
              ))}
            </div>
            
            {/* Timer and Resend */}
            <div className="text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-sm text-[#1C6758] hover:underline font-medium disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resend OTP"}
                </button>
              ) : (
                <p className="text-sm text-gray-600">
                  Resend OTP in <span className="font-semibold">{timer}s</span>
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit"
            disabled={isLoading || !formData.password || !formData.confirmPassword || otp.join('').length !== 6}
            className="w-full py-2.5 bg-[#1C6758] hover:bg-[#155a4d] text-white mt-6"
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </Button>
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
      onClose={() => setSuccess({ show: false, message: "" })}
      message={success.message}
    />
    </>
  );
};