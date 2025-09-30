import { CheckIcon, XIcon } from "lucide-react";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { PricingPlansSection } from "@/components/LandingPage/sections/DashboardHero";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";

const Plan = () => {
  const features = [
    {
      name: "Essay Submissions",
      starter: "2/month",
      plus: "Unlimited",
      pro: "Unlimited",
    },
    {
      name: "AI Essay Feedback",
      starter: "Basic",
      plus: "Advanced",
      pro: "Advanced + Insights",
    },
    { name: "Mock Tests Access", starter: false, plus: true, pro: true },
    { name: "Live Sessions", starter: false, plus: true, pro: true },
    { name: "1-on-1 Mentor Support", starter: false, plus: true, pro: true },
    { name: "Personalized Study Plan", starter: false, plus: false, pro: true },
    {
      name: "Examiner Feedback",
      starter: false,
      plus: { text: "Limited Access" },
      pro: { text: "Full Support" },
    },
    {
      name: "Downloadable Resources",
      starter: { icon: true, text: "Basic" },
      plus: { icon: true, text: "Full" },
      pro: { icon: true, text: "Premium" },
    },
    { name: "Custom Dashboard Features", starter: true, plus: true, pro: true },
    {
      name: "Price",
      starter: "Free",
      plus: "PKR 2,500/month",
      pro: "PKR 6,000/month",
    },
  ];

  // Helper function to render cell content based on value type
  const renderCellContent = (value: string | boolean | { icon?: boolean; text?: string }) => {
    if (value === true) {
      return <CheckIcon className="w-5 h-5 md:w-7 md:h-7 mx-auto text-[#22C55E]" />;
    } else if (value === false) {
      return <XIcon className="w-5 h-5 md:w-7 md:h-7 mx-auto text-[#EF4444]" />;
    } else if (typeof value === "object" && value !== null) {
      return (
        <div className="flex items-center justify-center gap-1 md:gap-2">
          {value.icon && <CheckIcon className="w-4 h-4 md:w-6 md:h-6" />}
          {value.text && (
            <span className="text-sub-text text-center text-sm md:text-base">
              {value.text}
            </span>
          )}
        </div>
      );
    } else {
      return (
        <span className="text-sub-text text-center text-sm md:text-base">
          {value}
        </span>
      );
    }
  };


  return (
    <LayoutWrapper className="mb-8 md:mb-20">
      {/* <PricingPlansSection /> */}

      <h2 className="text-center mb-8 md:mb-12 text-2xl md:text-4xl font-semibold mt-8 md:mt-20">
        Plans Comparison Table
      </h2>

      <div className="overflow-x-auto">
        <Table className="min-w-[600px] md:min-w-full">
          <TableHeader className="bg-[#E5E7EB] border-none">
            <TableRow className="border-none text-lg md:text-2xl font-light">
              <TableHead className="py-3 px-4 md:py-5 md:px-9">
                Features
              </TableHead>
              <TableHead className="py-3 px-4 md:py-5 md:px-9 text-center">
                Starter (Free)
              </TableHead>
              <TableHead className="py-3 px-4 md:py-5 md:px-9 text-center">
                Plus (Standard)
              </TableHead>
              <TableHead className="py-3 px-4 md:py-5 md:px-9 text-center">
                Pro (Advanced)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature, index) => (
              <TableRow
                key={`feature-${index}`}
                className={index % 2 === 1 ? "bg-[#E5E7EB] border-none" : "border-none"}
              >
                <TableCell className="py-2 px-4 md:py-3 md:px-9 text-[#6B7280] text-sm md:text-lg font-medium">
                  {feature.name}
                </TableCell>
                <TableCell className="py-2 px-4 md:py-3 md:px-9 text-center text-[#6B7280] text-sm md:text-lg">
                  {renderCellContent(feature.starter)}
                </TableCell>
                <TableCell className="py-2 px-4 md:py-3 md:px-9 text-center text-[#6B7280] text-sm md:text-lg">
                  {renderCellContent(feature.plus)}
                </TableCell>
                <TableCell className="py-2 px-4 md:py-3 md:px-9 text-center text-[#6B7280] text-sm md:text-lg">
                  {renderCellContent(feature.pro)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </LayoutWrapper>
  );
}

export default Plan;