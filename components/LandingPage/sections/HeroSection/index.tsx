"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroVariants = [
    {
      id: 1,
      title: "Master Essay Writing with AI Evaluation",
      image: "/heroSection/Hero1.svg",
      alt: "AI Essay Evaluation",
      className: "object-contain mt-0 md:mt-3",
    },
    {
      id: 2,
      title: "Unlock Your Potential with Smart Learning",
      image: "/heroSection/Hero2.svg",
      alt: "Smart Learning Platform",
      className: "object-contain mt-0 md:mt-0",
    },
    {
      id: 3,
      title: "Transform Your Writing Skills with AI Feedback",
      image: "/heroSection/Hero3.svg",
      alt: "AI Feedback System",
      className: "object-contain -mt-6 md:-mt-0",
    },
  ];

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroVariants.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(timer);
  }, [heroVariants.length]);

  const fullText =
    "Join thousands of CSS aspirants who are transforming their preparation with AI-powered learning tools, instant feedback, personalized study plans, and intelligent progress tracking .";
  const shortText = fullText.slice(0, 145) + "...";

  const currentVariant = heroVariants[currentSlide];

  return (
    <div className="bg-[#F7F7F7] h-[70vh] md:h-[80vh]">
      <section className="flex relative z-10 overflow-x-clip items-center px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center py-6 xs:py-8 sm:py-12 md:py-16 lg:py-5">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-left px-1 xs:px-2 lg:px-0"
            >
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold mb-3 xs:mb-4 sm:mb-5 leading-[1.15] xs:leading-tight tracking-tight"
                >
                  <span className="relative text-[#1C6758] shimmer px-1">
                    {currentVariant.title}
                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#1C6758] opacity-10 rounded-full blur-sm pointer-events-none" />
                  </span>
                </motion.h1>
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="relative"
              >
                <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-5 xs:leading-6 sm:leading-7 mb-3 xs:mb-4 sm:mb-2 text-left xs:text-justify max-w-full lg:max-w-2xl">
                  {isMobile ? (isExpanded ? fullText : shortText) : fullText}
                </p>
                {isMobile && !isExpanded && (
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="text-[#1C6758] text-xs xs:text-sm font-medium underline hover:opacity-80 transition mb-3 xs:mb-4 sm:mb-2 inline-block"
                  >
                    Read More
                  </button>
                )}
                <button className="w-full xs:w-auto xs:min-w-[180px] sm:w-auto bg-[#1C6758] text-white px-6 xs:px-8 sm:px-6 py-3 xs:py-3.5 sm:py-2.5 rounded-lg xs:rounded-md hover:bg-[#13483c] transition text-sm xs:text-base font-medium mt-2 xs:mt-3 sm:mt-4 shadow-md hover:shadow-lg">
                  Start Your Journey
                </button>
              </motion.div>
            </motion.div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.4 }}
              className="relative w-full aspect-[3/4] xs:aspect-square sm:aspect-[4/3] md:aspect-[3/2] lg:aspect-[1/1] h-[40vh] xs:h-[45vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] flex items-center justify-center mt-6 xs:mt-8 sm:mt-4 lg:mt-0"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#00808022] via-white/20 to-transparent rounded-[2.5rem] blur-2xl opacity-90" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentVariant.image}
                    alt={currentVariant.alt}
                    fill
                    priority
                    className={currentVariant.className}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
        <style jsx>{`
          .shimmer {
            position: relative;
            overflow: hidden;
          }
          .shimmer::after {
            content: "";
            position: absolute;
            top: 0;
            left: -150%;
            width: 120%;
            height: 100%;
            background: linear-gradient(
              110deg,
              transparent 55%,
              #fff8 65%,
              transparent 75%
            );
            animation: shimmer-move 2.4s infinite;
            pointer-events: none;
          }
          @keyframes shimmer-move {
            0% {
              left: -150%;
            }
            80% {
              left: 120%;
            }
            100% {
              left: 120%;
            }
          }
        `}</style>
      </section>
    </div>
  );
}
