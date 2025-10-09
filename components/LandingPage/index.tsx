"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AboutSection } from "./sections/AboutSection";
import { MentorsSection } from "./sections/MentorsSection";
import { CssExamSection } from "./sections/CssExamSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { LogoSection } from "./sections/LogoSection";
import CTASection from "./sections/CssJourney";
import HeroSection from "./sections/HeroSection";
import LoadingOverlay from "../LoadingOverlay";
import {
  LoginDialog,
  SignUpDialog,
  EmailVerificationDialog,
  ForgotPasswordDialog,
  CreatePasswordDialog,
  PasswordSuccessDialog,
} from "@/components/dialogs";

export const LandingPage = () => {
  const router = useRouter();

  // Dialog state management
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isPasswordResetFlow, setIsPasswordResetFlow] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Dialog handlers
  const openLogin = () => setActiveDialog("login");
  const openEmailVerification = (email: string, isPasswordReset = false) => {
    setUserEmail(email);
    setIsPasswordResetFlow(isPasswordReset);
    setActiveDialog("verification");
  };
  const openCreatePassword = () => setActiveDialog("createPassword");
  const openPasswordSuccess = () => setActiveDialog("passwordSuccess");

  const closeDialog = () => {
    setActiveDialog(null);
    setIsPasswordResetFlow(false);
  };

  // Auth flow handlers
  const handleSuccessfulSignUp = (email: string, name: string) => {
    setUserEmail(email);
    setUserName(name);
    openEmailVerification(email, false);
  };

  const handleSuccessfulVerification = () => {
    if (isPasswordResetFlow) {
      openCreatePassword();
    } else {
      // Mark as new registration to show welcome dialog
      setIsRedirecting(true);
      sessionStorage.setItem("justRegistered", "true");
      sessionStorage.setItem("userName", userName);
      // Small delay to show loading state
      setTimeout(() => {
        router.push("/dashboard");
      }, 300);
    }
  };

  const handleSuccessfulLogin = (name: string) => {
    setUserName(name);
    setIsRedirecting(true);
    // Don't set justLoggedIn for returning users
    // Small delay to show loading state
    setTimeout(() => {
      router.push("/dashboard");
    }, 300);
  };

  const handleForgotPasswordEmailSent = (email: string) => {
    setUserEmail(email);
    openCreatePassword();
  };

  const handlePasswordCreated = () => {
    openPasswordSuccess();
  };

  const handlePasswordSuccessComplete = () => {
    setActiveDialog("login");
  };

  return (
    <>
      {/* Loading Overlay */}
      <LoadingOverlay isLoading={isRedirecting} />

      {/* Landing Page Sections */}
      <HeroSection onStartJourney={openLogin} />
      <LogoSection />
      <AboutSection />
      <MentorsSection />
      <CssExamSection />
      <TestimonialsSection />
      <CTASection onStartJourney={openLogin} />

      {/* Dialog Components */}
      <LoginDialog
        open={activeDialog === "login"}
        onOpenChange={(open) => !open && closeDialog()}
        onSwitchToSignUp={() => setActiveDialog("signup")}
        onForgotPassword={() => setActiveDialog("forgot")}
        onSuccessfulLogin={handleSuccessfulLogin}
      />

      <SignUpDialog
        open={activeDialog === "signup"}
        onOpenChange={(open) => !open && closeDialog()}
        onSwitchToLogin={() => setActiveDialog("login")}
        onSuccessfulSignUp={handleSuccessfulSignUp}
      />

      <EmailVerificationDialog
        open={activeDialog === "verification"}
        onOpenChange={(open) => !open && closeDialog()}
        email={userEmail}
        onSuccessfulVerification={handleSuccessfulVerification}
        isPasswordReset={isPasswordResetFlow}
      />

      <ForgotPasswordDialog
        open={activeDialog === "forgot"}
        onOpenChange={(open) => !open && closeDialog()}
        onEmailSent={handleForgotPasswordEmailSent}
      />

      <CreatePasswordDialog
        open={activeDialog === "createPassword"}
        onOpenChange={(open) => !open && closeDialog()}
        email={userEmail}
        onPasswordCreated={handlePasswordCreated}
      />

      <PasswordSuccessDialog
        open={activeDialog === "passwordSuccess"}
        onOpenChange={(open) => !open && closeDialog()}
        onContinue={handlePasswordSuccessComplete}
      />
    </>
  );
};
