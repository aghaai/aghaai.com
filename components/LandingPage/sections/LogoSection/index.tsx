"use client";
import React from "react";
import Image from "next/image";

export const LogoSection = () => {
  const logos = [
    {
      id: 1,
      src: "/organizations/img1.svg",
      alt: "Company Logo 1",
      name: "Partner 1"
    },
    {
      id: 2,
      src: "/organizations/img2.svg",
      alt: "Company Logo 2",
      name: "Partner 2"
    },
    {
      id: 3,
      src: "/organizations/img3.svg",
      alt: "Company Logo 3", 
      name: "Partner 3"
    },
    {
      id: 4,
      src: "/organizations/img4.svg",
      alt: "Company Logo 4",
      name: "Partner 4"
    },
    {
      id: 5,
      src: "/organizations/img5.svg",
      alt: "Company Logo 5",
      name: "Partner 5"
    },
    {
      id: 6,
      src: "/organizations/img6.svg",
      alt: "Company Logo 6",
      name: "Partner 6"
    },
    {
      id: 7,
      src: "/organizations/img7.svg",
      alt: "Company Logo 7",
      name: "Partner 7"
    }
  ];

  const extendedLogos = [...logos, ...logos];

  return (
      <section className="py-4 xs:py-5 sm:py-6 md:py-8 lg:py-10 xl:py-12">
        <div className="relative overflow-hidden ">
          <div 
            className="flex gap-3 xs:gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 hover:pause-animation"
            style={{
              animation: 'logoScroll 25s linear infinite',
              width: 'max-content'
            }}
          >
            {extendedLogos.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex-shrink-0 w-16 md:w-20 lg:w-24 xl:w-32 h-12 md:h-14 lg:h-16 xl:h-24 flex items-center justify-center mt-10 md:mt-0"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={60}
                  className="object-contain max-w-full max-h-full p-0.5 xs:p-1 sm:p-2 md:p-3 "
                />
              </div>
            ))}
          </div>
        </div>

        <style jsx global>{`
          @keyframes logoScroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-50%));
            }
          }

          .hover\\:pause-animation:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>
  );
};