import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";

export const AboutSection = () => {
  return (
    <LayoutWrapper className="pb-[6rem] pt-[2rem]">
      <div className="container flex flex-col md:flex-row items-center gap-6 md:gap-8 xl:gap-12">
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            className="hidden md:block w-full max-w-xs sm:max-w-sm md:max-w-full h-auto object-cover rounded-lg ml-0 md:-ml-[1.5rem]"
            width={300}
            height={300}
            alt="About CSS Edge"
            src="/about/about.png"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-5 sm:gap-6 px-1">
          <div className="flex flex-col gap-1 sm:gap-2">
            <span className="text-[#1C6758] text-base sm:text-lg font-medium">
              About us
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold">
              Your AI-Powered Mentor for CSS Success
            </h2>
          </div>

          <p className="text-gray-500 w-full max-w-lg text-sm sm:text-base text-justify">
            Agaahi is built to change the way CSS aspirants prepare. No more outdated notes, no more struggling without guidance, no more anxiety! With personalized study plans, instant examiner-style feedback, and 24/7 support, Agaahi turns confusion into confidence and guesswork into smart preparation. Whether you are in the heart of a big city or a small town far away, Agaahi gives you an equal opportunity to prepare and compete! It is a specialized learning application that is exam-focused, accessible, and affordable, ensuring that learning is within everyone&apos;s reach. We empower students to aim higher and achieve more! 
          </p>

           <Image
            className="block md:hidden w-full max-w-md h-auto object-cover rounded-lg ml-0"
            width={300}
            height={300}
            alt="About CSS Edge"
            src="/about/about.png"
          />

          <div className="mt-2 sm:mt-4">
            <Link href="/about">
              <Button className="w-[8rem] px-5 py-2 bg-[#1c6758] rounded-md hover:bg-[#145a47] transition  sm:w-[10rem] text-white focus:ring-2 focus:ring-[#1c6758] focus:ring-offset-2">
                About Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};
