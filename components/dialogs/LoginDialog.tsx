"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, X } from "lucide-react";
import { authAPI } from "@/lib/api/auth";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setCredentials } from "@/lib/redux/slices/authSlice";
import type { User } from "@/lib/redux/slices/authSlice";
import { ErrorDialog } from "./index";
import { useRouter } from "next/navigation";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignUp?: () => void;
  onForgotPassword?: () => void;
  onSuccessfulLogin?: (name: string) => void;
}

type RawRecord = Record<string, unknown>;

const toRecord = (value: unknown): RawRecord | undefined =>
  typeof value === "object" && value !== null ? (value as RawRecord) : undefined;

const pickFirstString = (source: RawRecord | undefined, keys: string[]): string | undefined => {
  if (!source) {
    return undefined;
  }

  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }
  }

  return undefined;
};

const normalizeAuthPayload = (raw: unknown): { accessToken: string; refreshToken: string; user: User } => {
  const root = toRecord(raw);
  const dataLayer = toRecord(root?.data) ?? root;
  const tokensLayer = toRecord(dataLayer?.tokens) ?? dataLayer;

  const accessToken = pickFirstString(tokensLayer, ["_aT", "accessToken", "token", "access_token"]);
  const refreshToken = pickFirstString(tokensLayer, ["_rT", "refreshToken", "refresh_token"]);

  const userRecord =
    toRecord(dataLayer?.user) ??
    toRecord(dataLayer?.profile) ??
    toRecord(root?.user) ??
    toRecord(root?.profile);

  if (!accessToken || !refreshToken || !userRecord) {
    throw new Error("Unexpected response format from server.");
  }

  const normalizedUser: User = {
    id: typeof userRecord.id === "string" ? userRecord.id : "",
    name: typeof userRecord.name === "string" ? userRecord.name : "",
    email: typeof userRecord.email === "string" ? userRecord.email : "",
    role: typeof userRecord.role === "string" ? userRecord.role : "",
  };

  return {
    accessToken,
    refreshToken,
    user: normalizedUser,
  };
};

const extractValidationError = (errors: unknown): string | undefined => {
  if (!Array.isArray(errors)) {
    return undefined;
  }

  for (const item of errors) {
    if (typeof item === "string" && item.trim() !== "") {
      return item;
    }

    const record = toRecord(item);
    if (!record) {
      continue;
    }

    const field = typeof record.field === "string" ? record.field : undefined;
    const constraints = record.constraints;

    if (Array.isArray(constraints)) {
      const firstConstraint = constraints.find(
        (constraint) => typeof constraint === "string" && constraint.trim() !== ""
      );

      if (firstConstraint) {
        return field ? `${field}: ${firstConstraint}` : firstConstraint;
      }
    }
  }

  return undefined;
};

export const LoginDialog = ({ open, onOpenChange, onSwitchToSignUp, onForgotPassword, onSuccessfulLogin }: LoginDialogProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError({ show: true, message: "Please fill in all fields" });
      return;
    }
    
    setIsLoading(true);
    setError({ show: false, message: "" });
    
    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      const { accessToken, refreshToken, user } = normalizeAuthPayload(response);

      dispatch(
        setCredentials({
          user,
          accessToken,
          refreshToken,
        })
      );

      onOpenChange(false);
      onSuccessfulLogin?.(user.name || user.email || "");
      router.push("/dashboard");
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Login failed", err);
      }

      const error = err as {
        response?: { data?: { message?: string; error?: string; errors?: string[] } };
        message?: string;
      };

      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        extractValidationError(error?.response?.data?.errors);

      const errorMessage =
        serverMessage ||
        error?.message ||
        "Login failed. Please verify your email and password.";

      setError({ show: true, message: errorMessage });
    } finally {
      setIsLoading(false);
    }
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

      <ErrorDialog
        isOpen={error.show}
        onClose={() => setError({ show: false, message: "" })}
        message={error.message}
      />
    </>
  );
};