"use client";
import React, { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MoveLeft, MoveRight, Star } from "lucide-react";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";

// Helper hook to determine slides per view responsively
function useSlidesPerView() {
  const [slides, setSlides] = useState(1);
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) setSlides(3); // Desktop
      else if (window.innerWidth >= 640) setSlides(2); // Tablet
      else setSlides(1); // Mobile
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return slides;
}

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Anas Ansari",
      image: "/Ellipse 8.png",
      rating: 5,
    },
    {
      name: "Huzaifa Majeed",
      image: "/Ellipse 19.png",
      rating: 5,
    },
    {
      name: "Ubaid Ullah",
      image: "/Ellipse 7.png",
      rating: 5,
    },
    {
      name: "Sarah Ahmed",
      image: "/Ellipse 8.png",
      rating: 5,
    },
    {
      name: "Ali Raza",
      image: "/Ellipse 19.png",
      rating: 5,
    },
  ];

  const slidesPerView = useSlidesPerView();
  const [start, setStart] = useState(0);

  // For circular logic
  const maxStart =
    testimonials.length - slidesPerView < 0
      ? 0
      : testimonials.length - slidesPerView;

  const handlePrev = () => {
    setStart((prev) => (prev === 0 ? maxStart : prev - 1));
  };

  const handleNext = () => {
    setStart((prev) => (prev >= maxStart ? 0 : prev + 1));
  };

  // Touch/drag support for mobile/tablet
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    if (touchEnd - touchStart > 50) handlePrev();
    else if (touchStart - touchEnd > 50) handleNext();
    setTouchStart(null);
  };

  // Prepare visible testimonials, wrap around if needed
  let visible = testimonials.slice(start, start + slidesPerView);
  while (visible.length < slidesPerView) {
    visible = visible.concat(
      testimonials.slice(0, slidesPerView - visible.length)
    );
  }

  return (
    <LayoutWrapper>
    <section className="mx-auto py-10 sm:py-12 px-2 ">
      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-medium mb-20 sm:mb-[6rem]">
        Testimonials
      </h2>

      <div
        className={`relative`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex gap-6 sm:gap-10 transition-all duration-500">
          {visible.map((testimonial, index) => (
            <Card
              key={`${testimonial.name}-${index}`}
              className="w-full max-w-md mx-auto bg-white rounded-xl border border-solid border-[#fafafa7d] relative shadow-xl pt-10 sm:pt-16 flex-1"
            >
              <Avatar className="w-20 h-20 sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px] absolute top-[-48px] sm:top-[-60px] left-1/2 transform -translate-x-1/2">
                <AvatarImage
                  src={testimonial.image}
                  alt={`${testimonial.name}'s profile`}
                />
                <AvatarFallback>
                  {testimonial.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <CardContent className="pt-6 sm:pt-8 pb-5 sm:pb-6 flex flex-col items-center">
                <h3 className="text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6">
                  {testimonial.name}
                </h3>
                <p className="w-full max-w-xs sm:max-w-[320px] md:max-w-[364px] text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base text-center">
                  Take a look at how CSS Edge helps students and teachers prepare,
                  track progress, and access AI tools—all from a modern,
                  easy-to-use dashboard.
                </p>
                <div className="flex mt-2 text-[#FFD700]">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 sm:w-[22px] sm:h-[22px] md:w-[24px] md:h-[24px] lg:w-[30px] lg:h-[30px]"
                      fill="currentColor"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            className="p-2 rounded-full bg-white shadow-md text-gray-600 hover:bg-gray-100 hover:text-black transition-all duration-300"
            onClick={handlePrev}
            aria-label="Previous testimonial"
          >
            <MoveLeft className="w-5 h-5" />
          </button>
          <button
            className="p-2 rounded-full bg-white shadow-md text-gray-600 hover:bg-gray-100 hover:text-black transition-all duration-300"
            onClick={handleNext}
            aria-label="Next testimonial"
          >
            <MoveRight className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center mt-3 gap-2">
          {Array.from({ length: testimonials.length }).map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all ${idx === start ? "bg-[#1C6758]" : "bg-gray-300"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
    </LayoutWrapper>
  );
};
