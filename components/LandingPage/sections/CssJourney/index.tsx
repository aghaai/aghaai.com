import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";
import React from "react";

const CTASection = () => {
    return (
        <LayoutWrapper>
        <section className="bg-[#FAFAFA] flex justify-center  ">
            <div className="text-center max-w-2xl w-full px-2 sm:px-4">
                <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold text-gray-900 mb-4">
                    Ready to Start Your CSS Journey?
                </h2>
                <p className="text-gray-500 mb-6 text-sm sm:text-base md:text-lg">
                    Enroll now and unlock expert guidance, AI tools, and access to past papers &
                    scoring strategies. Let CSS Edge guide your success.
                </p>
                <button className="bg-[#175A4C] text-white px-6 py-3 rounded-md hover:bg-[#13483c] transition w-full sm:w-auto text-base sm:text-lg font-medium">
                    Enroll Now
                </button>
            </div>
        </section>
        </LayoutWrapper>
    );
};

export default CTASection;
