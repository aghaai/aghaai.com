"use client";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";
import Image from "next/image";

const CTASection = () => {
  return (
    <LayoutWrapper>
      <section className="py-4 xs:py-6 sm:py-8 md:py-10">
        {/* Card */}
        <div
          className="
            mx-auto max-w-7xl rounded-[16px] xs:rounded-[18px] sm:rounded-[20px] md:rounded-[22px]
            bg-[#F7F7F7] shadow-lg
            px-4 xs:px-5 sm:px-8 md:px-10 lg:px-12 py-6 xs:py-7 sm:py-8 md:py-10 lg:py-12
            relative overflow-hidden
          "
        >
          {/* Content grid */}
          <div className="grid items-center gap-4 xs:gap-6 sm:gap-8 md:gap-10 lg:gap-16 grid-cols-1 md:grid-cols-2">
            {/* Left copy */}
            <div className="text-center md:text-left">
              <h2 className="text-slate-900 font-semibold tracking-tight text-[18px] xs:text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] leading-tight">
                Ready to Start Your CSS Journey?
              </h2>

              <p className="mt-2 xs:mt-3 sm:mt-4 text-slate-600 text-xs xs:text-sm sm:text-base leading-relaxed">
                Enroll now and unlock expert guidance, AI tools, and access to
                past papers &amp; scoring strategies. Let CSS Edge guide your
                success.
              </p>

              <button
                className="
                  mt-4 xs:mt-5 sm:mt-6 
                  rounded-lg xs:rounded-md px-6 xs:px-7 sm:px-5 py-3 xs:py-3.5 sm:py-3 text-sm xs:text-[15px] font-semibold
                  bg-[#1C6758] text-white
                  hover:bg-[#165347] active:bg-[#0E3A32]
                  transition shadow-md hover:shadow-lg
                "
              >
                Start Your Journey
              </button>
            </div>

            {/* Right image (flush to end) */}
            <div className="flex justify-center md:justify-end mt-4 md:mt-0 order-first md:order-last">
              <Image
                src="/cta/img5.svg"
                alt="Idea & growth illustration"
                width={227}
                height={214}
                className="object-contain w-32 h-auto xs:w-40 sm:w-48 md:w-56 lg:w-full max-w-[227px]"
                priority
              />
            </div>
          </div>

          {/* Soft rounded border accent */}
          <div className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-slate-200/60" />
        </div>
      </section>
    </LayoutWrapper>
  );
};

export default CTASection;
