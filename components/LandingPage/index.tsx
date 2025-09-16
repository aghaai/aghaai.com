import React from "react";
import { AboutSection } from "./sections/AboutSection";
import { BlogSection } from "./sections/BlogSection";
import { CssExamSection } from "./sections/CssExamSection";
import { KeyFeaturesSection } from "./sections/KeyFeaturesSection";
import { PricingPlansSection } from "./sections/PricingPlansSection";
import { ReportsSection } from "./sections/ReportsSection";
import { StudentsAndTeachersSection } from "./sections/StudentsAndTeachersSection";
import { SubscriptionSection } from "./sections/SubscriptionSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import CTASection from "./sections/CssJourney";
import HeroSection from "./sections/HeroSection";

export const LandingPage = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <div className="py-[5rem]">
        <CssExamSection />
        <KeyFeaturesSection />
        <ReportsSection />
        <StudentsAndTeachersSection />
        <PricingPlansSection />
        <TestimonialsSection />
        <BlogSection />
        <CTASection />
        <SubscriptionSection />
      </div>
    </>
  );
};