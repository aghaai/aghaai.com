import React from "react";
import { AboutSection } from "./sections/AboutSection";
import { MentorsSection } from "./sections/MentorsSection";
import { CssExamSection } from "./sections/CssExamSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { LogoSection } from "./sections/LogoSection";
import CTASection from "./sections/CssJourney";
import HeroSection from "./sections/HeroSection";

export const LandingPage = () => {
  return (
    <>
      <HeroSection />
      <LogoSection />
      <AboutSection />
      <MentorsSection />
      <CssExamSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
};
