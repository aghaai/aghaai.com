"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

const DashboardHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  // Content variants that will change over time
  const contentVariants = [
    {
      id: 1,
      title: "Your Practice, Your Rules",
      description:
        "Write within 3 hours & meet word limits for real exam prep.",
      buttonText: "Start Essay Test",
      image: "/cta/img1.svg",
      alt: "Essay Practice",
    },
    {
      id: 2,
      title: "AI-Powered Feedback System",
      description:
        "Get instant detailed feedback on your writing with advanced AI analysis.",
      buttonText: "Try AI Feedback",
      image: "/cta/img2.svg",
      alt: "AI Feedback",
    },
    {
      id: 3,
      title: "Track Your Progress",
      description:
        "Monitor your improvement with detailed analytics and performance insights.",
      buttonText: "View Progress",
      image: "/cta/img3.svg",
      alt: "Progress Tracking",
    },
    {
      id: 4,
      title: "Personalized Study Plans",
      description:
        "Customized learning paths designed specifically for your CSS success.",
      buttonText: "Get Study Plan",
      image: "/cta/img4.svg",
      alt: "Study Plans",
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % contentVariants.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(timer);
  }, [contentVariants.length]);

  // Handle button click - navigate to essay evaluation
  const handleButtonClick = () => {
    router.push('/essay-evaluation');
  };

  const currentContent = contentVariants[currentSlide];
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
            max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-6xl xl:max-w-7xl
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
          <div className="grid items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 grid-cols-1 md:grid-cols-[1.2fr_0.8fr]">
            <div className="text-white">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={`title-${currentSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="font-semibold tracking-[-0.01em] text-[20px] xs:text-[22px] sm:text-[26px] md:text-[30px] lg:text-[34px] xl:text-[36px] leading-tight"
                >
                  {currentContent.title}
                </motion.h2>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.p
                  key={`desc-${currentSlide}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
                  className="mt-2 sm:mt-3 md:mt-4 text-white/85 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed"
                >
                  {currentContent.description}
                </motion.p>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.button
                  key={`button-${currentSlide}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeInOut", delay: 0.2 }}
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
                </motion.button>
              </AnimatePresence>
            </div>

            {/* Right image - Animated */}
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`image-${currentSlide}`}
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 1.1, rotate: 10 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="h-[100px] w-[100px] xs:h-[110px] xs:w-[110px] sm:h-[120px] sm:w-[120px] md:h-[140px] md:w-[140px] lg:h-[160px] lg:w-[160px] xl:h-[180px] xl:w-[180px] overflow-hidden"
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
                onClick={() => setCurrentSlide(index)}
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
