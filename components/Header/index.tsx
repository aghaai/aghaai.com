"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import LayoutWrapper from "../Wrapper/LayoutWrapper";
import {
  LoginDialog,
  SignUpDialog,
  EmailVerificationDialog,
  ForgotPasswordDialog,
  CreatePasswordDialog,
  PasswordSuccessDialog,
  WelcomeDialog
} from "@/components/dialogs";

const HeaderSection = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Check if user is on dashboard
  const isDashboard = pathname === '/dashboard';
  
  // Dialog state management
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isPasswordResetFlow, setIsPasswordResetFlow] = useState(false);

  // Dialog handlers
  const openLogin = () => setActiveDialog('login');
  const openSignUp = () => setActiveDialog('signup');
  const openEmailVerification = (email: string, isPasswordReset = false) => {
    setUserEmail(email);
    setIsPasswordResetFlow(isPasswordReset);
    setActiveDialog('verification');
  };
  const openCreatePassword = () => setActiveDialog('createPassword');
  const openPasswordSuccess = () => setActiveDialog('passwordSuccess');
  const openWelcome = (name: string) => {
    setUserName(name);
    setActiveDialog('welcome');
  };
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
      openWelcome(userName);
    }
  };

  const handleSuccessfulLogin = (name: string) => {
    setUserName(name);
    router.push('/dashboard');
  };

  const handleForgotPasswordEmailSent = (email: string) => {
    openEmailVerification(email, true); 
  };

  const handlePasswordCreated = () => {
    openPasswordSuccess();
  };

  const handlePasswordSuccessComplete = () => {
    setActiveDialog('login'); 
  };

  // Landing Page Header JSX Component  
  const LandingHeaderContent = () => (
    <LayoutWrapper>
      <header className="w-full h-[70px] sm:h-[80px] flex items-center justify-between px-4 sm:px-0">
        {/* Left: Logo */}
        <Link href="/" className="w-[80px] xs:w-[90px] sm:w-[110px] md:w-[130px] h-[50px] sm:h-[60px] flex items-center flex-shrink-0">
          <Image
            width={130}
            height={130}
            alt="Logo"
            src="/logo.png"
            className="object-contain w-full h-auto"
          />
        </Link>

        {/* Right: Login and Join for Free buttons */}
        <div className="flex items-center gap-2 xs:gap-3">
          <Button 
            onClick={openLogin}
            className="px-2 xs:px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 bg-transparent border-2 border-[#1c6758] text-[#1c6758] hover:bg-[#f5f5f5] font-medium text-xs xs:text-sm md:text-base whitespace-nowrap"
          >
            Login
          </Button>
          <Button 
            onClick={openSignUp}
            className="px-2 xs:px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 bg-[#1c6758] border-2 border-[#1c6758] text-white hover:bg-[#145549] font-medium text-xs xs:text-sm md:text-base whitespace-nowrap"
          >
            Join for Free
          </Button>
        </div>
      </header>
    </LayoutWrapper>
  );

  return (
    <>
      {/* Only render header for non-dashboard pages */}
      {!isDashboard && <LandingHeaderContent />}

      {/* Dialog Components */}
      <LoginDialog
        open={activeDialog === 'login'}
        onOpenChange={(open) => !open && closeDialog()}
        onSwitchToSignUp={() => setActiveDialog('signup')}
        onForgotPassword={() => setActiveDialog('forgot')}
        onSuccessfulLogin={handleSuccessfulLogin}
      />

      <SignUpDialog
        open={activeDialog === 'signup'}
        onOpenChange={(open) => !open && closeDialog()}
        onSwitchToLogin={() => setActiveDialog('login')}
        onSuccessfulSignUp={handleSuccessfulSignUp}
      />

      <EmailVerificationDialog
        open={activeDialog === 'verification'}
        onOpenChange={(open) => !open && closeDialog()}
        email={userEmail}
        isPasswordReset={isPasswordResetFlow}
        onSuccessfulVerification={handleSuccessfulVerification}
      />

      <ForgotPasswordDialog
        open={activeDialog === 'forgot'}
        onOpenChange={(open) => !open && closeDialog()}
        onBackToLogin={() => setActiveDialog('login')}
        onEmailSent={handleForgotPasswordEmailSent}
      />

      <CreatePasswordDialog
        open={activeDialog === 'createPassword'}
        onOpenChange={(open) => !open && closeDialog()}
        onPasswordCreated={handlePasswordCreated}
      />

      <PasswordSuccessDialog
        open={activeDialog === 'passwordSuccess'}
        onOpenChange={(open) => !open && closeDialog()}
        onContinue={handlePasswordSuccessComplete}
      />

      <WelcomeDialog
        open={activeDialog === 'welcome'}
        onOpenChange={(open) => !open && closeDialog()}
        userName={userName}
      />
    </>
  );
};

export default HeaderSection;