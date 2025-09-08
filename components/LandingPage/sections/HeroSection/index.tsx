"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import heroSection from "@/public/hero-section-asian-girl.png";
import { useEffect, useState } from "react";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";

export default function HeroSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const fullText =
    " Join thousands of CSS aspirants, who are transforming their preparation with AI-powered learning tools, instant feedback, personalized study plans, and intelligent progress tracking — all designed to help you study smarter, not harder. Achieve your goals faster with a platform built exclusively for CSS success.";
  const shortText = fullText.slice(0, 145) + "...";


  return (
    <LayoutWrapper>
      <section className="min-h-screen flex relative z-10 overflow-x-clip -mt-[2rem] md:-mt-[4rem] items-center">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-left"
            >
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
                className="text-4xl lg:text-5xl xl:text-6xl font-semibold mb-5 leading-tight tracking-tight"
              >
                Smart Preparation for{" "}
                <span className="relative text-[#1C6758] shimmer px-1">
                  CSS with AI
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#1C6758] opacity-10 rounded-full blur-sm pointer-events-none" />
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="relative"
              >
                <p className="text-base sm:text-lg md:text-xl 2xl:text-xl text-gray-700 leading-7 mb-2 text-justify max-w-2xl">
                  {isMobile ? (isExpanded ? fullText : shortText) : fullText}
                </p>
                {isMobile && !isExpanded && (
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="text-[#008080] text-sm underline hover:opacity-80 transition mb-2"
                  >
                    Read More
                  </button>
                )}
                <button className="hidden md:block bg-[#1C6758] text-white px-6 py-3 rounded-md hover:bg-[#13483c] transition  text-base sm:text-md font-medium mt-5">
                  Enroll Now
                </button>
              </motion.div>
            </motion.div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.4 }}
              className="relative w-full aspect-[1/5] md:aspect-[1/4] h-[70vh] flex items-center justify-center -mt-[10rem] md:-mt-0"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#00808022] via-white/20 to-transparent rounded-[2.5rem] blur-2xl opacity-90" />
              <Image
                src={heroSection}
                alt="Surgical Tools"
                fill
                priority
                className=" object-contain"
              />
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
    </LayoutWrapper>
  );
}
