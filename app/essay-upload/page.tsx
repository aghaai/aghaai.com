"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle2, Clock, X, FileText } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useTestNavigation } from "@/components/contexts/TestNavigationContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const EssayUploadPage = () => {
  const router = useRouter();
  const { setTestActive } = useTestNavigation();
  const [timeRemaining, setTimeRemaining] = useState(3 * 60 * 60 + 15 * 60); // 3:05:00 (3 hours + 15 minutes)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get selected topic from session storage
  useEffect(() => {
    const topicTitle = sessionStorage.getItem("selectedTopicTitle");
    if (topicTitle) {
      setSelectedTopic(topicTitle);
    } else {
      const topicId = sessionStorage.getItem("selectedTopic");
      const topics = [
        "The Impact of Artificial Intelligence on Healthcare Systems",
        "Digital Education and the Future of Learning",
        "The Role of Technology in Sustainable Agriculture",
      ];

      if (topicId) {
        const index = parseInt(topicId) - 1;
        setSelectedTopic(topics[index] || topics[0]);
      } else {
        setSelectedTopic(topics[0]);
      }
    }
  }, []);

  // Set test as active when component mounts
  useEffect(() => {
    setTestActive(true);

    return () => {
      setTestActive(false);
    };
  }, [setTestActive]);

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

  // Prevent navigation during active test
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.type === "application/pdf") {
        // Check file size (max 10MB)
        if (file.size <= 10 * 1024 * 1024) {
          setUploadedFile(file);
        } else {
          alert("File size must be less than 10MB.");
        }
      } else {
        alert("Please upload only PDF files.");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];

      if (file.type === "application/pdf") {
        // Check file size (max 10MB)
        if (file.size <= 10 * 1024 * 1024) {
          setUploadedFile(file);
        } else {
          alert("File size must be less than 10MB.");
        }
      } else {
        alert("Please upload only PDF files.");
      }
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleSubmitEssay = () => {
    if (!uploadedFile) {
      alert("Please upload a PDF file before submitting.");
      return;
    }

    setTestActive(false); // Deactivate test to allow navigation
    console.log("Submitting essay file...");
    console.log("Uploaded File:", uploadedFile);

    // TODO: Upload file to API for evaluation
    // const formData = new FormData();
    // formData.append('file', uploadedFile);
    // const response = await essayAPI.uploadEssay(formData);

    // Clear test data
    sessionStorage.removeItem("selectedTopic");
    sessionStorage.removeItem("selectedTopicTitle");
    sessionStorage.removeItem("essayMethod");

    // Navigate to results page
    router.push("/essay-results");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-3 sm:space-y-4 pb-2">
        {/* Essay Topic Section */}
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">
            Essay Topic:
          </h3>
          <p className="text-xs sm:text-sm text-gray-500">{selectedTopic}</p>
        </div>

        {/* Main Content Grid */}
        <div className="bg-white grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8">
          <div className="">
            <div
              className={`border-2 border-dashed rounded-lg p-4 sm:p-6 lg:p-8 transition-all min-h-[300px] sm:min-h-[350px] flex flex-col items-center justify-center ${
                isDragging
                  ? "border-[#1F6B63] bg-[#1F6B63]/5"
                  : "border-gray-300 bg-white"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!uploadedFile ? (
                <div className="text-center">
                  {/* Upload Icon */}
                  <div className="mb-3 sm:mb-4 flex justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                      <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                    </div>
                  </div>

                  {/* Upload Text */}
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    Upload Your Essay Files
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4">
                    Drag and drop your file here, or click to browse
                  </p>

                  {/* Choose Files Button */}
                  <Button
                    onClick={handleChooseFiles}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-4 sm:px-6 py-2 sm:py-2.5 inline-flex items-center gap-2 text-xs sm:text-sm font-medium mb-3 sm:mb-4"
                  >
                    <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Choose Files
                  </Button>

                  {/* File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* Supported Formats */}
                  <div className="text-[10px] sm:text-xs text-gray-500">
                    Supported formats: PDF only
                    <br />
                    (Max 10MB per file)
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  {/* Uploaded File Display */}
                  <div className="flex flex-col items-center justify-center mb-4 sm:mb-6">
                    <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mb-3 sm:mb-4" />
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                      Selected File:
                    </h4>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      {/* File Icon */}
                      <div className="flex-shrink-0">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {uploadedFile.name}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500">
                          {formatFileSize(uploadedFile.size)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={removeFile}
                        className="flex-shrink-0 p-1.5 sm:p-2 hover:bg-gray-200 rounded transition-colors"
                        title="Remove file"
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* Change File Button */}
                  <div className="mt-4 sm:mt-6 text-center">
                    <Button
                      onClick={handleChooseFiles}
                      variant="outline"
                      className="text-gray-700 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm px-3 sm:px-4 py-2"
                    >
                      <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      Change File
                    </Button>
                  </div>

                  {/* File Input (hidden) */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Timer and Instructions - Right Side */}
          <div className="space-y-3 sm:space-y-4">
            {/* Timer Section */}
            <div className="bg-[#F8F8F8] py-2 px-4 sm:px-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mt-2 sm:mt-3" />
                <div className="flex-1 mt-1 sm:mt-2">
                  <div className="text-2xl sm:text-3xl font-bold text-green-500">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-600">
                    3 hours writing time + 15 minutes uploading time
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="bg-[#FEFCE8] p-4 sm:p-6 rounded-lg border border-gray-200">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">
                Instructions:
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-gray-900 mt-0.5 sm:mt-1">•</span>
                  <span>Write your essay clearly on paper</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-900 mt-0.5 sm:mt-1">•</span>
                  <span>Ensure handwriting is legible for scanning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-900 mt-0.5 sm:mt-1">•</span>
                  <span>
                    Structure your essay with clear outline, body, and
                    conclusion
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-900 mt-0.5 sm:mt-1">•</span>
                  <span>
                    After 3 hours (or early finish), you&apos;ll get 5 minutes
                    to upload scanned pages
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSubmitEssay}
            disabled={!uploadedFile}
            className="bg-[#1F6B63] hover:bg-[#155a4d] text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 inline-flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base font-semibold rounded-lg shadow-sm transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
          >
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            Submit Essay
          </Button>
        </div>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  );
};

export default EssayUploadPage;
