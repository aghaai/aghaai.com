"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp,
  PieChart
} from "lucide-react";
import DashboardHero from "@/components/LandingPage/sections/DashboardHero";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { WelcomeDialog } from "@/components/dialogs";

const DashboardPage = () => {
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const userName = "User"; 

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeDialog(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  return (
    <DashboardLayout>
         <DashboardHero />
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Last Score</h3>
                </div>

                  <div className="flex space-x-0.5">
                    <span className="w-3 h-1 bg-green-500 rounded-full"></span>
                    <span className="w-3 h-1 bg-green-500 rounded-full"></span>
                  </div>

                <p className="text-gray-500 text-sm mt-3">Complete your first essay</p>

              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Average Score</h3>
                </div>

                  <div className="flex space-x-0.5">
                    <span className="w-3 h-1 bg-purple-500 rounded-full"></span>
                    <span className="w-3 h-1 bg-purple-500 rounded-full"></span>
                  </div>

                <p className="text-gray-500 text-sm mt-3">No essays yet</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Pass Rate</h3>
                </div>

                 <div className="flex space-x-0.5">
                    <span className="w-3 h-1 bg-yellow-500 rounded-full"></span>
                    <span className="w-3 h-1 bg-yellow-500 rounded-full"></span>
                  </div>

                <p className="text-gray-500 text-sm mt-3">Start evaluating essays</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Progress Trend */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Progress Trend</h3>
                <p className="text-gray-500 text-sm mb-4">Your essay scores will appear here</p>
                
                <div className="h-50 flex items-center justify-center border-dashed border-2 border-gray-200 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-[#6B7280] mx-auto" />
                    <p className="text-[#6B7280] text-sm">Complete your first essay to see progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pass/Fail Ratio */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Pass/Fail Ratio</h3>
                <p className="text-gray-500 text-sm mb-4">Your performance breakdown will appear here</p>
                
                <div className="h-50 flex items-center justify-center border-dashed border-2 border-gray-200 rounded-lg">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
                    <p className="text-[#6B7280] text-sm">Complete essays to see your ratio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

      {/* Welcome Dialog */}
      <WelcomeDialog
        open={showWelcomeDialog}
        onOpenChange={setShowWelcomeDialog}
        userName={userName}
      />
    </DashboardLayout>
  );
};

export default DashboardPage;