import React from "react";
import Image from "next/image";

export const CssExamSection = () => {
  return (
    <section className="relative w-full">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#242A38_0%,#187C68_100%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 py-8 sm:py-12 md:py-14 lg:py-18 xl:py-22">
        <div className="grid items-center gap-6 sm:gap-8 md:gap-10 lg:grid-cols-2">
          {/* LEFT */}
          <div className="text-white order-2 lg:order-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
              Prepare with Clarity, Learn with Confidence!
            </h2>
            <p className="mt-3 sm:mt-4 md:mt-5 max-w-full lg:max-w-xl text-sm sm:text-base lg:text-lg leading-6 sm:leading-7 text-white/80">
              Preparing for CSS doesn’t have to be a struggle. Say goodbye to
              outdated notes, confusing guidance, and the stress of essay
              writing. Aghaai transforms your journey with smart, personalized
              study plans, instant feedback, and round-the-clock AI mentorship
              built just for you. With Agaahi, every step forward brings more
              confidence, more clarity, and real progress that ensures your
              success!
            </p>
          </div>

          {/* RIGHT: Image */}
          <div className="order-1 lg:order-2 lg:justify-self-end">
            <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto lg:mx-0">
              <Image
                src="/progress.svg"
                alt="CSS Exam Section Image"
                width={600}
                height={400}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
