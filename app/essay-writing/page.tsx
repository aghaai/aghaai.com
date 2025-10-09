"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Plus,
  Minus,
  CheckCircle,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
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

const EssayWritingPage = () => {
  const router = useRouter();
  const { setTestActive } = useTestNavigation();
  const { refreshUserInfo } = useUserInfo();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [essayOutline, setEssayOutline] = useState("");
  const [essayContent, setEssayContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState(
    "The Impact of Artificial Intelligence on Healthcare Systems"
  );
  const [fontSize, setFontSize] = useState(14);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const editorRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
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
    }

    const essayMethod = sessionStorage.getItem("essayMethod");
    const isNewSession = sessionStorage.getItem("selectedTopic"); // Only exists for new sessions
    
    if (isNewSession && essayMethod === "upload") {
      console.warn("PDF upload mode detected. Redirecting to essay upload page.");
      router.push("/essay-upload");
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

  // Keyboard shortcuts for text formatting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            execCommand("bold");
            break;
          case "i":
            e.preventDefault();
            execCommand("italic");
            break;
          case "u":
            e.preventDefault();
            execCommand("underline");
            break;
          case "k":
            e.preventDefault();
            insertLink();
            break;
        }
      }
    };

    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (editor) {
        editor.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, []);

  // Update word count when essay content changes
  useEffect(() => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || "";
      const words = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      setWordCount(text.trim() === "" ? 0 : words.length);
    }
  }, [essayContent]);

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker]);

  // Prevent navigation during active test
  useEffect(() => {
    // Warn before closing tab/window
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

  const handleSubmitEssay = async () => {
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

      // Get essay content
      const content = editorRef.current?.innerText || "";

      if (!content.trim()) {
        setSubmitError("Please write your essay before submitting.");
        setIsSubmitting(false);
        return;
      }

      if (wordCount < 100) {
        setSubmitError("Your essay must be at least 100 words.");
        setIsSubmitting(false);
        return;
      }

      // Get topic title for question
      const topicTitle =
        sessionStorage.getItem("selectedTopicTitle") || selectedTopic;

      // Additional validation
      if (!topicTitle || topicTitle.trim().length === 0) {
        setSubmitError("No topic selected. Please start a new essay test.");
        setIsSubmitting(false);
        return;
      }

      // Prepare submission payload
      const submissionPayload = {
        essayText: content.trim(),
        question: topicTitle.trim(),
      };

      console.log("📝 Essay submission payload:", submissionPayload);
      console.log("🔑 Session ID:", sessionId);
      console.log("📊 Word count:", wordCount);
      console.log("📏 Essay length:", content.trim().length);
      
      // Additional data validation
      if (submissionPayload.essayText.length === 0) {
        setSubmitError("Essay content cannot be empty.");
        setIsSubmitting(false);
        return;
      }

      // Store submission data and set source flag for results page
      try {
        const payloadJson = JSON.stringify(submissionPayload);
        sessionStorage.setItem("pendingEssaySubmission", payloadJson);
        sessionStorage.setItem("essayResultSource", "submit");
        sessionStorage.setItem("selectedTopicTitle", topicTitle);
        sessionStorage.setItem("essayMethod", "manual");
        
        // Verify storage worked
        const storedPayload = sessionStorage.getItem("pendingEssaySubmission");
        if (!storedPayload) {
          throw new Error("Failed to store submission data");
        }
        console.log("✅ Submission data stored successfully");
      } catch (storageError) {
        console.error("❌ Failed to store submission data:", storageError);
        setSubmitError("Failed to prepare submission. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setTestActive(false); // Deactivate test to allow navigation
      setIsTestActive(false); // Disable navigation blocking
      
      // Clear the essay timer since test is completed
      essayTimer.clear();

      // Clear unrelated session data
      sessionStorage.removeItem("selectedTopic");
      sessionStorage.removeItem("essayTestStarted");


      setSubmitError(null);
      setIsSubmitting(false);

      // Refresh user info to update token count after submission
      refreshUserInfo({ silent: true });

      // Redirect to results page immediately - skeleton loader will show there
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);

    // If dialog is closed and it was a success, redirect to results
    if (!open && dialogType === "success") {
      router.push("/essay-results");
    }
  };

  const execCommand = (command: string, value?: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    // Focus the editor first
    editor.focus();

    // Execute the command
    document.execCommand(command, false, value);

    // Update content and maintain focus
    setTimeout(() => {
      if (editorRef.current) {
        setEssayContent(editorRef.current.innerHTML);
        editorRef.current.focus();
      }
    }, 0);
  };

  const handleInput = () => {
    if (editorRef.current) {
      setEssayContent(editorRef.current.innerHTML);
    }
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(parseInt(size));
    execCommand("fontSize", size);
  };

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 2, 24);
    setFontSize(newSize);
    const sizeValue =
      newSize <= 12
        ? "2"
        : newSize <= 14
          ? "3"
          : newSize <= 16
            ? "4"
            : newSize <= 18
              ? "5"
              : newSize <= 20
                ? "6"
                : "7";
    execCommand("fontSize", sizeValue);
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 2, 10);
    setFontSize(newSize);
    const sizeValue = newSize <= 12 ? "2" : newSize <= 14 ? "3" : "4";
    execCommand("fontSize", sizeValue);
  };

  const insertLink = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const url = prompt("Enter URL:", "https://");
    if (url && url.trim()) {
      editor.focus();
      document.execCommand("createLink", false, url);
      setTimeout(() => {
        if (editorRef.current) {
          setEssayContent(editorRef.current.innerHTML);
        }
      }, 0);
    }
  };

  const applyTextColor = (color: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    document.execCommand("foreColor", false, color);
    setSelectedColor(color);
    setShowColorPicker(false);
    setTimeout(() => {
      if (editorRef.current) {
        setEssayContent(editorRef.current.innerHTML);
      }
    }, 0);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {isSubmitting && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#3d2323]/95 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className=" px-6 py-8 sm:px-10 sm:py-12">
                <div className="space-y-4">
                  {[1].map((line) => (
                    <p
                      key={`loader-line-${line}`}
                      className="text-emerald-200 text-base sm:text-lg font-medium tracking-wide animate-pulse"
                    >
                      AI is reviewing your essay
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3 sm:space-y-4 pb-2">
          {/* Essay Topic and Timer Row - Responsive */}
          <div className="bg-white border border-gray-300 rounded-md p-4 sm:p-6">
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
                    3-hour writing timer
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

          {/* Essay Outline Section - Responsive */}
          <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">
              Essay Outline
            </h3>
            <textarea
              value={essayOutline}
              onChange={(e) => setEssayOutline(e.target.value)}
              placeholder="Start writing your essay outline here..."
              className="w-full h-16 sm:h-20 p-2 sm:p-3 bg-[#F7F7F7] border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-0 focus:ring-[#1F6B63] focus:border-[#1F6B63] text-xs sm:text-sm text-gray-700"
            />
          </div>

          {/* Essay Writing Section - Responsive */}
          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border border-gray-200 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-3">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                Essay Writing
              </h3>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <span className="font-semibold">Word Count:</span>
                <span className="text-[#999999]">{wordCount}/2500 words</span>
              </div>
            </div>

            {/* Rich Text Editor Container */}
            <div className="flex flex-col">
              {/* Toolbar - Responsive design */}
              <div className="relative flex flex-wrap items-center gap-0.5 sm:gap-1 py-2 sm:py-3 px-1 overflow-visible">
                {/* Text Formatting Group */}
                <button
                  onClick={() => execCommand("bold")}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded transition-colors active:bg-gray-200"
                  title="Bold (Ctrl+B)"
                  type="button"
                >
                  <Bold
                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-700"
                    strokeWidth={2.5}
                  />
                </button>
                <button
                  onClick={() => execCommand("italic")}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded transition-colors active:bg-gray-200"
                  title="Italic (Ctrl+I)"
                  type="button"
                >
                  <Italic
                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-700"
                    strokeWidth={2.5}
                  />
                </button>
                <button
                  onClick={() => execCommand("underline")}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded transition-colors active:bg-gray-200"
                  title="Underline (Ctrl+U)"
                  type="button"
                >
                  <Underline
                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-700"
                    strokeWidth={2.5}
                  />
                </button>
                <button
                  onClick={() => execCommand("strikeThrough")}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded transition-colors active:bg-gray-200"
                  title="Strikethrough"
                  type="button"
                >
                  <Strikethrough
                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-700"
                    strokeWidth={2.5}
                  />
                </button>

                {/* Divider */}
                <div className="w-px h-4 sm:h-6 bg-gray-300 mx-1 sm:mx-2"></div>

                {/* Font Size Controls */}
                <select
                  onChange={(e) => handleFontSizeChange(e.target.value)}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1F6B63] focus:border-transparent cursor-pointer"
                  defaultValue="14"
                >
                  <option value="10">10</option>
                  <option value="12">12</option>
                  <option value="14">14</option>
                  <option value="16">16</option>
                  <option value="18">18</option>
                  <option value="20">20</option>
                  <option value="24">24</option>
                </select>

                <button
                  onClick={decreaseFontSize}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded transition-colors active:bg-gray-200"
                  title="Decrease font size"
                  type="button"
                >
                  <Minus
                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-700"
                    strokeWidth={2.5}
                  />
                </button>
                <button
                  onClick={increaseFontSize}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded transition-colors active:bg-gray-200"
                  title="Increase font size"
                  type="button"
                >
                  <Plus
                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-700"
                    strokeWidth={2.5}
                  />
                </button>

                {/* Divider */}
                <div className="w-px h-4 sm:h-6 bg-gray-300 mx-1 sm:mx-2"></div>

                {/* Alignment Group */}
                <button
                  onClick={() => execCommand("justifyLeft")}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded transition-colors active:bg-gray-200"
                  title="Align Left"
                  type="button"
                >
                  <AlignLeft
                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-700"
                    strokeWidth={2.5}
                  />
                </button>
                <button
                  onClick={() => execCommand("justifyCenter")}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded transition-colors active:bg-gray-200"
                  title="Align Center"
                  type="button"
                >
                  <AlignCenter
                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-700"
                    strokeWidth={2.5}
                  />
                </button>
                <button
                  onClick={() => execCommand("justifyRight")}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded transition-colors active:bg-gray-200"
                  title="Align Right"
                  type="button"
                >
                  <AlignRight
                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-700"
                    strokeWidth={2.5}
                  />
                </button>
                <button
                  onClick={() => execCommand("justifyFull")}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded transition-colors active:bg-gray-200"
                  title="Justify"
                  type="button"
                >
                  <AlignJustify
                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-700"
                    strokeWidth={2.5}
                  />
                </button>

                {/* Divider */}
                <div className="w-px h-4 sm:h-6 bg-gray-300 mx-1 sm:mx-2"></div>

                {/* Text Color Picker */}
                <div className="relative" ref={colorPickerRef}>
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded transition-colors active:bg-gray-200 relative"
                    title="Text Color"
                    type="button"
                  >
                    <Palette
                      className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-700"
                      strokeWidth={2.5}
                    />
                    <div
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 sm:w-4 h-0.5 sm:h-1 rounded-full"
                      style={{ backgroundColor: selectedColor }}
                    />
                  </button>

                  {/* Color Picker Dropdown */}
                  {showColorPicker && (
                    <div className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 sm:p-3 z-50 min-w-[180px] sm:min-w-[200px]">
                      <div className="text-[10px] sm:text-xs font-medium text-gray-700 mb-2">
                        Text Color
                      </div>
                      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                        {/* Common Colors */}
                        {[
                          { color: "#000000", name: "Black" },
                          { color: "#EF4444", name: "Red" },
                          { color: "#F97316", name: "Orange" },
                          { color: "#EAB308", name: "Yellow" },
                          { color: "#22C55E", name: "Green" },
                          { color: "#3B82F6", name: "Blue" },
                          { color: "#8B5CF6", name: "Purple" },
                          { color: "#EC4899", name: "Pink" },
                          { color: "#1F6B63", name: "Teal" },
                          { color: "#6B7280", name: "Gray" },
                        ].map((item) => (
                          <button
                            key={item.color}
                            onClick={() => applyTextColor(item.color)}
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                            style={{ backgroundColor: item.color }}
                            title={item.name}
                            type="button"
                          />
                        ))}
                      </div>

                      {/* Custom Color Input */}
                      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                        <label className="text-[10px] sm:text-xs font-medium text-gray-700 block mb-1">
                          Custom Color
                        </label>
                        <div className="flex gap-1.5 sm:gap-2 items-center">
                          <input
                            type="color"
                            onChange={(e) => applyTextColor(e.target.value)}
                            className="w-8 h-6 sm:w-10 sm:h-8 rounded border border-gray-300 cursor-pointer"
                            title="Choose custom color"
                          />
                          <span className="text-[10px] sm:text-xs text-gray-500">
                            Pick any color
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Rich Text Editor - Responsive */}
              <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onPaste={(e) => {
                  e.preventDefault();
                  const text = e.clipboardData.getData("text/plain");
                  document.execCommand("insertText", false, text);
                }}
                className="min-h-[250px] sm:min-h-[300px] lg:min-h-[350px] max-h-[300px] sm:max-h-[350px] lg:max-h-[400px] overflow-y-auto p-3 sm:p-4 lg:p-5 text-sm sm:text-[15px] leading-[1.6] sm:leading-[1.8] bg-[#F7F7F7] text-gray-800 rounded-lg border border-gray-200 rounded-b-lg focus:outline-none focus:ring-1 focus:ring-[#1F6B63] focus:border-transparent"
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                }}
                suppressContentEditableWarning={true}
                data-placeholder="Start writing your essay here..."
              />
            </div>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {submitError}
            </div>
          )}

          {/* Submit Button - Responsive */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSubmitEssay}
              disabled={isSubmitting}
              className="bg-[#1F6B63] hover:bg-[#155a4d] text-white px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 inline-flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base font-semibold rounded-lg shadow-sm transition-all hover:shadow-md w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              {isSubmitting ? "Submitting..." : "Submit Essay"}
            </Button>
          </div>
        </div>

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

        <style jsx>{`
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            pointer-events: none;
          }

          [contenteditable]:focus {
            outline: none;
          }

          [contenteditable] strong,
          [contenteditable] b {
            font-weight: 700;
          }

          [contenteditable] em,
          [contenteditable] i {
            font-style: italic;
          }

          [contenteditable] u {
            text-decoration: underline;
          }

          [contenteditable] a {
            color: #1f6b63;
            text-decoration: underline;
            cursor: pointer;
          }

          [contenteditable] ul {
            list-style-type: disc;
            padding-left: 2rem;
            margin: 0.5rem 0;
          }

          [contenteditable] ol {
            list-style-type: decimal;
            padding-left: 2rem;
            margin: 0.5rem 0;
          }

          [contenteditable] li {
            margin: 0.25rem 0;
          }
        `}</style>
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

export default EssayWritingPage;
