"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, X } from "lucide-react";
import { authAPI } from "@/lib/api/auth";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setTempRegistrationData } from "@/lib/redux/slices/registrationSlice";
import { ErrorDialog, SuccessDialog } from "./index";

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin?: () => void;
  onSuccessfulSignUp?: (email: string, name: string) => void;
}

export const SignUpDialog = ({ open, onOpenChange, onSwitchToLogin, onSuccessfulSignUp }: SignUpDialogProps) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ show: boolean; message: string }>({ show: false, message: "" });
  const [success, setSuccess] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError({ show: false, message: "" });
    
    try {
      // Step 1: Request OTP by sending email
      await authAPI.registerRequest({ email: formData.email });
      
      // Store temporary registration data in Redux
      dispatch(setTempRegistrationData({
        email: formData.email,
        name: formData.fullName,
        password: formData.password,
        phoneNumber: formData.phone,
      }));
      
      // Show success dialog
      setSuccess({ 
        show: true, 
        message: `Verification code has been sent to ${formData.email}. Please check your inbox.` 
      });
    } catch (err) {
      console.error("Sign up failed:", err);
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error?.response?.data?.message || "Failed to send verification code. Please try again.";
      setError({ show: true, message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setSuccess({ show: false, message: "" });
    // Close signup dialog and open email verification dialog
    onOpenChange(false);
    onSuccessfulSignUp?.(formData.email, formData.fullName);
  };

  const handleSwitchToLogin = () => {
    onSwitchToLogin?.();
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

          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-xl font-semibold text-gray-900 mb-1">
              Create Your Account
            </DialogTitle>
            <p className="text-sm text-gray-600">
              Join us today and get started in just a few steps.
            </p>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="Ubaid Ullah"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+92-2564847"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="user@gmail.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pr-10"
                  required
                  minLength={6}
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

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#1C6758] hover:bg-[#155a4d] text-white mt-6"
            >
              {isLoading ? "Sending verification code..." : "Create Account"}
            </Button>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={handleSwitchToLogin}
                  className="text-[#1C6758] hover:underline font-medium"
                >
                  Log In
                </button>
              </span>
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