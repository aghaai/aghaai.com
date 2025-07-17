import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";

export const AboutSection = () => {
  return (
    <LayoutWrapper className="relative w-full py-10 -mt-[15rem] sm:-mt-10 sm:py-14 md:py-16 flex justify-center">
      <div className="container flex flex-col md:flex-row items-center gap-6 md:gap-8 xl:gap-12">
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            className="hidden md:block w-full max-w-xs sm:max-w-sm md:max-w-full h-auto object-cover rounded-lg ml-0 md:-ml-[1.5rem]"
            width={300}
            height={300}
            alt="About CSS Edge"
            src="/Rectangle 137.png"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-5 sm:gap-6 px-1">
          <div className="flex flex-col gap-1 sm:gap-2">
            <span className="text-[#1C6758] text-base sm:text-lg font-medium">
              About us
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold">
              What we do
            </h2>
          </div>

          <p className="text-gray-500 w-full max-w-lg text-sm sm:text-base text-justify">
            CSS Edge is a modern educational platform that empowers CSS
            aspirants, teachers, and administrators with AI-powered tools, smart
            dashboards, and real-time insights — making preparation smarter,
            faster, and more effective.
          </p>

           <Image
            className="block md:hidden w-full max-w-md h-auto object-cover rounded-lg ml-0"
            width={300}
            height={300}
            alt="About CSS Edge"
            src="/Rectangle 137.png"
          />

          <div className="mt-2 sm:mt-4">
            <Button className="w-[8rem] px-5 py-2 bg-[#1c6758] rounded-md hover:bg-[#145a47] transition  sm:w-[10rem] text-white focus:ring-2 focus:ring-[#1c6758] focus:ring-offset-2">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};
