import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";

export const PricingPlansSection = () => {
  // Define pricing plan data for easier mapping
  const pricingPlans = [
    {
      type: "Free",
      price: "$0",
      description:
        "Kickstart your CSS prep with core resources and limited AI access — ideal for beginners.",
      features: [
        "Access to core subjects",
        "Limited AI Assistant (4 queries/day)",
        "Sample mock tests",
        "Basic progress tracker",
        "Community access",
      ],
      isHighlighted: false,
    },
    {
      type: "Standard",
      price: "$10",
      description:
        "Boost your preparation with mock exams, analytics, and more AI support for smarter study.",
      features: [
        "All Starter features",
        "AI Assistant (9 queries/day)",
        "Full-length mock tests",
        "Subject-wise performance reports",
        "Study planner tool",
      ],
      isHighlighted: true,
    },
    {
      type: "Advanced",
      price: "$15",
      description:
        "Full access to everything — unlimited AI help, personalized progress tracking, and advanced prep tools.",
      features: [
        "All Plus features",
        "AI Assistant access (18 queries/day)",
        "Real-time progress dashboard",
        "Direct feedback from teachers",
        "Essay & paper evaluation",
      ],
      isHighlighted: false,
    },
  ];

  return (
    <LayoutWrapper>
    <section className="relative  mx-auto my-10 ">
      <div className="text-center mb-10 sm:mb-14">
        <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-medium">
          Choose the Right Plan for Your CSS Journey
        </h2>
        <p className="w-full max-w-2xl mx-auto text-center text-gray-500 text-sm sm:text-base">
          Whether you&#39;re just starting your CSS journey or preparing to
          master every subject, our student plans give you the tools you need —
          from AI-powered guidance to smart test prep
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 md:gap-5 lg:gap-10 justify-center items-stretch mt-8 sm:mt-[6rem]">
        {pricingPlans.map((plan, index) => (
          <Card
            key={`plan-${index}`}
            className={`relative w-full max-w-[560px] mx-auto md:mx-0 min-h-[480px] ${plan.isHighlighted
              ? "bg-[#1C6758] border-none text-white md:-mt-12 shadow-xl"
              : "bg-white border-none shadow-xl"
              } rounded-xl flex flex-col`}
          >
            <CardContent className="p-0 flex-1 flex flex-col">
              <div className="p-6 sm:p-7 flex-1 flex flex-col">
                <div
                  className={`font-sub-heading font-[number:var(--sub-heading-font-weight)] ${plan.isHighlighted ? "text-app-background" : "text-text"
                    } text-2xl`}
                >
                  ({plan.type})
                </div>

                <div
                  className={`mt-4 sm:mt-5 font-description ${plan.isHighlighted ? "text-app-background" : "text-sub-text"
                    } text-sm sm:text-base`}
                >
                  {plan.description}
                </div>

                <div className="mt-7 sm:mt-10 [font-family:'Poppins',Helvetica] font-normal text-2xl sm:text-[32px] tracking-[0] leading-8">
                  <span
                    className={`font-medium ${plan.isHighlighted ? "text-neutral-50" : "text-gray-900"
                      } leading-[0.1px]`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`${plan.isHighlighted ? "text-neutral-50" : "text-gray-900"
                      } text-2xl leading-[0.1px]`}
                  >
                    &nbsp;
                  </span>
                  <span
                    className={`${plan.isHighlighted ? "text-neutral-50" : "text-gray-900"
                      } text-sm sm:text-base font-description`}
                  >
                    / Month
                  </span>
                </div>

                <div className="mt-7 sm:mt-10 flex-1">
                  <ul className="list-disc pl-5 text-sm sm:text-base">
                    {plan.features.map((feature, idx) => (
                      <li key={`feature-${idx}`}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-6 sm:px-7 pb-6 sm:pb-7 mt-auto">
              <Button
                className={`w-full ${plan.isHighlighted
                  ? "bg-white text-gray-900"
                  : "bg-[#1C6758] text-white"
                  } rounded-md text-base font-medium`}
              >
                Choose Plan
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
    </LayoutWrapper>
  );
};
