import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";
import Image from "next/image";
import React from "react";

const AboutPage = () => {
    return (
        <>
            <LayoutWrapper>
                {/* Top section */}
                <div className="max-w-7xl mx-auto py-8 md:py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
                    {/* Text */}
                    <div className="order-2 md:order-1">
                        <p className="text-xs sm:text-sm text-[#1C6758] mb-1 md:mb-2">About Us</p>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 text-gray-900">
                            Empowering Pakistan&apos;s <br className="hidden sm:block" /> Future Bureaucrats
                        </h2>
                        <p className="text-gray-500 text-sm sm:text-base text-justify">
                            CSS Edge is a dedicated platform for aspirants of Pakistan&apos;s Central Superior Services (CSS) exams. We provide comprehensive resources, expert guidance, and smart tools to help you succeed in one of the country&apos;s most prestigious competitive exams.
                        </p>
                    </div>
                    {/* Image */}
                    <div className="order-1 md:order-2 flex justify-center md:justify-end">
                        <Image
                            width={500}
                            height={500}
                            src="/about/Rectangle 166.png"
                            alt="Student learning"
                            className="rounded-xl w-full max-w-md md:max-w-xl"
                            priority
                        />
                    </div>
                </div>
            </LayoutWrapper>

            {/* Mission section */}
            <div className="bg-gradient-to-r from-[#1C6758] to-[#111827] py-10 lg:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-0 text-white flex flex-col md:flex-row md:justify-between md:items-center gap-6 md:gap-0">
                    {/* Mission text */}
                    <div className="mb-6 md:mb-0 md:w-full lg:w-2/5">
                        <h3 className="text-xl sm:text-2xl font-semibold mb-2">Our Mission</h3>
                        <p className="text-sm sm:text-base text-justify mt-3 sm:mt-5">
                            Our mission is to simplify and revolutionize CSS preparation through technology and personalized learning. We aim to make high-quality resources accessible for every student—regardless of background—so that no talent goes to waste.
                        </p>
                    </div>
                    {/* Stats */}
                    <div className="flex flex-wrap justify-between md:justify-end gap-4 sm:gap-6 md:gap-8 lg:gap-10 md:w-full lg:w-1/2">
                        <div className="text-center border-r px-3 sm:px-5 border-gray-400">
                            <div className="text-xl sm:text-2xl font-bold">5,000+</div>
                            <div className="text-xs sm:text-sm text-gray-200">users</div>
                        </div>
                        <div className="text-center border-r px-3 sm:px-5 border-gray-400">
                            <div className="text-xl sm:text-2xl font-bold">100+</div>
                            <div className="text-xs sm:text-sm text-gray-200">evaluated essays</div>
                        </div>
                        <div className="text-center px-3 sm:px-5">
                            <div className="text-xl sm:text-2xl font-bold">100%</div>
                            <div className="text-xs sm:text-sm text-gray-200">syllabus coverage</div>
                        </div>
                    </div>
                </div>
            </div>

            <LayoutWrapper>
                {/* Made for students section */}
                <div className="max-w-7xl mx-auto py-10 sm:py-14">
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center mb-3 sm:mb-4 font-medium">
                        Made for Students, Trusted by Teachers
                    </h3>
                    <p className="text-[#6B7280] text-center mb-6 sm:mb-8 text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
                        CSS Edge supports students across Pakistan—from first-time aspirants to repeat candidates—alongside teachers and academies looking for a centralized, modern platform to manage learning and assessments.
                    </p>
                    <div className="flex justify-center">
                        <Image
                            width={1200}
                            height={600}
                            src="/about/Rectangle 168.png"
                            alt="Collaboration"
                            className="rounded-lg w-full max-w-5xl"
                        />
                    </div>
                </div>
            </LayoutWrapper>
        </>
    );
};

export default AboutPage;