"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Coins, Menu } from "lucide-react";
import { useSidebar } from "./DashboardLayout";

const DashboardHeaderWithSidebar = () => {
  const { setIsMobileOpen, isMobileOpen } = useSidebar();

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 sm:flex-none">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome to Aghaai AI, Umer!</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Get Started with AI-powered essay evaluation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-gray-600">
              <span className="text-xs font-medium"><Coins /></span>
            <span className="text-sm font-medium">2/5 Tokens</span>
          </div>
          <Button className="bg-[#1C6758] hover:bg-[#155a4d] text-white px-4 sm:px-6 text-sm">
            Buy more
          </Button>
          <div className="w-10 h-10 bg-orange-400 rounded-full overflow-hidden">
            <Image
              src="/assets/avatar.jpg"
              alt="User Avatar"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeaderWithSidebar;