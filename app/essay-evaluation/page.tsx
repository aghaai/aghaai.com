"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  Type,
  Edit3,
  Upload,
  Play,
  Check,
} from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { essayAPI } from "@/lib/api/essay";
import { isAxiosError } from "axios";
import { essayTimer } from "@/lib/utils/essayTimer";

const EssayEvaluationPage = () => {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<
    "manual" | "upload" | null
  >(null);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartTest = async () => {
    if (!selectedMethod) return;

    try {
      setIsStarting(true);
      setError(null);

      // Start essay session
      const mode = selectedMethod === "upload" ? "pdf" : "text";
      const response = await essayAPI.startSession({ mode });

      if (response.success && response.data?.sessionId) {
        // Store session ID and method
        sessionStorage.setItem("essaySessionId", response.data.sessionId);
        sessionStorage.setItem("essayMethod", selectedMethod);
        // Set flag to indicate test has started from essay-evaluation
        sessionStorage.setItem("essayTestStarted", "true");
        
        // Start the essay timer (3 hours = 180 minutes = 10800 seconds)
        essayTimer.start(3 * 60 * 60);
        
        // Navigate to topic selection
        router.push("/essay-test");
      } else {
        setError("Failed to start essay session. Please try again.");
      }
    } catch (err) {
      console.error("Failed to start session:", err);
      const message = isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "An error occurred while starting the session.";
      setError(message);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Main Content */}
        <div className="max-w-7xl mx-auto bg-white rounded-xl border border-gray-200 p-8 sm:p-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <FileText className="w-8 h-8 text-[#817E7E] mx-auto mb-2" />
            <h2 className="text-2xl font-semibold mb-1">
              Essay Evaluation Test
            </h2>
            <p className="text-base text-[#B8B5B5] max-w-2xl mx-auto">
              Take a comprehensive AI-powered assessment of your essay writing
              skills.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
            {/* Topic Choice */}
            <div className="flex items-center gap-4">
              <div className="w-7 h-7 bg-[#A83D81] rounded-sm flex items-center justify-center flex-shrink-0">
                <Check className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[#A83D81] text-lg">
                  Topic Choice
                </h3>
                <p className="text-sm text-gray-600">5 options provided</p>
              </div>
            </div>
            {/* Purple checkmark */}
            <div className="absolute top-4 right-4 w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* Time Limit */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#5AAD49] rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[#5AAD49] text-lg">
                  Time Limit
                </h3>
                <p className="text-sm text-gray-600">3 hours maximum</p>
              </div>
            </div>

            {/* Word Count */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#5DADC3] rounded-xl flex items-center justify-center flex-shrink-0">
                <Type className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[#5DADC3] text-lg">
                  Word Count
                </h3>
                <p className="text-sm text-gray-600">2500 words minimum</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto">
          {/* Input Method Selection */}
          <div className="mb-8 bg-[#F7F7F7] py-4 px-16 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 ">
              Choose Your Input Method
            </h3>
            <p className="text-gray-600 mb-2">
              Select how you&apos;d like to submit your essay for evaluation
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Write Manually */}
              <Card
                className={`cursor-pointer transition-all duration-200 border-2 ${
                  selectedMethod === "manual"
                    ? "border-[#1F6B63] bg-[#1F6B63]/5"
                    : "border-dashed border-black"
                }`}
                onClick={() => setSelectedMethod("manual")}
              >
                <CardContent className="px-8 py-6 text-center">
                  <Edit3 className="w-6 h-6 mx-auto" />
                  <h4 className="font-medium text-xl">Write Typing</h4>
                  <p className="text-sm text-[#ADADAD]">
                    Type your essay directly in our rich text editor
                  </p>
                </CardContent>
              </Card>

              {/* Upload Images/PDF */}
              <Card
                className={`cursor-pointer transition-all duration-200 border-2 ${
                  selectedMethod === "upload"
                    ? "border-[#1F6B63] bg-[#1F6B63]/5"
                    : "border-dashed border-black"
                }`}
                onClick={() => setSelectedMethod("upload")}
              >
                <CardContent className="px-8 py-6 text-center">
                  <Upload className="w-6 h-6 mx-auto" />
                  <h4 className="font-medium text-xl">Upload PDF</h4>
                  <p className="text-sm text-[#ADADAD]">
                    Upload PDF of handwritten essays
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          {/* Start Test Button */}
          <div className="text-center">
            <Button
              onClick={handleStartTest}
              className="bg-[#1F6B63] hover:bg-[#155a4d] text-white px-8 py-3 text-lg font-semibold inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedMethod || isStarting}
            >
              <Play className="w-5 h-5" />
              {isStarting ? "Starting..." : "Start Test"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  );
};

export default EssayEvaluationPage;
