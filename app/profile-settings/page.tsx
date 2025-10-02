"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, Info, KeyRound, User2, EyeOff, Plus } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const personalInformation = [
  {
    label: "Full Name",
    placeholder: "Ubaid Ullah",
  },
  {
    label: "Phone Number",
    placeholder: "0321-1234567",
  },
];

const ProfileSettingsPage = () => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setAvatarPreview((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return URL.createObjectURL(file);
    });
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="bg-[#F7F7F7] py-6 sm:py-0">
          <div className="mx-auto w-full space-y-6">
            <section>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Camera className="h-7 w-7" />
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Profile Photo
                    </h2>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:gap-6">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleAvatarClick}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleAvatarClick();
                    }
                  }}
                  className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#D9D9D9]"
                >
                  {avatarPreview ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={avatarPreview}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User2 className="h-12 w-12" />
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90">
                      <Plus className="h-8 w-8" />
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <p className="text-center text-sm text-slate-500 sm:text-left">
                  Recommended: square image (PNG or JPG) smaller than 2MB.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3">
                <Info className="h-7 w-7" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Personal Information
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 bg-white p-6 rounded-2xl shadow-sm">
                {personalInformation.map((field, index) => (
                  <div key={field.label} className="space-y-2">
                    <label
                      htmlFor={`personal-${index}`}
                      className="text-sm font-medium text-slate-600"
                    >
                      {field.label}
                    </label>
                    <Input
                      id={`personal-${index}`}
                      defaultValue=""
                      placeholder={field.placeholder}
                      className="h-12 rounded-xl border-slate-200 bg-[#F7F7F7] text-sm text-slate-700"
                    />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3">
                <KeyRound className="h-7 w-7s" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Change Password
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 bg-white p-6 rounded-2xl shadow-sm">
                <div className="space-y-2">
                  <label
                    htmlFor="current-password"
                    className="text-sm font-medium text-slate-600"
                  >
                    Old Password
                  </label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Enter old password"
                      className="h-12 rounded-xl border-slate-200 bg-[#F8F9FB] pr-10 text-sm"
                    />
                    <EyeOff className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="new-password"
                    className="text-sm font-medium text-slate-600"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                      className="h-12 rounded-xl border-slate-200 bg-[#F8F9FB] pr-10 text-sm"
                    />
                    <EyeOff className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="confirm-password"
                    className="text-sm font-medium text-slate-600"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                      className="h-12 rounded-xl border-slate-200 bg-[#F8F9FB] pr-10 text-sm"
                    />
                    <EyeOff className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button className="bg-[#1C6758] px-6 text-white hover:bg-[#155a4d]">
                  Save Password
                </Button>
              </div>
            </section>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default ProfileSettingsPage;
