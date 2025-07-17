import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";

export const SubscriptionSection = () => {
  return (
    <LayoutWrapper className="-mb-[8rem]">
      <Card className="bg-[#FFC14E] rounded-xl p-8 md:p-6 lg:p-16 border-none mx-auto mt-16 relative overflow-x-hidden">

        <CardContent className="p-0 flex flex-col md:flex-row justify-between items-center text-center md:text-start md:items-start gap-8">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-4xl font-medium">
              Stay Ahead with Aghaai!
            </h2>

            <p className="max-w-[423px] font-description font-[number:var(--description-font-weight)] text-sub-text text-[length:var(--description-font-size)] tracking-[var(--description-letter-spacing)] leading-[var(--description-line-height)] [font-style:var(--description-font-style)]">
              Subscribe to receive the latest updates on syllabus changes, exam
              strategies, AI tools, and free preparation resources — right in your
              inbox.
            </p>
          </div>

          <div className="flex items-center w-full md:w-[529px] h-[54px] rounded-lg mt-[3rem]">
            <div className="relative flex w-full h-full">
             <Input
  className="h-full px-5 py-2.5 bg-white border-none"
  placeholder="Enter your Email"
  autoComplete="off"
  suppressHydrationWarning
/>


              <Button className="absolute right-0 h-[40px] mt-[7px] mr-[7px] bg-[#1C6758] text-white rounded-md font-['Poppins',Helvetica] font-normal text-base">
                Subscribe
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </LayoutWrapper>
  );
};