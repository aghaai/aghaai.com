"use client";
import React, { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";

// Custom Star Component for better styling
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5 xs:gap-1 mt-2 justify-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 transition-colors duration-200 ${
            i < rating 
              ? "text-[#FFC14E] drop-shadow-sm" 
              : "text-gray-200"
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
};

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Create extended testimonials array for infinite scroll
  const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials];
  
  // Auto-scroll functionality with smooth transition
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        // Reset to beginning when we reach the end of first set
        if (next >= testimonials.length) {
          setTimeout(() => setCurrentIndex(0), 700);
          return next;
        }
        return next;
      });
    }, 2000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [testimonials.length, isPaused]);

  // Calculate transform value for smooth scrolling
  const getTransformValue = () => {
    const cardWidth = 100 / slidesPerView; // Percentage width per card
    return `translateX(-${currentIndex * cardWidth}%)`;
  };

  return (
    <LayoutWrapper>
    <section className="mx-auto py-6 xs:py-8 sm:py-10 md:py-12 px-3 xs:px-4 sm:px-2">
      <h2 className="text-center text-xl xs:text-2xl sm:text-3xl md:text-4xl font-medium mb-8 xs:mb-12 sm:mb-16 md:mb-20">
        Student Reviews
      </h2>

      <div 
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="overflow-hidden pt-12 sm:pt-16 lg:pt-20">
          <div 
            className="flex gap-6 sm:gap-6 transition-transform duration-700 ease-in-out"
            style={{ transform: getTransformValue() }}
          >
            {extendedTestimonials.map((testimonial, index) => (
              <Card
                key={`${testimonial.name}-${index}`}
                className="flex-shrink-0  mx-auto bg-white rounded-xl border border-solid border-[#E5E7EB] relative  pt-10 sm:pt-12 min-h-[320px]"
                style={{ width: `calc(${100 / slidesPerView}% - ${slidesPerView > 1 ? '1.5rem' : '0px'})` }}
              >
                <Avatar className="w-20 h-20 sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px] absolute top-[-40px] sm:top-[-50px] lg:top-[-60px] left-1/2 transform -translate-x-1/2 z-10">
                  <AvatarImage
                    src={testimonial.image}
                    alt={`${testimonial.name}'s profile`}
                  />
                  <AvatarFallback>
                    {testimonial.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <CardContent className="pt-4 xs:pt-6 sm:pt-8 md:pt-10 pb-4 xs:pb-5 sm:pb-6 md:pb-8 px-3 xs:px-4 sm:px-6 flex flex-col items-center h-full justify-between">
                  <div className="text-center">
                    <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl mb-2 xs:mb-3 sm:mb-4 font-medium">
                      {testimonial.name}
                    </h3>
                    <p className="w-full max-w-[260px] xs:max-w-xs sm:max-w-[280px] md:max-w-[300px] text-gray-500 mb-3 xs:mb-4 sm:mb-5 text-xs xs:text-sm sm:text-base text-center leading-relaxed">
                      Take a look at how CSS Edge helps students and teachers prepare,
                      track progress, and access AI tools—all from a modern,
                      easy-to-use dashboard.
                    </p>
                  </div>
                  <StarRating rating={testimonial.rating} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center mt-4 xs:mt-6 sm:mt-8 gap-2 xs:gap-3">
          {Array.from({ length: testimonials.length }).map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 xs:w-3 xs:h-3 rounded-full transition-all duration-500 cursor-pointer ${
                idx === (currentIndex % testimonials.length)
                  ? "bg-[#1C6758] scale-125 shadow-lg" 
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      </div>
    </section>
    </LayoutWrapper>
  );
};
