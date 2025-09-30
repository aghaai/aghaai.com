"use client";
import React, { useState } from "react";
import Image from "next/image";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const MentorsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);

  // Update cards per view based on screen size
  React.useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 768) {
        setCardsPerView(2); // Tablet and desktop show 2 cards
      } else {
        setCardsPerView(1); // Mobile shows 1 card
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const mentors = [
    {
      id: 1,
      name: "Anas Ansari",
      role: "UI/UX Designer",
      blurb:
        "Designing user-centric interfaces with 5+ years in UI/UX education",
      image: "/mentors/img1.svg",
    },
    {
      id: 2,
      name: "Ubaid Ullah",
      role: "MERN Stack Developer",
      blurb:
        "Building dynamic web applications with 5+ years in MERN stack development",
      image: "/mentors/img2.svg",
    },
    {
      id: 3,
      name: "Anas Ansari",
      role: "UI/UX Designer",
      blurb:
        "Designing user-centric interfaces with 5+ years in UI/UX education",
      image: "/mentors/img1.svg",
    },
    {
      id: 4,
      name: "Ubaid Ullah",
      role: "MERN Stack Developer",
      blurb:
        "Building dynamic web applications with 5+ years in MERN stack development",
      image: "/mentors/img2.svg",
    },
  ];

  const maxIndex = Math.max(0, mentors.length - cardsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <LayoutWrapper>
      <section className="pb-12 xs:pb-16 sm:pb-20 md:pb-24 lg:pb-[6rem]">
        {/* Header */}
        <div className="text-center mb-4 xs:mb-6 sm:mb-8 lg:mb-12 px-3 xs:px-4 sm:px-0">
          <h2 className="text-xl sm:text-2xl md:text-[26px] lg:text-[30px] font-semibold text-[#111827]">
            Meet Your Mentors
          </h2>
          <p className="mt-2 text-sm sm:text-[14px] md:text-[15px] text-[#6B7280] max-w-2xl mx-auto">
            Gain the Knowledge and Skills you need to advance
          </p>
        </div>

        <div className="relative mx-auto overflow-x-hidden px-4 sm:px-0 max-w-7xl">
          <div 
            className="flex transition-transform duration-300 ease-in-out gap-4 sm:gap-6 pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-4 sm:pb-6 md:pb-8"
            style={{ 
              transform: `translateX(-${currentIndex * (cardsPerView === 1 ? 100 : 50)}%)` 
            }}
          >
            {mentors.map((m) => (
            <article
              key={m.id}
              className="
                relative flex-shrink-0
                w-full md:w-[calc(50%-12px)] 
                h-[120px] sm:h-[175px] md:h-[185px] lg:h-[191px] 
                rounded-[8px] sm:rounded-[10px] md:rounded-[12px] border border-[#E5E7EB] bg-white
                shadow-[0_1px_4px_rgba(0,0,0,0.04)]
                overflow-visible z-10
              "
            >
              <div className="flex h-full">
                {/* Left image area */}
                <div className="relative w-[140px] sm:w-[180px] md:w-[240px] lg:w-[280px] xl:w-[318px] h-[200px] sm:h-[220px] md:h-[260px] lg:h-[280px] xl:h-[300px] -ml-[1rem] sm:-ml-[1.5rem] md:-ml-[2rem] -mt-[3rem] sm:-mt-[4rem] md:-mt-[5rem] lg:-mt-[6rem] z-10">
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 140px, (max-width: 768px) 180px, (max-width: 1024px) 240px, (max-width: 1280px) 280px, 318px"
                    priority={false}
                  />
                </div>

                {/* Right content */}
                <div className="flex-1 pr-4 sm:pr-5 md:pr-6 pt-4 sm:pt-5 md:pt-6">
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-[20px] font-semibold leading-tight text-[#111827]">
                    {m.name}
                  </h3>

                  <div className="mt-2 sm:mt-3">
                    <span className="inline-block rounded-[4px] sm:rounded-[5px] md:rounded-[6px] bg-[#185C4E] px-2 sm:px-2.5 md:px-3 py-1 text-[10px] sm:text-[11px] md:text-[12px] font-medium text-white">
                      {m.role}
                    </span>
                  </div>

                  <p className="mt-2 sm:mt-3 text-[11px] sm:text-[12px] md:text-[13px] leading-[16px] sm:leading-[18px] md:leading-[20px] text-[#6B7280]">
                    {m.blurb}
                  </p>
                </div>
              </div>
            </article>
          ))}
          </div>
        </div>

        {/* Centered arrows with Lucide */}
        <div className="flex items-center justify-center gap-3 mt-6 sm:mt-8 relative z-20">
          <button
            aria-label="Previous"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white shadow-md hover:shadow-lg transition-all hover:scale-105 relative z-30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-[#111827]" />
          </button>
          <button
            aria-label="Next"
            onClick={nextSlide}
            disabled={currentIndex === maxIndex}
            className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white shadow-md hover:shadow-lg transition-all hover:scale-105 relative z-30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#111827]" />
          </button>
        </div>
      </section>
    </LayoutWrapper>
  );
};
