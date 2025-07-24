"use client";

import { Mail, Phone } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Your message has been sent!", { position: "top-right" });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        toast.error("Something went wrong. Try again later.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to send email.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const faqs = [
    {
      question: 'Who can use Aghaai?',
      answer: 'Aghaai is designed for CSS students, teachers, and administrators. Each role has its own dashboard with features like AI tools, progress tracking, and content management.'
    },
    {
      question: 'Can I switch my role after signing up?',
      answer: 'aghaai  instruments can be sterilized with any procedure stated in our instructions for use. Nevertheless, thoroughly advised fractionated vacuum steam sterilization at an assigned operating temperature.'
    },
    {
      question: 'What courses are offered on Aghaai?',
      answer: 'Cleaning of instruments must be done before sterilisation. After any surgery, the remains may remain on the instruments, be it blood, bone, skin, or tissue. Sterilization of these instruments requires their residues to be eliminated. Otherwise, they may damage the instrument. These instruments may be cleaned manually (by brush), by machine, or by ultrasound. Instruments, whenever feasible, really ought to be cleaned or at any rate disassembled in the open condition. See usability.'
    },
    {
      question: 'My shipment has been sent. Am I able to trace it?',
      answer: 'Yes, you can track the status of an order. Once your order has been shipped, you will be provided with a tracking number by customer services.'
    },
    {
      question: 'How do teachers interact with students?',
      answer: 'Aghaai  equipment must be placed in a non-moisture environment with dry air and free of dirt. The instruments should be stored in the shipping carton or a protective tray, preferably separately. Surround tips and edges with appropriate protection and ensure that there are no chemicals near or in the storage place. We advise you to reach us to get the instructions for use.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Our home page and our catalogues have several searching possibilities. You may query products using description, name, or item no.. Should you continue failing to identify a tool, make sure to contact our customer service so that it can help you locate the desired tool.'
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <LayoutWrapper>
      <ToastContainer />
      {/* Contact Section */}
      <div className="relative w-full max-w-[90vw] min-h-[530px] flex flex-col lg:flex-row justify-center items-center px-2 lg:px-0 h-auto lg:h-[90vh] gap-6 lg:gap-0">
        {/* Left Contact Card */}
        <div className="
          w-full
          max-w-[460px]
          h-auto
          flex flex-col
          px-6 py-8
          justify-between
          bg-[#25695B]
          rounded-2xl
          shadow-lg
          mb-4
          lg:mb-0
          lg:static
          md:max-w-[730px]
          lg:max-w-[430px]
          lg:h-[400px]
          lg:px-10 lg:py-12
          lg:mr-[-260px]
          z-20
        ">
          <div>
            <h2 className="text-white text-[1.5rem] lg:text-[2.2rem] font-semibold mb-4">Contact Us</h2>
            <p className="text-[#DBF3ED] text-[1rem] lg:text-[1.15rem] font-normal leading-[1.6]">
              For questions about courses, technical issues, or your CSS prep, feel free to contact us.
            </p>
          </div>
          <div className="mt-2">
            <div className="flex items-center mb-4">
              <Mail className="w-5 h-5 lg:w-6 lg:h-6 text-white mr-3" />
              <span className="text-white text-sm lg:text-base font-medium">support@aghaai.com</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 lg:w-6 lg:h-6 text-white mr-3" />
              <span className="text-white text-sm lg:text-base font-medium">+92 300 1234567</span>
            </div>
          </div>
        </div>
        {/* Right Form Card */}
        <div className="
          relative z-10
          bg-white
          rounded-2xl
          shadow-xl
          w-full
          max-w-[950px]
          py-8 px-4
          lg:pl-[310px]
          lg:pr-8 lg:py-12
          h-auto
          lg:h-[70vh]
        ">
          <div>
            <h2 className="text-[#35404E] text-[1.25rem] lg:text-[2rem] font-semibold mb-6">Get in Touch</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full lg:w-1/2 p-2 lg:p-3 rounded-md bg-[#F7F7F7] focus:outline-none text-sm lg:text-base"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full lg:w-1/2 p-2 lg:p-3 rounded-md bg-[#F7F7F7] focus:outline-none text-sm lg:text-base"
                  required
                />
              </div>
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full lg:w-1/2 p-2 lg:p-3 rounded-md bg-[#F7F7F7] focus:outline-none text-sm lg:text-base"
                  required
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full lg:w-1/2 p-2 lg:p-3 rounded-md bg-[#F7F7F7] focus:outline-none text-sm lg:text-base"
                />
              </div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={5}
                className="w-full p-2 lg:p-3 rounded-md bg-[#F7F7F7] focus:outline-none text-sm lg:text-base resize-none"
                required
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-[#25695B] hover:bg-[#21594e] px-6 lg:px-8 py-2 text-white text-sm lg:text-base rounded-md"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-2 lg:px-4 py-8 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Column for the Heading */}
          <div className="w-full lg:w-[27rem] flex flex-col items-start text-left">
            <h2 className="text-xl sm:text-2xl lg:text-5xl font-semibold leading-snug lg:-mb-3">
              Have Question?
            </h2>
            <h2 className="text-xl sm:text-2xl lg:text-5xl font-semibold leading-snug lg:mb-0 text-[#1C6758]">
              We&apos;ve got answers.
            </h2>
            <p className="text-justify text-xs sm:text-sm text-[#6B7280] mt-4">
              Find quick solutions to the most common queries about Aghaai, our features, plans, and how to get started.
            </p>
          </div>

          {/* Column for the FAQ Data */}
          <div className="w-full lg:w-3/5 space-y-2 lg:space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <button
                  className="flex justify-between items-center w-full py-3 text-left"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-sm sm:text-base font-medium text-gray-800">
                    {faq.question}
                  </span>
                  <span className="text-[#008080] text-lg sm:text-xl">
                    {openIndex === index ? '-' : '+'}
                  </span>
                </button>
                {openIndex === index && faq.answer && (
                  <p className="text-[#666666] text-xs sm:text-sm lg:text-base mt-2 mb-2">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default ContactPage;
