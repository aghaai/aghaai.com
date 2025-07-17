import { DownloadIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";

export const CssExamSection = () => {
  // Data for exam features
  const examFeatures = [
    {
      number: "1",
      title: "Eligibility:",
      description: "Bachelor's degree, Age 21-30",
    },
    {
      number: "2",
      title: "12 Papers:",
      description: "6 Compulsory + 6 Optional (600 + 600 marks)",
    },
    {
      number: "3",
      title: "Final Stage:",
      description: "Medical, Psychological, and Interview",
    },
    {
      number: "4",
      title: "Conducted By:",
      description: "Federal Public Service Commission (FPSC)",
    },
    {
      number: "5",
      title: "Join Services Like:",
      description: "PAS, PSP, FSP, IRS, etc.",
    },
  ];

  return (
    <LayoutWrapper>
    <section className="relative w-full bg-[#1C6758] rounded-2xl py-10 sm:py-14 md:py-16">
      <div className="flex flex-col md:flex-row h-full px-3 sm:px-8 md:px-16 gap-8 md:gap-0">
        {/* Left side - What is CSS Exam */}
        <div className="w-full md:w-[45%] flex flex-col justify-center items-center md:items-start mt-2 ">
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold text-center md:text-left">
            What is the CSS Exam?
          </h2>
          <p className="mt-6 md:mt-10 w-full md:w-[96%] text-white text-md sm:text-lg text-justify md:text-left">
            The Central Superior Services (CSS) Exam is Pakistan&apos;s top
            competitive test, conducted by FPSC, to select future leaders in
            civil services like Police, Foreign, and Administrative Services.
            It&apos;s your path to a powerful, respected career in public
            service.
          </p>
        </div>

        {/* Right side - Exam features */}
        <div className="w-full md:w-[55%] flex flex-col gap-4 md:ml-10 lg:ml-[56px] mt-6 md:mt-0">
          {examFeatures.map((feature, index) => (
            <div key={index} className="relative mb-5 md:mb-[13px] h-[70px]">
              <Card className="ml-0 md:ml-[17px] h-[54px] md:h-[47px] mt-3 rounded-full bg-[#FAFAFA] border-none shadow-md">
                <CardContent className="p-0 h-full flex items-center -ml-2  md:-ml-8 lg:-ml-2 px-1">
                  <div className="pl-[70px] md:pl-[89px] font-normal text-base leading-4 w-full">
                    <span className="font-bold text-gray-900 ">
                      {feature.title}
                    </span>
                    <span className="text-gray-900 leading-normal">
                      {" "}
                      {feature.description}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <div className="absolute w-[54px] lg:w-[60px] h-[54px] lg:h-[60px] top-0 left-0 bg-[#FFC14E] rounded-full shadow-[0px_2px_4px_#00000040] flex items-center justify-center mt-3 md:mt-[0.5rem] lg:mt-[0.25rem] md:ml-3  ">
                <span className="text-lg md:text-2xl font-semibold">
                  {feature.number}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Download syllabus button */}
      <Button
        variant="link"
        className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-app-background hover:cursor-pointer hover:no-underline hover:text-amber-300"
      >
        <DownloadIcon className="w-[21px] h-[21px] text-white " />
        <span className="font-normal text-base text-center text-white leading-[25.9px] whitespace-nowrap hover:text-amber-300">
          Download Complete Syllabus (PDF)
        </span>
      </Button>
    </section>
    </LayoutWrapper>
  );
};
