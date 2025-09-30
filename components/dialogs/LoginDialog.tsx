"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, X } from "lucide-react";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignUp?: () => void;
  onForgotPassword?: () => void;
  onSuccessfulLogin?: (name: string) => void;
}

export const LoginDialog = ({ open, onOpenChange, onSwitchToSignUp, onForgotPassword, onSuccessfulLogin }: LoginDialogProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Handle login logic here
      console.log("Login with:", formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Extract name from email (you can replace this with actual user data from API)
      const userName = formData.email.split('@')[0];
      onSuccessfulLogin?.(userName);
      onOpenChange(false);
    } catch (error) {
      console.error("Login failed:", error);
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

        <DialogHeader className="text-center pb-2">
          <DialogTitle className="text-xl font-semibold text-gray-900 mb-1">
            Welcome Back
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Sign in to your account to continue.
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
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

          <div className="text-right">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-[#1C6758] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <Button 
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#1C6758] hover:bg-[#155a4d] text-white mt-6"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="text-[#1C6758] hover:underline font-medium"
              >
                Sign up
              </button>
            </span>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};