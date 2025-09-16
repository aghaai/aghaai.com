"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const HeaderSection = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Plans", href: "/plans" },
    // { label: "Past Papers", href: "/past-papers" },
    // { label: "Books", href: "/books" },
    { label: "Blogs", href: "/blogs" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="w-full h-[88px] flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-20 relative">
      {/* Left: Logo */}
      <Link href="/" className="w-[100px] sm:w-[130px] h-[60px] flex items-center">
        <Image
          width={130}
          height={130}
          alt="Logo"
          src="/logo.png"
          className="object-contain w-full h-auto"
        />
      </Link>

      {/* Center: Navbar (desktop only) */}
      <nav className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center gap-6 xl:gap-16 2xl:gap-20 px-6 py-3 border border-gray-200 rounded-full z-0">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="text-sm xl:text-md font-medium text-gray-900 hover:text-[#1c6758] transition-colors whitespace-nowrap"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 z-10">
        {/* Live Badge (hidden on very small screens) */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-3 h-3 bg-[#1c6758] rounded-full" />
          <span className="text-sm md:text-md text-gray-900 whitespace-nowrap">32 Live</span>
        </div>

        {/* Desktop Sign Up Button */}
        <div className="hidden sm:block ml-2 sm:ml-5">
          <Button className="px-4 sm:px-5 py-1 sm:py-2 border-2 border-[#1c6758] bg-[#fafafa] text-[#1c6758] hover:bg-[#f5f5f5] font-normal text-sm md:text-md">
            Sign Up
          </Button>
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          className="lg:hidden focus:outline-none ml-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[75px] left-0  bg-white shadow-md px-6 py-4 flex flex-col gap-4 z-50 border-t border-gray-200 w-screen">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="text-gray-900 text-base hover:text-[#1c6758] transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="">
            <Button className=" border-2 border-[#1c6758] bg-[#fafafa] text-[#1c6758] hover:bg-[#f5f5f5] font-normal">
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderSection;