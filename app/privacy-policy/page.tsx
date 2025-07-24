import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";
import React from "react";
import { FiShield, FiUsers, FiLink, FiFileText } from "react-icons/fi";

const PrivacyPolicy = () => {
    return (
        <LayoutWrapper className="min-h-screen flex justify-center items-center py-8">
            <div className="max-w-screen-lg w-full">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-4xl font-semibold text-[#004040]">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-600 mt-2 max-w-2xl mx-auto text-base sm:text-lg">
                        At Artema Medical, we strive to provide timely and reliable shipping for our surgical instruments. Below are the details of our privacy policy.
                    </p>
                </div>

                {/** Information Sections */}
                <section className="mb-8 border-b pb-4">
                    <h2 className="flex items-center text-2xl font-bold mb-4 space-x-2">
                        <FiFileText className="bg-[#CFE7E7] p-1 rounded-lg text-[#004040]" />
                        <span>Information We Collect</span>
                    </h2>
                    <ul className="list-disc ml-8 space-y-2 text-gray-700">
                        <li><strong>Personal Information:</strong> Information such as your name, email, phone number, and addresses.</li>
                        <li><strong>Non-Personal Information:</strong> Browser type, IP address, and page visit details.</li>
                        <li><strong>Health Information:</strong> Health-related information handled per applicable laws.</li>
                    </ul>
                </section>

                <section className="mb-8 border-b pb-4">
                    <h2 className="flex items-center text-2xl font-bold mb-4 space-x-2">
                        <FiShield className="bg-[#CFE7E7] p-1 rounded-lg text-[#004040]" />
                        <span>How We Use Your Information</span>
                    </h2>
                    <ul className="list-disc ml-8 space-y-2 text-gray-700">
                        <li>To process orders and provide services.</li>
                        <li>To communicate about account or inquiries.</li>
                        <li>To improve our products and services.</li>
                        <li>To send marketing communications with consent.</li>
                        <li>To comply with legal obligations.</li>
                    </ul>
                </section>

                <section className="mb-8 border-b pb-4">
                    <h2 className="flex items-center text-2xl font-bold mb-4 space-x-2">
                        <FiUsers className="bg-[#CFE7E7] p-1 rounded-lg text-[#004040]" />
                        <span>Disclosure of Your Information</span>
                    </h2>
                    <ul className="list-disc ml-8 space-y-2 text-gray-700">
                        <li><strong>With Service Providers:</strong> Shared with trusted third-party vendors.</li>
                        <li><strong>For Legal Reasons:</strong> Disclosed to comply with laws or protect rights.</li>
                    </ul>
                </section>

                <section className="mb-8 border-b pb-4">
                    <h2 className="flex items-center text-2xl font-bold mb-4 space-x-2">
                        <FiShield className="bg-[#CFE7E7] p-1 rounded-lg text-[#004040]" />
                        <span>Security of Your Information</span>
                    </h2>
                    <p className="text-gray-700 ml-[2rem]">
                        To protect your information, we implement strong security measures and promote safe online practices.
                    </p>
                </section>

                <section className="mb-8 border-b pb-4">
                    <h2 className="flex items-center text-2xl font-bold mb-4 space-x-2">
                        <FiFileText className="bg-[#CFE7E7] p-1 rounded-lg text-[#004040]" />
                        <span>Your Rights</span>
                    </h2>
                    <ul className="list-disc ml-8 space-y-2 text-gray-700">
                        <li>Access and receive a copy of your personal information.</li>
                        <li>Request correction of inaccuracies.</li>
                        <li>Request deletion of your data.</li>
                    </ul>
                </section>

                <section className="mb-8 border-b pb-4">
                    <h2 className="flex items-center text-2xl font-bold mb-4 space-x-2">
                        <FiLink className="bg-[#CFE7E7] p-1 rounded-lg text-[#004040]" />
                        <span>Third-Party Websites</span>
                    </h2>
                    <p className="text-gray-700  ml-[2rem]">
                        We are not responsible for the privacy practices of third-party websites. Review their privacy policies before sharing information.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="flex items-center text-2xl font-bold mb-4 space-x-2">
                        <FiFileText className="bg-[#CFE7E7] p-1 rounded-lg text-[#004040]" />
                        <span>Changes to This Privacy Policy</span>
                    </h2>
                    <p className="text-gray-700  ml-[2rem]">
                        We may update this policy periodically. Check this page for updates with the effective date.
                    </p>
                </section>
            </div>
        </LayoutWrapper>
    );
};

export default PrivacyPolicy;
