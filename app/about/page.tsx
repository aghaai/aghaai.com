"use client";
import CTASection from "@/components/LandingPage/sections/CssJourney";
import { LogoSection } from "@/components/LandingPage/sections/LogoSection";
import { MentorsSection } from "@/components/LandingPage/sections/MentorsSection";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";
import Image from "next/image";
import React, { useState } from "react";
import {
  LoginDialog,
  SignUpDialog,
  EmailVerificationDialog,
  ForgotPasswordDialog,
  CreatePasswordDialog,
  PasswordSuccessDialog,
} from "@/components/dialogs";

const AboutPage = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isCreatePasswordOpen, setIsCreatePasswordOpen] = useState(false);
  const [isPasswordSuccessOpen, setIsPasswordSuccessOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsSignUpOpen(false);
    setIsForgotPasswordOpen(false);
  };

  const openSignUp = () => {
    setIsSignUpOpen(true);
    setIsLoginOpen(false);
  };

  const openVerification = (email: string) => {
    setUserEmail(email);
    setIsVerificationOpen(true);
    setIsSignUpOpen(false);
  };

  const openForgotPassword = () => {
    setIsForgotPasswordOpen(true);
    setIsLoginOpen(false);
  };

  const openCreatePassword = () => {
    setIsCreatePasswordOpen(true);
    setIsForgotPasswordOpen(false);
  };

  const openPasswordSuccess = () => {
    setIsPasswordSuccessOpen(true);
    setIsCreatePasswordOpen(false);
  };

  const closeAllDialogs = () => {
    setIsLoginOpen(false);
    setIsSignUpOpen(false);
    setIsVerificationOpen(false);
    setIsForgotPasswordOpen(false);
    setIsCreatePasswordOpen(false);
    setIsPasswordSuccessOpen(false);
  };

  return (
    <>
      <div className="bg-[#1C6758] text-white">
        <h2 className="text-center text-xl xs:text-2xl sm:text-3xl md:text-[32px] lg:text-[34px] xl:text-[36px] font-semibold py-6 xs:py-8 sm:py-10 md:py-12 px-4 xs:px-6">
          About Us
        </h2>
      </div>
      <LayoutWrapper>
        <section className="pt-6 sm:pt-8">
          <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-0 py-6 xs:py-8 sm:py-10 md:py-12 lg:py-14 grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-8 sm:gap-10 items-center">
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <h3 className="text-lg xs:text-xl sm:text-[22px] md:text-[24px] lg:text-[26px] xl:text-[28px] font-semibold text-slate-900 mb-2 xs:mb-3 leading-tight">
                Our Role in CSS Essay Preparation
              </h3>
              <p className="text-slate-600 text-xs xs:text-sm sm:text-base leading-5 xs:leading-6 sm:leading-7 max-w-2xl mx-auto lg:mx-0">
                The CSS exam is one of the most competitive and challenging
                assessments in Pakistan, and the essay paper often plays the
                most decisive role. A strong essay demonstrates not just
                language skills but also clarity of thought, argument strength,
                and analytical ability. Many aspirants struggle with this paper,
                making it the key factor that determines success or failure.
              </p>
            </div>

            <div className="order-1 lg:order-2 lg:justify-self-end w-full max-w-sm xs:max-w-md sm:max-w-lg md:max-w-xl lg:max-w-none mx-auto lg:mx-0">
              <Image
                src="/about/img1.svg"
                alt="Group studying around a laptop"
                width={1040}
                height={700}
                className="w-full h-auto block rounded-lg xs:rounded-xl sm:rounded-2xl"
                priority
              />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-0 py-3 xs:py-4 sm:py-5 md:py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-8 sm:gap-10 items-center">
            <div className="lg:justify-self-start w-full max-w-sm xs:max-w-md sm:max-w-lg md:max-w-xl lg:max-w-none mx-auto lg:mx-0 order-1">
              <Image
                src="/about/img2.svg"
                alt="Students collaborating at desk"
                width={1040}
                height={700}
                className="w-full h-auto block rounded-lg xs:rounded-xl sm:rounded-2xl"
              />
            </div>

            <div className="order-2 text-center lg:text-left">
              <h3 className="text-lg xs:text-xl sm:text-[22px] md:text-[24px] lg:text-[26px] xl:text-[28px] font-semibold text-slate-900 mb-2 xs:mb-3 leading-tight">
                How We Support You
              </h3>
              <p className="text-slate-600 text-xs xs:text-sm sm:text-base leading-5 xs:leading-6 sm:leading-7 max-w-2xl mx-auto lg:mx-0">
                We are committed to helping candidates prepare effectively for
                the essay by providing structured evaluation, constructive
                feedback, and clear guidance. Our focus is on building the
                skills that matter most in the exam—argument development,
                organization, and language accuracy—so aspirants can approach
                the essay paper with confidence.
              </p>
            </div>
          </div>
        </section>
      </LayoutWrapper>

      <LogoSection />

      <div className="bg-gradient-to-r from-[#1C6758] to-[#111827] py-6 xs:py-8 sm:py-10 lg:py-12 mb-8 xs:mb-12 sm:mb-16 md:mb-20">
        <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-0 text-white flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 xs:gap-8 lg:gap-0">
          {/* Mission text */}
          <div className="mb-4 xs:mb-6 lg:mb-0 lg:w-full xl:w-2/5 text-center lg:text-left">
            <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-semibold mb-2 xs:mb-3">
              Our Mission
            </h3>
            <p className="text-xs xs:text-sm sm:text-base leading-5 xs:leading-6 sm:leading-7 text-center lg:text-left mt-2 xs:mt-3 sm:mt-4 lg:mt-5 max-w-2xl mx-auto lg:mx-0">
              Our mission is to simplify and revolutionize CSS preparation
              through technology and personalized learning. We aim to make
              high-quality resources accessible for every student—regardless of
              background—so that no talent goes to waste.
            </p>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 xs:gap-6 sm:gap-8 lg:gap-6 xl:gap-8 2xl:gap-10 lg:w-full xl:w-1/2">
            <div className="text-center border-r px-2 xs:px-3 sm:px-4 md:px-5 border-gray-400">
              <div className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold">
                5,000+
              </div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-gray-200 mt-1">
                users
              </div>
            </div>
            <div className="text-center border-r px-2 xs:px-3 sm:px-4 md:px-5 border-gray-400">
              <div className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold">
                100+
              </div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-gray-200 mt-1 leading-tight">
                evaluated essays
              </div>
            </div>
            <div className="text-center px-2 xs:px-3 sm:px-4 md:px-5">
              <div className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold">
                100%
              </div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-gray-200 mt-1 leading-tight">
                syllabus coverage
              </div>
            </div>
          </div>
        </div>
      </div>

      <MentorsSection />
      <div className="-mt-6 xs:-mt-8 sm:-mt-10">
        <CTASection onStartJourney={openLogin} />
      </div>

      {/* Auth Dialogs */}
      <LoginDialog
        open={isLoginOpen}
        onOpenChange={(open) => !open && closeAllDialogs()}
        onSwitchToSignUp={openSignUp}
        onForgotPassword={openForgotPassword}
        onSuccessfulLogin={closeAllDialogs}
      />
      <SignUpDialog
        open={isSignUpOpen}
        onOpenChange={(open) => !open && closeAllDialogs()}
        onSwitchToLogin={openLogin}
        onSuccessfulSignUp={(email) => openVerification(email)}
      />
      <EmailVerificationDialog
        open={isVerificationOpen}
        onOpenChange={(open) => !open && closeAllDialogs()}
        email={userEmail}
        onSuccessfulVerification={closeAllDialogs}
        isPasswordReset={false}
      />
      <ForgotPasswordDialog
        open={isForgotPasswordOpen}
        onOpenChange={(open) => !open && closeAllDialogs()}
        onEmailSent={(email) => {
          setUserEmail(email);
          openCreatePassword();
        }}
      />
      <CreatePasswordDialog
        open={isCreatePasswordOpen}
        onOpenChange={(open) => !open && closeAllDialogs()}
        email={userEmail}
        onPasswordCreated={openPasswordSuccess}
      />
      <PasswordSuccessDialog
        open={isPasswordSuccessOpen}
        onOpenChange={(open) => !open && closeAllDialogs()}
        onContinue={openLogin}
      />
    </>
  );
};

export default AboutPage;
