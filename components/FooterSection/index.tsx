import { FacebookIcon, InstagramIcon, LinkedinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const FooterSection = () => {
  const navLinks = [
    { title: "About Us", href: "#" },
    { title: "Past Papers", href: "#" },
    { title: "Blogs", href: "#" },
    { title: "Terms & Conditions", href: "#" },
    { title: "Privacy Policy", href: "#" },
  ];

  const socialLinks = [
    {
      icon: <FacebookIcon className="w-6 h-6 md:w-8 md:h-8" />,
      href: "#",
      label: "Facebook",
    },
    {
      icon: <InstagramIcon className="w-6 h-6 md:w-8 md:h-8" />,
      href: "#",
      label: "Instagram",
    },
    {
      icon: <LinkedinIcon className="w-6 h-6 md:w-8 md:h-8" />,
      href: "#",
      label: "LinkedIn",
    },
  ];

  return (
    <footer className="w-full bg-[#1c6758] text-white px-2 sm:px-6 md:px-10 py-10 flex flex-col items-center">
      {/* Logo */}
      <div className="mb-7 sm:mb-8 mt-7 sm:mt-10">
        <div className="relative flex items-center justify-center">
          <Link href="/" className="w-[110px] sm:w-[130px] h-[50px] sm:h-[60px] flex items-center">
            <Image
              width={130}
              height={130}
              alt="Logo"
              src="/footer_logo.png"
              className="object-contain"
            />
          </Link>
          <div className="w-2.5 h-2.5 bg-[#ffc14e] rounded-full ml-2 mt-1" />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-wrap justify-center gap-x-8 sm:gap-x-12 gap-y-3 text-center mb-8 w-full max-w-7xl">
        {navLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="text-base sm:text-lg font-medium hover:text-[#ffc14e] transition-colors"
          >
            {link.title}
          </a>
        ))}
      </nav>

      {/* Social Media Icons */}
      <div className="flex items-center gap-5 sm:gap-6 mb-8">
        {socialLinks.map((social, index) => (
          <a
            key={index}
            href={social.href}
            aria-label={social.label}
            className="hover:text-white text-[#ffc14e] transition-colors"
          >
            {social.icon}
          </a>
        ))}
      </div>

      {/* Divider Line */}
      <div className="w-full max-w-screen-xl mb-6">
        <div className="w-full h-px bg-white" />
      </div>

      {/* Copyright */}
      <div className="text-center text-xs sm:text-sm text-white/90 font-light mt-2">
        © 2024 Artema Tech. All Rights Reserved.
      </div>
    </footer>
  );
};

export default FooterSection;
