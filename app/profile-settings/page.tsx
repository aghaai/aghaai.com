"use client";

import React, { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { Camera, Info, KeyRound, User2, Eye, EyeOff, Plus } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileUpdateSuccessDialog } from "@/components/dialogs/ProfileUpdateSuccessDialog";
import { PasswordSuccessDialog } from "@/components/dialogs/PasswordSuccessDialog";
import ErrorDialog from "@/components/dialogs/ErrorDialog";
import { useUserInfo } from "@/components/contexts/UserInfoContext";
import { userAPI } from "@/lib/api/user";

const ProfileSettingsPage = () => {
  const { userInfo, loading: userInfoLoading, refreshUserInfo } = useUserInfo();

  const [name, setName] = useState<string>(userInfo?.name ?? "");
  const [phoneNumber, setPhoneNumber] = useState<string>(
    userInfo?.phoneNumber ?? "",
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarObjectUrl, setAvatarObjectUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileStatus, setProfileStatus] = useState<
    | { type: "success" | "error"; message: string }
    | null
  >(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successDialogMessage, setSuccessDialogMessage] = useState<string>("");
  const isFormDisabled = profileLoading || userInfoLoading;
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<
    | { type: "error"; message: string }
    | null
  >(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errorDialogState, setErrorDialogState] = useState({
    open: false,
    title: "Error",
    message: "",
  });

  const showErrorDialog = (message: string, title = "Error") => {
    setErrorDialogState({
      open: true,
      title,
      message,
    });
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!userInfo) {
      return;
    }

    setName(userInfo.name ?? "");
    setPhoneNumber(userInfo.phoneNumber ?? "");

    if (avatarChanged) {
      return;
    }

    if (avatarObjectUrl) {
      URL.revokeObjectURL(avatarObjectUrl);
      setAvatarObjectUrl(null);
    }

    if (userInfo.avatar) {
      setAvatarPreview(userInfo.avatar);
    } else {
      setAvatarPreview(null);
    }

    setAvatarFile(null);
  }, [avatarChanged, avatarObjectUrl, userInfo]);

  useEffect(() => {
    return () => {
      if (avatarObjectUrl) {
        URL.revokeObjectURL(avatarObjectUrl);
      }
    };
  }, [avatarObjectUrl]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setProfileStatus(null);

    if (!file.type.startsWith("image/")) {
      setProfileStatus({
        type: "error",
        message: "Please select a valid image file.",
      });
      showErrorDialog("Please select a valid image file.", "Invalid Image");
      setAvatarFile(null);
      setAvatarChanged(false);
      event.target.value = "";
      return;
    }

    const maxFileSizeMb = 2;
    if (file.size > maxFileSizeMb * 1024 * 1024) {
      const message = `Image must be smaller than ${maxFileSizeMb}MB.`;
      setProfileStatus({
        type: "error",
        message,
      });
      showErrorDialog(message, "Image Too Large");
      setAvatarFile(null);
      setAvatarChanged(false);
      event.target.value = "";
      return;
    }

    let newObjectUrl: string | null = null;

    try {
      if (avatarObjectUrl) {
        URL.revokeObjectURL(avatarObjectUrl);
      }

      newObjectUrl = URL.createObjectURL(file);
      setAvatarPreview(newObjectUrl);
      setAvatarObjectUrl(newObjectUrl);
      setAvatarFile(file);
      setAvatarChanged(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We couldn't process that image. Please try again.";

      if (newObjectUrl) {
        URL.revokeObjectURL(newObjectUrl);
      }

      setAvatarPreview(userInfo?.avatar ?? null);
      setAvatarObjectUrl(null);
      setAvatarFile(null);
      setAvatarChanged(false);
      setProfileStatus({
        type: "error",
        message,
      });
      showErrorDialog(message, "Image Upload Failed");
      console.error("Error while processing avatar:", error);
    } finally {
      event.target.value = "";
    }
  };

  const handleProfileSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setProfileStatus(null);

    const trimmedName = name.trim();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedName) {
      setProfileStatus({
        type: "error",
        message: "Please enter your name before saving changes.",
      });
      showErrorDialog("Please enter your name before saving changes.");
      return;
    }

    setProfileLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", trimmedName);
      formData.append("phoneNumber", trimmedPhone);

      if (avatarChanged) {
        if (!avatarFile) {
          throw new Error("Unable to process the selected avatar. Please try again.");
        }
        formData.append("avatar", avatarFile);
      }

      const response = await userAPI.updateProfile(formData);

      const message =
        (typeof response?.data?.message === "string" && response.data.message) ||
        (typeof response?.message === "string" && response.message) ||
        "Profile updated successfully.";

      setProfileStatus(null);

      setSuccessDialogMessage(message);
      setSuccessDialogOpen(true);

  await refreshUserInfo({ silent: true });
  setAvatarChanged(false);
  setAvatarFile(null);
    } catch (error) {
      const message = isAxiosError(error)
        ? (error.response?.data?.data?.message as string | undefined) ||
          (error.response?.data?.message as string | undefined) ||
          error.message
        : error instanceof Error
          ? error.message
          : "Something went wrong while updating your profile.";

      setProfileStatus({
        type: "error",
        message: message ?? "Something went wrong while updating your profile.",
      });

      showErrorDialog(
        message ?? "Something went wrong while updating your profile.",
        "Profile Update Failed",
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setPasswordStatus(null);

    const trimmedOldPassword = oldPassword.trim();
    const trimmedNewPassword = newPassword.trim();

    if (!trimmedOldPassword || !trimmedNewPassword) {
      showErrorDialog(
        "Please fill in both password fields before saving.",
        "Password Update Failed",
      );
      return;
    }

    if (trimmedNewPassword.length < 8) {
      setPasswordStatus({
        type: "error",
        message: "New password must be at least 8 characters long.",
      });
      showErrorDialog(
        "New password must be at least 8 characters long.",
        "Password Update Failed",
      );
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await userAPI.updatePassword({
        oldPassword: trimmedOldPassword,
        newPassword: trimmedNewPassword,
      });

      const message =
        (typeof response?.data?.message === "string" && response.data.message) ||
        (typeof response?.message === "string" && response.message) ||
        "Password updated successfully.";

      setPasswordStatus(null);
      setPasswordDialogOpen(true);
      setOldPassword("");
      setNewPassword("");

      await refreshUserInfo({ silent: true });
      console.info(message);
    } catch (error) {
      const message = isAxiosError(error)
        ? (error.response?.data?.data?.message as string | undefined) ||
          (error.response?.data?.message as string | undefined) ||
          error.message
        : error instanceof Error
          ? error.message
          : "Something went wrong while updating your password.";

      setPasswordStatus({
        type: "error",
        message: message ?? "Something went wrong while updating your password.",
      });
      showErrorDialog(
        message ?? "Something went wrong while updating your password.",
        "Password Update Failed",
      );
    } finally {
      setPasswordLoading(false);
    }
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
                    // eslint-disable-next-line @next/next/no-img-element
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

              <form
                onSubmit={handleProfileSubmit}
                className="mt-6 rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="full-name"
                      className="text-sm font-medium text-slate-600"
                    >
                      Full Name
                    </label>
                    <Input
                      id="full-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter your full name"
                      className="h-12 rounded-xl border-slate-200 bg-[#F7F7F7] text-sm text-slate-700"
                        disabled={isFormDisabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="phone-number"
                      className="text-sm font-medium text-slate-600"
                    >
                      Phone Number
                    </label>
                    <Input
                      id="phone-number"
                      value={phoneNumber}
                      onChange={(event) => setPhoneNumber(event.target.value)}
                      placeholder="0321-1234567"
                      className="h-12 rounded-xl border-slate-200 bg-[#F7F7F7] text-sm text-slate-700"
                      disabled={isFormDisabled}
                    />
                  </div>
                </div>

                {profileStatus?.type === "error" ? (
                  <p className="mt-4 text-sm text-rose-600">
                    {profileStatus.message}
                  </p>
                ) : null}

                <div className="mt-6 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-[#1C6758] px-6 text-white hover:bg-[#155a4d]"
                    disabled={isFormDisabled}
                  >
                    {profileLoading ? "Saving..." : userInfoLoading ? "Loading..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </section>

            <section>
              <div className="flex items-center gap-3">
                <KeyRound className="h-7 w-7" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Change Password
                  </h2>
                </div>
              </div>

              <form
                onSubmit={handlePasswordSubmit}
                className="mt-6 rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                        type={showOldPassword ? "text" : "password"}
                        placeholder="Enter old password"
                        className="h-12 rounded-xl border-slate-200 bg-[#F8F9FB] pr-10 text-sm"
                        value={oldPassword}
                        onChange={(event) => setOldPassword(event.target.value)}
                        disabled={passwordLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword((previous) => !previous)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                        aria-label={showOldPassword ? "Hide old password" : "Show old password"}
                        aria-pressed={showOldPassword}
                        disabled={passwordLoading}
                      >
                        {showOldPassword ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
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
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        className="h-12 rounded-xl border-slate-200 bg-[#F8F9FB] pr-10 text-sm"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        disabled={passwordLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((previous) => !previous)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                        aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                        aria-pressed={showNewPassword}
                        disabled={passwordLoading}
                      >
                        {showNewPassword ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {passwordStatus?.type === "error" ? (
                  <p className="mt-4 text-sm text-rose-600">
                    {passwordStatus.message}
                  </p>
                ) : null}

                <div className="mt-6 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-[#1C6758] px-6 text-white hover:bg-[#155a4d]"
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? "Saving..." : "Save Password"}
                  </Button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </DashboardLayout>
      <ProfileUpdateSuccessDialog
        open={successDialogOpen}
        onOpenChange={(open) => {
          setSuccessDialogOpen(open);
          if (!open) {
            setSuccessDialogMessage("");
          }
        }}
        description={successDialogMessage || undefined}
      />
      <PasswordSuccessDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        onContinue={() => setPasswordDialogOpen(false)}
      />
      <ErrorDialog
        isOpen={errorDialogState.open}
        onClose={() =>
          setErrorDialogState((previous) => ({
            ...previous,
            open: false,
          }))
        }
        title={errorDialogState.title}
        message={errorDialogState.message}
      />
    </ProtectedRoute>
  );
};

export default ProfileSettingsPage;
