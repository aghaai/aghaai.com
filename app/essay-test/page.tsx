"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileText, Play, Clock } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const EssayTestPage = () => {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(3 * 60 * 60); // 3 hours in seconds

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
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const topics = [
    {
      id: 1,
      title: "Economic Implications of Renewable Energy Transition"
    },
    {
      id: 2,
      title: "Digital Education and the Future of Learning"
    },
    {
      id: 3,
      title: "The Role of Technology in Sustainable Agriculture"
    }
  ];

    const handleStartWriting = () => {
    if (selectedTopic !== null) {
      // Find the selected topic title
      const topic = topics.find(t => t.id === selectedTopic);
      
      // Save both topic ID and title to session storage
      sessionStorage.setItem('selectedTopic', selectedTopic.toString());
      if (topic) {
        sessionStorage.setItem('selectedTopicTitle', topic.title);
      }
      
      // Check the method selected in essay-evaluation
      const method = sessionStorage.getItem('essayMethod');
      
      // Navigate based on method
      if (method === 'upload') {
        router.push('/essay-upload');
      } else {
        router.push('/essay-writing');
      }
    }
  };

  return (
    <DashboardLayout>
        <div className="bg-white">
      {/* Timer Section */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-3 px-8 py-4">
            <Clock className="w-8 h-8 text-[#9C9C9C]" />
          <div>
            <div className="text-2xl font-bold text-[#2AC252]">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-xs text-[#999999]">3-hour writing timer</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto  p-6">
        {/* Title Section */}
        <div className="text-center mb-8">
            <FileText className="w-8 h-8 mx-auto text-[#817E7E] mb-2" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Choose Your Essay Topic
          </h2>
          <p className="text-sm text-[#B8B5B5] max-w-xl mx-auto">
            Select one topic from the three options below. Once selected, your timer will begin.
          </p>
        </div>

        {/* Topic Selection */}
        <div className="space-y-3 mb-8">
          {topics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedTopic === topic.id
                  ? 'border-[#1F6B63] bg-[#1F6B63]/5'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {/* Topic Number */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-base ${
                selectedTopic === topic.id
                  ? 'bg-[#1F6B63] text-white'
                  : 'bg-gray-900 text-white'
              }`}>
                {topic.id}
              </div>
              
              {/* Topic Title */}
              <div className="flex-1">
                <h3 className={`text-base font-medium ${
                  selectedTopic === topic.id ? 'text-[#1F6B63]' : 'text-gray-700'
                }`}>
                  {topic.title}
                </h3>
              </div>

              {/* Selection Indicator */}
              {selectedTopic === topic.id && (
                <div className="w-5 h-5 bg-[#1F6B63] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Start Button */}
        <div className="text-center">
          <Button
            onClick={handleStartWriting}
            disabled={selectedTopic === null}
            className={`px-6 py-2.5 text-base font-semibold inline-flex items-center gap-2 ${
              selectedTopic !== null
                ? 'bg-[#1F6B63] hover:bg-[#155a4d] text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4" />
            Start Essay Test
          </Button>
        </div>
      </div>

      </div>
    </DashboardLayout>
  );
};

export default EssayTestPage;