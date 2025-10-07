"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileText, Play, Clock } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { topicsAPI, type Topic } from "@/lib/api/topics";
import { essayAPI } from "@/lib/api/essay";
import { isAxiosError } from "axios";

const EssayTestPage = () => {
  const router = useRouter();
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(3 * 60 * 60); // 3 hours in seconds
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState<boolean>(false);
  const [topicsError, setTopicsError] = useState<string | null>(null);
  const [isSelectingTopic, setIsSelectingTopic] = useState(false);
  const [selectError, setSelectError] = useState<string | null>(null);

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const fetchRandomTopics = useCallback(async () => {
    try {
      setIsLoadingTopics(true);
      setTopicsError(null);
      const response = await topicsAPI.getRandomTopics();
      if (
        response.success &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        setTopics(response.data);
        setSelectedTopicId(null);
      } else {
        setTopics([]);
        setTopicsError("No topics were returned. Please try again.");
      }
    } catch (error) {
      console.error("Failed to load topics", error);
      setTopicsError("Unable to load topics. Please try again.");
      setTopics([]);
    } finally {
      setIsLoadingTopics(false);
    }
  }, []);

  useEffect(() => {
    fetchRandomTopics();
  }, [fetchRandomTopics]);

  const handleStartWriting = async () => {
    if (selectedTopicId === null) return;

    try {
      setIsSelectingTopic(true);
      setSelectError(null);

      const sessionId = sessionStorage.getItem("essaySessionId");
      if (!sessionId) {
        setSelectError(
          "No active session found. Please start a new essay test."
        );
        setTimeout(() => {
          router.push("/essay-evaluation");
        }, 1500);
        setIsSelectingTopic(false);
        return;
      }

      // Call select topic API
      const response = await essayAPI.selectTopic({
        topicId: selectedTopicId,
      });

      if (response.success) {
        // Find the selected topic title
        const topic = topics.find((t) => t._id === selectedTopicId);

        // Save both topic ID and title to session storage
        sessionStorage.setItem("selectedTopic", selectedTopicId);
        if (topic) {
          sessionStorage.setItem("selectedTopicTitle", topic.title);
        }

        // Update session ID from response
        if (response.data?.sessionId) {
          sessionStorage.setItem("essaySessionId", response.data.sessionId);
        }

        // Call start-essay endpoint
        const startEssayResponse = await essayAPI.startEssay();

        if (startEssayResponse.success && startEssayResponse.data?.sessionId) {
          sessionStorage.setItem(
            "essaySessionId",
            startEssayResponse.data.sessionId
          );

          // Check the method selected in essay-evaluation
          const method = sessionStorage.getItem("essayMethod");

          // Navigate based on method
          if (method === "upload") {
            router.push("/essay-upload");
          } else {
            router.push("/essay-writing");
          }
        } else {
          setSelectError("Failed to start essay. Please try again.");
        }
      } else {
        setSelectError("Failed to select topic. Please try again.");
      }
    } catch (err) {
      console.error("Failed to select topic:", err);
      const message = isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "An error occurred while selecting the topic.";
      setSelectError(message);
    } finally {
      setIsSelectingTopic(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="bg-white">
          {/* Timer Section */}
          <div className="flex justify-end">
            <div className="flex items-center gap-3 px-8 py-4">
              <Clock className="w-8 h-8 text-[#9C9C9C]" />
              <div>
                <div className="text-2xl font-bold text-[#2AC252]">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-xs text-[#999999]">
                  3-hour writing timer
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-3xl mx-auto ">
            {/* Title Section */}
            <div className="text-center mb-4">
              <FileText className="w-8 h-8 mx-auto text-[#817E7E] mb-2" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                Choose Your Essay Topic
              </h2>
              <p className="text-sm text-[#B8B5B5] max-w-xl mx-auto">
                Select one topic from the three options below. Once selected,
                your timer will begin.
              </p>
            </div>

            {/* Topic Selection */}
            <div className="space-y-2 mb-8">
              {isLoadingTopics && (
                <div className="space-y-3">
                  {[0, 1, 2].map((skeleton) => (
                    <div
                      key={`skeleton-${skeleton}`}
                      className="animate-pulse flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 bg-gray-50"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-200" />
                      <div className="flex-1 h-4 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              )}

              {!isLoadingTopics && topicsError && (
                <div className="p-4 border border-red-200 bg-red-50 text-sm text-red-700 rounded-md">
                  {topicsError}
                </div>
              )}

              {!isLoadingTopics && !topicsError && topics.length === 0 && (
                <div className="p-4 border border-gray-200 bg-gray-50 text-sm text-gray-600 rounded-md">
                  No topics available at the moment. Please try refreshing.
                </div>
              )}

              {!isLoadingTopics &&
                !topicsError &&
                topics.map((topic, index) => (
                  <div
                    key={topic._id}
                    onClick={() => setSelectedTopicId(topic._id)}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedTopicId === topic._id
                        ? "border-[#1F6B63] bg-[#1F6B63]/5"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {/* Topic Number */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-base ${
                        selectedTopicId === topic._id
                          ? "bg-[#1F6B63] text-white"
                          : "bg-gray-900 text-white"
                      }`}
                    >
                      {(index + 1).toString().padStart(2, "0")}
                    </div>

                    {/* Topic Title */}
                    <div className="flex-1">
                      <h3
                        className={`text-base font-medium ${
                          selectedTopicId === topic._id
                            ? "text-[#1F6B63]"
                            : "text-gray-700"
                        }`}
                      >
                        {topic.title}
                      </h3>
                    </div>

                    {/* Selection Indicator */}
                    {selectedTopicId === topic._id && (
                      <div className="w-5 h-5 bg-[#1F6B63] rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Error Message */}
            {selectError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
                {selectError}
              </div>
            )}

            {/* Start Button */}
            <div className="text-center lg:pb-4">
              <Button
                onClick={handleStartWriting}
                disabled={selectedTopicId === null || isSelectingTopic}
                className={`px-6 py-2.5 text-base font-semibold inline-flex items-center gap-2 ${
                  selectedTopicId !== null && !isSelectingTopic
                    ? "bg-[#1F6B63] hover:bg-[#155a4d] text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Play className="w-4 h-4" />
                {isSelectingTopic ? "Selecting..." : "Start Essay Test"}
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default EssayTestPage;
