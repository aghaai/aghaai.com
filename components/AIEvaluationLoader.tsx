"use client";

import React from "react";

interface AIEvaluationLoaderProps {
  isVisible: boolean;
}

const AIEvaluationLoader: React.FC<AIEvaluationLoaderProps> = ({ isVisible }) => {
  if (!isVisible) return null;


  return (
    <div className="fixed inset-0 bg-transparent  backdrop-blur-md z-50 flex flex-col items-center justify-center">
      {/* Main Content Container */}
      <div className="text-center max-w-lg mx-4">
        {/* Animated AI Brain Icon */}
        <div className="mb-8">
          <div className="relative w-24 h-24 mx-auto">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-teal-700 border-t-transparent rounded-full animate-spin"></div>
            
            {/* Inner pulsing circle */}
            <div className="absolute inset-3 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full animate-pulse flex items-center justify-center shadow-lg">
              {/* AI Brain Icon */}
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            
            {/* Floating particles */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-teal-500 rounded-full animate-ping"></div>
            <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-teal-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1 -left-3 w-2 h-2 bg-teal-600 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Main Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Aghaai AI is Evaluating Your Essay
        </h2>

        {/* Animated subtitle with dots */}
        <div className="flex items-center justify-center mb-6">
          <span className="text-lg text-gray-600 mr-2">Analyzing content</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="space-y-3 text-sm text-gray-500 mb-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-teal-600 rounded-full animate-pulse"></div>
            <span>Checking grammar and punctuation</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-teal-600 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            <span>Analyzing structure and organization</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-teal-600 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            <span>Generating personalized feedback</span>
          </div>
        </div>

        {/* Bottom message */}
        <p className="text-gray-400 text-sm">
          This usually takes a few moments...
        </p>
      </div>
    </div>
  );
};

export default AIEvaluationLoader;