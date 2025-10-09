"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Upload,
  CheckCircle2,
  Clock,
  X,
  FileText,
} from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useTestNavigation } from "@/components/contexts/TestNavigationContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { isAxiosError } from "axios";
import { essayTimer } from "@/lib/utils/essayTimer";
import { useUserInfo } from "@/components/contexts/UserInfoContext";
import TestWarningDialog from "@/components/dialogs/TestWarningDialog";
import { useNavigationBlock } from "@/hooks/useNavigationBlock";
import AIEvaluationLoader from "@/components/AIEvaluationLoader";

const EssayUploadPage = () => {
  const router = useRouter();
  const { setTestActive } = useTestNavigation();
  const { refreshUserInfo } = useUserInfo();
  
  // Add 15 extra minutes on first load
  useEffect(() => {
    if (!essayTimer.hasExtraTime()) {
      essayTimer.addExtraTime(15 * 60); // Add 15 minutes
      essayTimer.markExtraTimeAdded();
    }
  }, []);
  
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"success" | "error">("success");
  const [dialogTitle, setDialogTitle] = useState("Essay Submission");
  const [dialogDescription, setDialogDescription] = useState("");
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [isTestActive, setIsTestActive] = useState(true);

  // Use navigation block hook to intercept navigation attempts
  useNavigationBlock({
    shouldBlock: isTestActive,
    onNavigationAttempt: () => {
      setShowWarningDialog(true);
    },
  });

  // Handler for when user confirms leaving the test
  const handleConfirmLeave = () => {
    // Deactivate test to allow navigation
    setIsTestActive(false);
    setTestActive(false);
    setShowWarningDialog(false);
    // Clear session data
    sessionStorage.removeItem("essayTestStarted");
    sessionStorage.removeItem("essaySessionId");
    sessionStorage.removeItem("selectedTopic");
    sessionStorage.removeItem("selectedTopicTitle");
    sessionStorage.removeItem("essayMethod");
    essayTimer.clear();
    // Navigate back
    setTimeout(() => {
      router.push("/essay-evaluation");
    }, 0);
  };

  // Handler for when user cancels and stays on the test
  const handleCancelLeave = () => {
    setShowWarningDialog(false);
  };

  // Get selected topic from session storage and validate session
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

    // Check if session exists on page load
    const sessionId = sessionStorage.getItem("essaySessionId");
    if (!sessionId) {
      console.warn("No active session found. Redirecting to essay evaluation.");
      router.push("/essay-evaluation");
      return;
    }

    // Only check mode for NEW active sessions (when coming from essay-test)
    // Don't check mode when viewing historical results
    const essayMethod = sessionStorage.getItem("essayMethod");
    const isNewSession = sessionStorage.getItem("selectedTopic"); // Only exists for new sessions
    
    if (isNewSession && essayMethod === "manual") {
      console.warn("Manual writing mode detected. Redirecting to essay writing page.");
      router.push("/essay-writing");
      return;
    }
  }, [router]);

  // Set test as active when component mounts
  useEffect(() => {
    setTestActive(true);

    return () => {
      setTestActive(false);
    };
  }, [setTestActive]);

  // Timer countdown effect using shared timer
  useEffect(() => {
    const handleTimeExpired = () => {
      // When time expires, clear timer and redirect to results
      essayTimer.clear();
      const hasResult = sessionStorage.getItem("essayResult");
      if (hasResult) {
        router.push("/essay-results");
      } else {
        // If no result yet, redirect to evaluation
        router.push("/essay-results");
      }
    };

    const timer = setInterval(() => {
      const remaining = essayTimer.getRemainingTime();
      setTimeRemaining(remaining);

      // Auto-submit when time expires
      if (remaining <= 0) {
        handleTimeExpired();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

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
      const fileName = file.name.toLowerCase();
      
      // Check for DOC/DOCX extensions explicitly
      const blockedExtensions = ['.doc', '.docx', '.txt', '.rtf', '.odt'];
      const hasBlockedExtension = blockedExtensions.some(ext => fileName.endsWith(ext));
      
      if (hasBlockedExtension) {
        alert("DOC and DOCX files are not supported. Please convert your document to PDF format first.");
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
      
      // Only accept PDF files
      const isPDF = file.type === "application/pdf" && fileName.endsWith(".pdf");

      if (isPDF) {
        // Check file size (max 5MB)
        if (file.size <= 5 * 1024 * 1024) {
          setUploadedFile(file);
        } else {
          alert("File size must be less than 5MB.");
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      } else {
        alert("Please upload only PDF files. Other formats like DOC, DOCX are not supported.");
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
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
      const fileName = file.name.toLowerCase();
      
      // Check for DOC/DOCX extensions explicitly
      const blockedExtensions = ['.doc', '.docx', '.txt', '.rtf', '.odt'];
      const hasBlockedExtension = blockedExtensions.some(ext => fileName.endsWith(ext));
      
      if (hasBlockedExtension) {
        alert("DOC and DOCX files are not supported. Please convert your document to PDF format first.");
        return;
      }
      
      // Only accept PDF files
      const isPDF = file.type === "application/pdf" && fileName.endsWith(".pdf");

      if (isPDF) {
        // Check file size (max 5MB)
        if (file.size <= 5 * 1024 * 1024) {
          setUploadedFile(file);
        } else {
          alert("File size must be less than 5MB.");
        }
      } else {
        alert("Please upload only PDF files. Other formats like DOC, DOCX are not supported.");
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

  const handleSubmitEssay = async () => {
    if (!uploadedFile) {
      setSubmitError("Please upload a PDF file before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Check if session exists and is valid
      const sessionId = sessionStorage.getItem("essaySessionId");
      if (!sessionId) {
        setSubmitError(
          "No active session found. Please start a new essay test."
        );
        setIsSubmitting(false);
        return;
      }

      // Validate session ID format (should be a valid string)
      if (sessionId.trim().length === 0) {
        setSubmitError(
          "Invalid session ID. Please start a new essay test."
        );
        setIsSubmitting(false);
        return;
      }

      console.log("🎯 Session validation passed, ID:", sessionId);
      
      // Get topic title for question
      const topicTitle =
        sessionStorage.getItem("selectedTopicTitle") || selectedTopic;

      // Additional validation
      if (!topicTitle || topicTitle.trim().length === 0) {
        setSubmitError("No topic selected. Please start a new essay test.");
        setIsSubmitting(false);
        return;
      }

      if (!uploadedFile.name || uploadedFile.name.trim().length === 0) {
        setSubmitError("Invalid file. Please upload a valid PDF file.");
        setIsSubmitting(false);
        return;
      }

      // Validate file type
      if (uploadedFile.type !== "application/pdf") {
        setSubmitError("Please upload a valid PDF file.");
        setIsSubmitting(false);
        return;
      }

      // Validate file size (max 5MB)
      if (uploadedFile.size > 5 * 1024 * 1024) {
        setSubmitError("File size must be less than 5MB. Please upload a smaller file.");
        setIsSubmitting(false);
        return;
      }

      console.log("📤 PDF upload submission:", {
        fileName: uploadedFile.name,
        fileSize: uploadedFile.size,
        fileType: uploadedFile.type,
        sessionId: sessionId,
      });

      // Import essayAPI to submit the file
      const { essayAPI } = await import("@/lib/api/essay");
      
      console.log("🚀 Submitting file to API...");

      // Prepare submission payload with file
      const submissionPayload = {
        file: uploadedFile,
        sessionId: sessionId,
      };
      
      // Submit the file and wait for response
      const response = await essayAPI.submitEssay(submissionPayload);
      
      console.log("✅ API Response:", response);
      
      if (response.success && response.data?.result) {
        // Store result info for results page
        const resultInfo = {
          result: response.data.result,
          topicTitle: topicTitle.trim(),
          method: "upload",
          sessionId: sessionId,
        };
        sessionStorage.setItem("essayResult", JSON.stringify(resultInfo));
        sessionStorage.setItem("selectedTopicTitle", topicTitle);
        sessionStorage.setItem("essayMethod", "upload");
        // Mark as completed since we already have the result
        sessionStorage.setItem("essayResultSource", "completed");
        
        console.log("✅ Result stored in sessionStorage with source: completed");
      }

      setTestActive(false); // Deactivate test to allow navigation
      setIsTestActive(false); // Disable navigation blocking
      
      // Clear the essay timer since test is completed
      essayTimer.clear();

      // Clear unrelated session data
      sessionStorage.removeItem("selectedTopic");
      sessionStorage.removeItem("pendingEssaySubmission");
      sessionStorage.removeItem("essayTestStarted");

      setSubmitError(null);
      setIsSubmitting(false);

      // Refresh user info to update token count after submission
      refreshUserInfo({ silent: true });

      // Redirect to results page - result is already loaded
      router.push("/essay-results");
    } catch (err) {
      console.error("Failed to submit essay:", err);
      const message = isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "An error occurred while submitting your essay.";
      setSubmitError(message);
      setDialogType("error");
      setDialogTitle("Submission Failed");
      setDialogDescription(message);
      setDialogOpen(true);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);

    // If dialog is closed and it was a success, redirect to results
    if (!open && dialogType === "success") {
      router.push("/essay-results");
    }
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
          <div className="bg-white rounded-md shadow-sm  p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-700">
                  Essay Topic:
                </h3>
                <p className="text-sm sm:text-lg font-semibold text-[#12675B] underline mt-1">
                  {selectedTopic}
                </p>
              </div>

              {/* Timer */}
              <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-0">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                <div>
                  <div className="text-2xl sm:text-3xl font-semibold text-green-500 leading-none">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    3:15 hour writing & upload timer
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions Box */}
            <div className="mt-5 border border-[#FFD39C] bg-[#FEFCE8] rounded-md p-5">
              <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                Instructions:
              </h4>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-500">
                <li>
                  Prepare an outline and write a comprehensive essay (2500 –
                  3000 words) on any one of the given topics. Make sure you use
                  different forms of discourses, e.g. exposition, argumentation,
                  description and narration. Credit will be given for
                  organization, relevance and clarity.
                </li>
                <li>
                  Candidate must write Q. No. in the Answer Book in accordance
                  with Q. No. in the Q. Paper.
                </li>
                <li>
                  No Page/Space be left blank between the answers. All the blank
                  pages of Answer Book must be cross.
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="bg-white rounded-md shadow-sm gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8">
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
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {/* Supported Formats */}
                    <div className="text-[10px] sm:text-xs text-gray-500">
                      Supported formats: PDF only
                      <br />
                      (Max 5MB per file)
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
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {submitError}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSubmitEssay}
              disabled={!uploadedFile || isSubmitting}
              className="bg-[#1F6B63] hover:bg-[#155a4d] text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 inline-flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base font-semibold rounded-lg shadow-sm transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
            >
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
              {isSubmitting ? "Submitting..." : "Submit Essay"}
            </Button>
          </div>
        </div>

        {/* AI Evaluation Loader Overlay */}
        <AIEvaluationLoader isVisible={isSubmitting} />

        <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogContent onClose={() => handleDialogOpenChange(false)}>
            <DialogHeader>
              <DialogTitle
                className={
                  dialogType === "success" ? "text-[#1F6B63]" : "text-red-600"
                }
              >
                {dialogTitle}
              </DialogTitle>
              <DialogDescription>{dialogDescription}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              {dialogType === "success" ? (
                <Button
                  onClick={() => handleDialogOpenChange(false)}
                  className="bg-[#1F6B63] hover:bg-[#155a4d] text-white"
                >
                  View Results
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => handleDialogOpenChange(false)}
                  className="border-gray-300"
                >
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>

      {/* Warning Dialog for Navigation Attempts */}
      <TestWarningDialog
        isOpen={showWarningDialog}
        onCancel={handleCancelLeave}
        onConfirm={handleConfirmLeave}
      />
    </ProtectedRoute>
  );
};

export default EssayUploadPage;