import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";

export const ReportsSection = () => {
  // Report data for mapping
  const reports = [
    {
      title: "Essay Paper - 2023 Examiner Comments",
      tag: "Teacher Guide",
      icon: "/basil-document-solid.svg",
    },
    {
      title: "English Precis & Composition - Feedback Summary",
      tag: "Examiner Report",
      icon: "/basil-document-solid.svg",
    },
    {
      title: "General Science & Ability - Performance Overview",
      tag: "Examiner Report",
      icon: "/basil-document-solid.svg",
    },
    {
      title: "Essay Paper - 2023 Examiner Comments",
      tag: "Teacher Guide",
      icon: "/basil-document-solid.svg",
    },
  ];

  return (
    <LayoutWrapper className="flex flex-col items-center w-full py-8 sm:py-12 px-2 sm:px-4">
      <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-center">
        Expert CSS Reports & Insights
      </h2>

      <p className="w-full max-w-[812px] mt-4 sm:mt-6 mb-8 sm:mb-12 font-description text-sub-text text-center text-gray-500 text-sm sm:text-base">
        Access a curated collection of expert-reviewed reports based on past CSS
        papers. These reports reveal how examiners assess responses, highlight
        common mistakes, and provide examples of high-scoring answers — helping
        you align your preparation with real evaluation standards.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {reports.map((report, index) => (
          <Card
            key={index}
            className="w-full min-h-[290px] sm:min-h-[277px] bg-white rounded-lg border-none shadow-xl relative  flex"
          >
            <CardContent className="p-3 sm:p-0 flex flex-col items-center h-full w-full">
              <div className="absolute top-3 left-3">
                <Badge className="bg-[#FFC14E] py-1 px-2 rounded-md text-xs sm:text-sm">
                  {report.tag}
                </Badge>
              </div>

              <Image
                width={80}
                height={80}
                className="w-[83px] h-[83px] mt-12 sm:mt-[55px]"
                alt="Document icon"
                src="/iccon.png"
              />

              <div className="w-full max-w-xs min-h-12 mt-3 sm:mt-[9px] font-normal text-text text-sm sm:text-base text-center leading-6 p-2">
                {report.title}
              </div>

              <Button
                variant="outline"
                className="mt-auto mb-4 sm:mb-[30px] lg:mt-2 border-2 border-solid border-[#1c6758] hover:bg-[#145a47] hover:text-white bg-box-color text-primary-color w-full max-w-[180px]"
              >
                Download PDF
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button className="px-5 py-2 bg-[#1c6758] rounded-md hover:bg-[#145a47] transition w-full max-w-xs sm:w-[8rem] text-white focus:ring-2 focus:ring-[#1c6758] focus:ring-offset-2 mt-8 sm:mt-[2rem]">
        Load More
      </Button>
    </LayoutWrapper>
  );
};
