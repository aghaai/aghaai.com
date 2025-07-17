import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";

export const KeyFeaturesSection = () => {
  const features = [
    {
      title: "AI-Powered Study Support",
      description:
        "Get smart suggestions, instant answers, and feedback with our built-in AI assistant tailored for CSS.",
      image: "/Objects.png",
      imageClass: "w-28 sm:w-36 md:w-[144px] h-36 sm:h-48 md:h-[197px]",
    },
    {
      title: "Expert-Led Content",
      description:
        "Study materials and tips created by experienced CSS mentors and educators.",
      image: "/Group.png",
      imageClass: "w-36 sm:w-44 md:w-[224px] h-32 sm:h-44 md:h-[191px]",
    },
    {
      title: "Smart Progress Tracking",
      description:
        "Visual dashboards that help you monitor your study habits, strengths, and weak areas.",
      image: "/Frame.png",
      imageClass: "w-32 sm:w-44 md:w-[192px] h-32 sm:h-44 md:h-[195px]",
    },
  ];

  return (
    <LayoutWrapper className="w-full py-10 sm:py-16 px-3 sm:px-5 ">
      <div className="flex flex-col items-center mb-7 sm:mb-12">
        <h3 className="text-[#1C6758] text-base sm:text-lg font-medium">
          Key Features
        </h3>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          Why Aghaai
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card
            key={`feature-${index}`}
            className="bg-[#1C6758] rounded-xl overflow-hidden border-none h-full"
          >
            <CardContent className="flex flex-col items-center gap-4 sm:gap-5 p-4 sm:p-6 pt-8">
              {feature.image && (
                <Image
                  width={300}
                  height={300}
                  className={feature.imageClass}
                  alt={feature.title}
                  src={feature.image}
                />
              )}
              {!feature.image && (
                <div className={feature.imageClass} />
              )}

              <div className="flex flex-col items-center gap-2.5 w-full">
                <h3 className="font-medium text-white text-lg sm:text-xl md:text-2xl text-center leading-normal font-poppins w-full">
                  {feature.title}
                </h3>
                <p className="font-normal text-white text-sm sm:text-base text-center leading-normal font-poppins w-full">
                  {feature.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </LayoutWrapper>
  );
};
