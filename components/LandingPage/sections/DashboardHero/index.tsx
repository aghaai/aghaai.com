"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

const DashboardHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const router = useRouter();

  // Content variants that will change over time
  const contentVariants = [
    {
      id: 1,
      title: "Welcome to Your Essay Dashboard",
      description: "Start your journey with AI-powered writing evaluation",
      buttonText: "Get Started",
      image: "/cta/img1.svg",
      alt: "Essay Practice",
    },
    {
      id: 2,
      btn: "Instruction 1",
      title: "Write a structured essay with multiple styles",
      description:
        "Write a 2500–3000-word essay using exposition, argumentation, and narration.",
      buttonText: "Next",
      image: "/cta/img2.svg",
      alt: "AI Feedback",
    },
    {
      id: 3,
      btn: "Instruction 2",
      title: "Match question numbers correctly",
      description:
        "Write each answer in line with its question number in the paper.",
      buttonText: "Next",
      image: "/cta/img3.svg",
      alt: "Progress Tracking",
    },
    {
      id: 4,
      btn: "Instruction 3",
      title: "Avoid leaving blank pages",
      description:
        "Do not leave space between answers. Cross out all unused pages in your answer book.",
      buttonText: "Start Test",
      image: "/cta/img4.svg",
      alt: "Study Plans",
    },
  ];

  // Handle button click - progress to next slide or navigate to essay evaluation
  const handleButtonClick = () => {
    if (currentSlide === contentVariants.length - 1) {
      // Last slide - navigate to essay evaluation
      router.push("/essay-evaluation");
    } else {
      // Progress to next slide
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  };

  // Handle manual slide navigation via progress indicators
  const handleSlideChange = (index: number) => {
    if (index !== currentSlide) {
      setDirection(index > currentSlide ? 1 : -1);
      setCurrentSlide(index);
    }
  };

  const currentContent = contentVariants[currentSlide];

  // Slide variants for horizontal animation
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };
  return (
    <section className="pb-4 sm:pb-6 md:pb-8 lg:pb-10">
      {/* Outer banner */}
      <div
        className="
            mx-auto rounded-[16px] sm:rounded-[18px] md:rounded-[20px] lg:rounded-[22px]
            px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 
            py-6 sm:py-8 md:py-10 lg:py-12
            shadow-sm sm:shadow-md
            relative overflow-hidden
          "
        style={{
          backgroundColor: "#1F6B63",
          backgroundImage: `
              linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
            `,
          backgroundSize: "48px 48px, 48px 48px",
          backgroundPosition: "0 0, 0 0",
        }}
      >
        {/* Content grid */}
        <div className="grid items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 grid-cols-1 md:grid-cols-[2.5fr_0.8fr]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
              }}
              className="text-white"
            >
              {currentContent.btn && (
                <h2 className="font-medium text-md border rounded-xl w-fit px-3 border-[#FFC14E] mb-1">
                  {currentContent.btn}
                </h2>
              )}

              <h2 className="font-semibold tracking-[-0.01em] text-[20px] xs:text-[22px] sm:text-[26px] md:text-[30px] lg:text-[34px] xl:text-[36px] leading-tight">
                {currentContent.title}
              </h2>

              <p className="mt-2 sm:mt-3 md:mt-4 text-white/85 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
                {currentContent.description}
              </p>

              <button
                onClick={handleButtonClick}
                className="
                    mt-4 sm:mt-5 md:mt-6 inline-flex items-center justify-center
                    rounded-md px-3 sm:px-4 md:px-5 lg:px-6 
                    py-2 sm:py-2.5 md:py-3 
                    text-xs sm:text-sm md:text-[15px] lg:text-base font-semibold
                    bg-[#F2B94B] text-[#1F6B63]
                    hover:brightness-95 active:brightness-90
                    transition-all duration-200
                    min-w-[120px] sm:min-w-[140px] md:min-w-[160px]
                    cursor-pointer
                  "
              >
                {currentContent.buttonText}
              </button>
            </motion.div>
          </AnimatePresence>

          {/* Right image - Animated */}
          <div className="flex justify-end">
            <div className="relative">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`image-${currentSlide}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 },
                  }}
                  className="h-[60px] w-[60px] -mt-[4rem] sm:-mt-0 xs:h-[110px] xs:w-[110px] sm:h-[120px] sm:w-[120px] md:h-[140px] md:w-[140px] lg:h-[160px] lg:w-[160px] xl:h-[180px] xl:w-[180px] overflow-hidden"
                >
                  <Image
                    src={currentContent.image}
                    alt={currentContent.alt}
                    width={160}
                    height={160}
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center mt-6 sm:mt-7 md:mt-8 gap-1.5 sm:gap-2">
          {contentVariants.map((_, index) => (
            <motion.div
              key={index}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide
                  ? "w-6 sm:w-8 bg-[#F2B94B]"
                  : "w-1.5 sm:w-2 bg-white/30 hover:bg-white/50"
              }`}
              onClick={() => handleSlideChange(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-[16px] sm:rounded-[18px] md:rounded-[20px] lg:rounded-[22px] ring-1 ring-white/5" />
      </div>
    </section>
  );
};

export default DashboardHero;
