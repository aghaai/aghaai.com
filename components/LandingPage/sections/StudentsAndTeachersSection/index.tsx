import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";

export const StudentsAndTeachersSection = () => {
  // Student features data
  const studentFeatures = [
    "Practice Questions",
    "Progress Tracking",
    "Lectures Notes & Materials",
    "Mock Exams",
    "Ask a Mentor",
  ];

  // Teacher features data
  const teacherFeatures = [
    "Class / Batch Management",
    "Content Uploads",
    "Performance Insight",
    "Mentor Support Role",
  ];

  return (
    <LayoutWrapper>
    <section className="relative w-full py-10 sm:py-16 flex flex-col items-center">
      {/* Section heading */}
      <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-medium text-center">
        For Students & Teachers
      </h2>

      {/* Section description */}
      <p className="w-full max-w-[546px] mt-4 sm:mt-6 mb-8 sm:mb-12 text-center text-gray-500 text-sm sm:text-base">
        Whether you&#39;re preparing to ace the CSS exam or guiding others to do
        so — CSS Edge is built for both learners and educators.
      </p>

      {/* Main content grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* For Students Data */}
        <div className="order-1 flex flex-col mb-6 lg:mb-0">
          <div className="flex flex-col items-center mb-5 sm:mb-6">
            <h3 className="text-xl sm:text-2xl md:text-[32px] font-normal text-text font-heading mb-4 sm:mb-6 text-center">
              For Students
            </h3>
            {/* Student features */}
            <div className="w-full max-w-[485px] space-y-3 sm:space-y-4">
              {studentFeatures.map((feature, index) => (
                <Button
                  key={`student-feature-${index}`}
                  className="w-full bg-[#1C6758] text-white rounded-md shadow-card-shadow p-3 sm:p-3.5 h-auto text-sm sm:text-lg"
                >
                  <span className="font-description">{feature}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* For Students Image */}
        <div className="order-2 flex justify-center items-center mb-6 lg:mb-0">
          <Image
            width={300}
            height={300}
            className="w-full max-w-md sm:max-w-md md:max-w-lg lg:max-w-2xl h-auto object-cover rounded-md lg:pr-[5rem]"
            alt="Student using CSS Edge platform"
            src="/Rectangle 85.png"
          />
        </div>

        {/* For Teachers Data */}
        <div className="order-3 lg:order-4 flex flex-col mb-6 lg:mb-0">
          <div className="flex flex-col items-center mb-5 sm:mb-6">
            <h3 className="text-xl sm:text-2xl md:text-[32px] font-normal text-text font-heading mb-4 sm:mb-6 text-center">
              For Teachers
            </h3>
            {/* Teacher features */}
            <div className="w-full max-w-[485px] space-y-3 sm:space-y-4">
              {teacherFeatures.map((feature, index) => (
                <Button
                  key={`teacher-feature-${index}`}
                  className="w-full bg-[#1C6758] text-white rounded-md shadow-card-shadow p-3 sm:p-3.5 h-auto text-sm sm:text-lg"
                >
                  <span className="font-description">{feature}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* For Teachers Image */}
        <div className="order-4 lg:order-3 flex justify-center items-center mb-6 lg:mb-0">
          <Image
            width={300}
            height={300}
            className="w-full max-w-md sm:max-w-sm md:max-w-lg lg:max-w-2xl h-auto object-cover rounded-md lg:pl-[5rem]"
            alt="Teacher using CSS Edge platform"
            src="/Rectangle 157.png"
          />
        </div>
      </div>
    </section>
    </LayoutWrapper>
  );
};
