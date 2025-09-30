import Image from "next/image";
import Link from "next/link";
import React from "react";

const FooterSection = () => {
  return (
    <footer
      className="
        w-full text-white pt-6 xs:pt-8 sm:pt-12 md:pt-14 pb-4 xs:pb-5 sm:pb-6 px-3 xs:px-4 sm:px-6
        bg-[linear-gradient(135deg,#187C68_0%,#242A38_100%)]
      "
    >
      <div className="mx-auto max-w-7xl grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-4 xs:gap-6 sm:gap-8 lg:gap-10">
        {/* LEFT: Brand + description */}
        <div className="xs:col-span-2 sm:col-span-2 lg:col-span-3 mb-4 xs:mb-6 sm:mb-0">
          <Link href="/" className="w-[90px] xs:w-[100px] sm:w-[110px] md:w-[130px] h-[40px] xs:h-[45px] sm:h-[50px] md:h-[60px] flex items-center mb-3 xs:mb-4">
            <Image
              width={130}
              height={130}
              alt="Logo"
              src="/footer_logo.png"
              className="object-contain"
            />
          </Link>
          <p className="text-xs sm:text-sm text-white/85 leading-4 xs:leading-5 sm:leading-6 max-w-lg pr-2 xs:pr-0">
            Aghaai AI is the smart essay evaluation platform that gives students
            real exam-like practice, instant AI feedback, and transparent scoring
            to improve writing skills with confidence.
          </p>
        </div>

        {/* Resources */}
        <div className="mb-4 xs:mb-6 sm:mb-0 lg:col-span-1">
          <h3 className="font-semibold mb-2 xs:mb-3 sm:mb-4 text-sm sm:text-base text-white">Resources</h3>
          <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-white/85">
            <li><Link href="/" className="hover:text-white transition-colors block py-0.5">Home Page</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors block py-0.5">About Us</Link></li>
            <li><Link href="/courses" className="hover:text-white transition-colors block py-0.5">Our Courses</Link></li>
            <li><Link href="/books" className="hover:text-white transition-colors block py-0.5">Our Books</Link></li>
            <li><Link href="/blogs" className="hover:text-white transition-colors block py-0.5">Blogs</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors block py-0.5">Contact Us</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="mb-4 xs:mb-6 sm:mb-0 lg:col-span-1">
          <h3 className="font-semibold mb-2 xs:mb-3 sm:mb-4 text-sm sm:text-base text-white">Social Media</h3>
          <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-white/85">
            <li><Link href="https://instagram.com" className="hover:text-white transition-colors block py-0.5">Instagram</Link></li>
            <li><Link href="https://facebook.com" className="hover:text-white transition-colors block py-0.5">Facebook</Link></li>
            <li><Link href="https://linkedin.com" className="hover:text-white transition-colors block py-0.5">LinkedIn</Link></li>
            <li><Link href="https://youtube.com" className="hover:text-white transition-colors block py-0.5">YouTube</Link></li>
            <li><Link href="https://tiktok.com" className="hover:text-white transition-colors block py-0.5">Tiktok</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="xs:col-span-2 sm:col-span-1 lg:col-span-1">
          <h3 className="font-semibold mb-2 xs:mb-3 sm:mb-4 text-sm sm:text-base text-white">Support</h3>
          <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-white/85">
            <li><Link href="/privacy-policy" className="hover:text-white transition-colors block py-0.5">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors block py-0.5">Terms of Service</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors block py-0.5">Help Center</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors block py-0.5">Support</Link></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-6 xs:mt-8 sm:mt-10 lg:mt-12 border-t border-white/20 pt-3 xs:pt-4 sm:pt-5 text-center">
        <p className="text-xs text-white/75 px-2">
          © 2025 Aghaai. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;