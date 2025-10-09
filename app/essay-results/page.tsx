"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  // RefreshCw,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { essayAPI } from "@/lib/api/essay";
import { useUserInfo } from "@/components/contexts/UserInfoContext";
import AIEvaluationLoader from "@/components/AIEvaluationLoader";
import { AxiosError } from "axios";

const EssayResultsPage = () => {
  const router = useRouter();
  const { refreshUserInfo } = useUserInfo();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<Record<string, unknown> | null>(
    null
  );
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    // All accordions start closed by default
  });

  // Toggle accordion section
  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Load essay result from stored data on mount and when session changes
  useEffect(() => {
    const loadEssayResult = async () => {
      setIsLoading(true);
      setError(null);

      let transformedResult: Record<string, unknown> | null = null;
      let derivedTopicTitle: string | null = null;
      let derivedMethod: "manual" | "upload" | null = null;
      let fallbackErrorMessage: string | null = null;

      try {
        const sessionId = sessionStorage.getItem("essaySessionId");
        const resultSource = sessionStorage.getItem("essayResultSource"); // "submit", "history", or "completed"
        const submissionData = sessionStorage.getItem("pendingEssaySubmission");

        console.log(
          "Loading essay result - sessionId:",
          sessionId,
          "source:",
          resultSource,
          "currentSessionId:",
          currentSessionId
        );

        // Update current session ID state
        setCurrentSessionId(sessionId);

        if (sessionId) {
          // Check if this is already completed (file upload), fresh submission (text), or history selection
          if (resultSource === "completed") {
            // File upload - result is already stored
            const storedResult = sessionStorage.getItem("essayResult");
            if (storedResult) {
              try {
                const parsedResult = JSON.parse(storedResult) as Record<string, unknown>;
                transformedResult = parsedResult.result as Record<string, unknown>;
                derivedTopicTitle = (parsedResult.topicTitle as string) || sessionStorage.getItem("selectedTopicTitle");
                derivedMethod = (parsedResult.method as "manual" | "upload") || "upload";
                
                console.log("Loaded completed file upload result:", transformedResult);
                
                // Don't remove the flag yet - it will be removed after data is set
              } catch (parseError) {
                console.error("Failed to parse completed result:", parseError);
                fallbackErrorMessage = "Failed to load essay results.";
              }
            } else {
              // No stored result found despite completed flag
              console.warn("essayResultSource is 'completed' but no essayResult found in storage");
              fallbackErrorMessage = "Essay result data is missing. Please try submitting again.";
            }
          } else if (resultSource === "submit" && submissionData) {
            // This is a fresh submission (text OR file) - use POST API
            try {
              const submissionPayload = JSON.parse(submissionData);
              console.log(
                "Submitting fresh essay for evaluation:",
                submissionPayload
              );

              // Validate payload before submission to catch issues early
              if (!submissionPayload || typeof submissionPayload !== 'object') {
                throw new Error("Invalid submission payload structure");
              }

              // Check if this is a text essay or file upload
              const isFileUpload = 'fileData' in submissionPayload;

              if (isFileUpload) {
                // File upload validation
                if (!submissionPayload.fileData || typeof submissionPayload.fileData !== 'string') {
                  throw new Error("Missing or invalid file data in payload");
                }

                if (!submissionPayload.question || typeof submissionPayload.question !== 'string') {
                  throw new Error("Missing or invalid question in payload");
                }

                console.log("✅ File upload payload validation passed");
                console.log("📋 Session ID:", sessionId);
                console.log("📄 File name:", submissionPayload.fileName);
                console.log("📏 File size:", submissionPayload.fileSize);
                console.log("❓ Question:", submissionPayload.question);

                // Convert base64 back to File object
                const base64Data = submissionPayload.fileData.split(',')[1];
                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const file = new File([byteArray], submissionPayload.fileName, {
                  type: submissionPayload.fileType,
                });

                // Prepare file submission payload
                const payloadWithSession = {
                  file: file,
                  sessionId: sessionId,
                };

                const response = await essayAPI.submitEssay(payloadWithSession);

                if (response.success && response.data?.result) {
                  const apiResult = response.data.result;
                  const rawResponse = (apiResult.rawResponse ?? {}) as Record<
                    string,
                    unknown
                  >;
                  const extractedMetrics = (apiResult.extractedMetrics ??
                    {}) as Record<string, unknown>;
                  const topicFromResult = (apiResult as Record<string, unknown>)
                    .topicTitle as string | undefined;
                  const pdfUrl = (apiResult.pdfUrl ?? null) as string | null;

                  derivedTopicTitle =
                    topicFromResult ||
                    sessionStorage.getItem("selectedTopicTitle") ||
                    null;
                  derivedMethod = "upload";

                  transformedResult = {
                    ...apiResult,
                    rawResponse,
                    extractedMetrics,
                    pdfUrl,
                    topicTitle: derivedTopicTitle ?? undefined,
                    sessionId,
                    source: "submit",
                  } as Record<string, unknown>;

                  console.log("Fresh file upload result:", transformedResult);

                  // Refresh user info to update token count after successful submission
                  refreshUserInfo({ silent: true });

                  // Clear the pending submission data
                  sessionStorage.removeItem("pendingEssaySubmission");
                  sessionStorage.removeItem("essayResultSource");
                }
              } else {
                // Text essay validation
                if (!submissionPayload.essayText || typeof submissionPayload.essayText !== 'string') {
                  throw new Error("Missing or invalid essayText in payload");
                }

                if (!submissionPayload.question || typeof submissionPayload.question !== 'string') {
                  throw new Error("Missing or invalid question in payload");
                }

                if (submissionPayload.essayText.trim().length < 10) {
                  throw new Error("Essay text is too short for evaluation");
                }

                console.log("✅ Text essay payload validation passed");
                console.log("📋 Session ID:", sessionId);
                console.log("📝 Essay length:", submissionPayload.essayText.length);
                console.log("❓ Question:", submissionPayload.question);

                // Add sessionId to the payload
                const payloadWithSession = {
                  ...submissionPayload,
                  sessionId: sessionId,
                };

                const response = await essayAPI.submitEssay(payloadWithSession);

                if (response.success && response.data?.result) {
                  const apiResult = response.data.result;
                  const rawResponse = (apiResult.rawResponse ?? {}) as Record<
                    string,
                    unknown
                  >;
                  const extractedMetrics = (apiResult.extractedMetrics ??
                    {}) as Record<string, unknown>;
                  const topicFromResult = (apiResult as Record<string, unknown>)
                    .topicTitle as string | undefined;
                  const pdfUrl = (apiResult.pdfUrl ?? null) as string | null;

                  derivedTopicTitle =
                    topicFromResult ||
                    sessionStorage.getItem("selectedTopicTitle") ||
                    null;
                  derivedMethod = pdfUrl ? "upload" : "manual";

                  transformedResult = {
                    ...apiResult,
                    rawResponse,
                    extractedMetrics,
                    pdfUrl,
                    topicTitle: derivedTopicTitle ?? undefined,
                    sessionId,
                    source: "submit",
                  } as Record<string, unknown>;

                  console.log("Fresh text submission result:", transformedResult);

                  // Refresh user info to update token count after successful submission
                  refreshUserInfo({ silent: true });

                  // Clear the pending submission data
                  sessionStorage.removeItem("pendingEssaySubmission");
                  sessionStorage.removeItem("essayResultSource");
                }
              }
            } catch (submitError) {
              console.error("❌ Failed to submit essay:", submitError);
              
              // Enhanced error analysis for debugging
              if (submitError && typeof submitError === 'object' && 'response' in submitError) {
                const axiosError = submitError as AxiosError;
                console.error("🔍 API Error Analysis:", {
                  status: axiosError.response?.status,
                  statusText: axiosError.response?.statusText,
                  data: axiosError.response?.data,
                  url: axiosError.config?.url,
                  method: axiosError.config?.method,
                  payload: axiosError.config?.data
                });
                
                const responseData = axiosError.response?.data as { message?: string } | undefined;
                const status = axiosError.response?.status;
                
                if (status === 400) {
                  const errorMessage = responseData?.message || 'Invalid request data';
                  console.error("🚨 400 Bad Request Details:", errorMessage);
                  fallbackErrorMessage = `Submission failed: ${errorMessage}`;
                } else if (status === 401) {
                  fallbackErrorMessage = "Authentication failed. Please log in again.";
                } else if (status === 403) {
                  fallbackErrorMessage = "Access denied. Check if you have sufficient tokens.";
                } else if (status && status >= 500) {
                  fallbackErrorMessage = "Server error occurred. Please try again later.";
                } else {
                  fallbackErrorMessage = responseData?.message || axiosError.message || "Network error occurred.";
                }
              } else if (submitError instanceof Error) {
                fallbackErrorMessage = submitError.message;
              } else {
                fallbackErrorMessage = "Failed to submit essay for evaluation.";
              }
            }
          } else {
            // This is history selection - use GET API
            // First, try to load from sessionStorage if it matches current session
            const storedResult = sessionStorage.getItem("essayResult");

            if (storedResult) {
              try {
                const parsedResult = JSON.parse(storedResult) as Record<
                  string,
                  unknown
                >;
                const storedSessionId =
                  (parsedResult?.sessionId as string) || null;

                // Only use stored result if it matches current session
                if (storedSessionId === sessionId) {
                  const parsedPdfUrl =
                    (parsedResult?.pdfUrl as string | null) ?? null;
                  transformedResult = parsedResult;
                  derivedTopicTitle =
                    (parsedResult?.topicTitle as string | undefined) ||
                    sessionStorage.getItem("selectedTopicTitle");
                  derivedMethod =
                    (parsedResult?.essayMethod as "manual" | "upload") ||
                    (parsedPdfUrl ? "upload" : "manual");

                  console.log(
                    "Loaded result from sessionStorage:",
                    transformedResult
                  );
                }
              } catch (parseError) {
                console.error("Failed to parse stored result:", parseError);
                // Continue to try API fallback
              }
            }

            // Try GET API if we don't have stored data for this session
            if (!transformedResult && sessionId) {
              try {
                console.log(
                  "Attempting to fetch essay result from history for sessionId:",
                  sessionId
                );
                const response = await essayAPI.getEssayResult(sessionId);

                if (response.success && response.data) {
                  const apiResult =
                    response.data.result || response.data.essayResult;
                  if (apiResult) {
                    const rawResponse = (apiResult.rawResponse ?? {}) as Record<
                      string,
                      unknown
                    >;
                    const extractedMetrics = (apiResult.extractedMetrics ??
                      {}) as Record<string, unknown>;
                    const topicFromResult = (
                      apiResult as Record<string, unknown>
                    ).topicTitle as string | undefined;
                    const topicFromSession =
                      response.data.session?.topic?.title;
                    const topicFromRaw =
                      typeof rawResponse.topic === "string"
                        ? rawResponse.topic
                        : undefined;
                    const topicFromRawTitle =
                      typeof rawResponse.topic_title === "string"
                        ? rawResponse.topic_title
                        : undefined;
                    const pdfUrl = (apiResult.pdfUrl ?? null) as string | null;

                    derivedTopicTitle =
                      topicFromResult ||
                      topicFromSession ||
                      topicFromRaw ||
                      topicFromRawTitle ||
                      sessionStorage.getItem("selectedTopicTitle") ||
                      null;

                    console.log("Topic title sources:", {
                      topicFromResult,
                      topicFromSession,
                      topicFromRaw,
                      topicFromRawTitle,
                      sessionStorage:
                        sessionStorage.getItem("selectedTopicTitle"),
                      final: derivedTopicTitle,
                    });
                    derivedMethod = pdfUrl ? "upload" : "manual";

                    transformedResult = {
                      ...apiResult,
                      rawResponse,
                      extractedMetrics,
                      pdfUrl,
                      topicTitle: derivedTopicTitle ?? undefined,
                      sessionId,
                      source: "history",
                    } as Record<string, unknown>;

                    console.log(
                      "Loaded result from history API:",
                      transformedResult
                    );
                  }
                }
              } catch (apiError) {
                console.error(
                  "Failed to fetch essay result from history API:",
                  apiError
                );

                if (apiError instanceof Error) {
                  const errorMessage = apiError.message;

                  // Handle specific error cases
                  if (errorMessage === "Session not yet evaluated") {
                    setError(
                      "Your essay is still being evaluated by our AI. Please wait a moment and try again."
                    );
                    return;
                  } else if (
                    errorMessage ===
                    "Your session has expired. Please log in again."
                  ) {
                    setError("Your session has expired. Please log in again.");
                    return;
                  } else if (
                    errorMessage === "The requested resource was not found."
                  ) {
                    setError(
                      "This essay session could not be found. It may have been deleted or you may not have permission to view it."
                    );
                    return;
                  }

                  fallbackErrorMessage = errorMessage;
                } else {
                  fallbackErrorMessage = "Failed to load essay results.";
                }
              }
            }
          }
        }

        if (transformedResult) {
          const finalTopicTitle =
            derivedTopicTitle ||
            sessionStorage.getItem("selectedTopicTitle") ||
            null;
          const finalMethod =
            derivedMethod || (transformedResult?.pdfUrl ? "upload" : "manual");

          const finalResult = {
            ...transformedResult,
            topicTitle: finalTopicTitle,
            sessionId, // Ensure session ID is stored with result
          } as Record<string, unknown>;

          setResultData(finalResult);
          sessionStorage.setItem("essayResult", JSON.stringify(finalResult));
          if (finalTopicTitle) {
            sessionStorage.setItem("selectedTopicTitle", finalTopicTitle);
          }
          sessionStorage.setItem("essayMethod", finalMethod);
          
          // Clear the result source flag after data is successfully loaded
          sessionStorage.removeItem("essayResultSource");
          sessionStorage.removeItem("pendingEssaySubmission");
          
          // Only set loading to false if we have data to show
          setIsLoading(false);
        } else {
          setError(
            fallbackErrorMessage ||
              "No essay result found. Please start a new essay test."
          );
          setIsLoading(false);
        }
      } catch (err) {
        console.error(
          "An unexpected error occurred while loading essay result:",
          err
        );
        setError("An error occurred while loading your results.");
        setIsLoading(false);
      }
    };

    loadEssayResult();
  }, [router, currentSessionId, refreshUserInfo]);

  // Listen for storage events to handle when history items are clicked
  useEffect(() => {
    const handleStorageChange = () => {
      const newSessionId = sessionStorage.getItem("essaySessionId");
      if (newSessionId && newSessionId !== currentSessionId) {
        setCurrentSessionId(newSessionId);
      }
    };

    // Listen for custom events when sessionStorage changes from same window
    const handleCustomStorageChange = (event: CustomEvent) => {
      if (event.detail?.key === "essaySessionId") {
        const newSessionId = event.detail.newValue;
        console.log("Session storage changed:", {
          oldValue: event.detail.oldValue,
          newValue: newSessionId,
          currentSessionId: currentSessionId,
        });
        if (newSessionId && newSessionId !== currentSessionId) {
          console.log("Setting new session ID:", newSessionId);
          setCurrentSessionId(newSessionId);
        }
      }
    };

    // Add event listeners
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "sessionStorageChange",
      handleCustomStorageChange as EventListener
    );

    // Check on mount for initial session ID
    const initialSessionId = sessionStorage.getItem("essaySessionId");
    if (initialSessionId !== currentSessionId) {
      setCurrentSessionId(initialSessionId);
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "sessionStorageChange",
        handleCustomStorageChange as EventListener
      );
    };
  }, [currentSessionId]);

  const handleBackToHome = () => {
    router.push("/dashboard");
  };

  // const handleReattemptTopic = () => {
  //   router.push("/essay-test");
  // };

  // Show AI Evaluation Loader while loading
  if (isLoading) {
    return <AIEvaluationLoader isVisible={true} />;
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="bg-[#F6F8FB] min-h-screen py-6">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 sm:gap-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={handleBackToHome}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </button>

              {/* <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReattemptTopic}
                  className="border-[#1C6758] bg-transparent text-[#1C6758] hover:bg-[#f0f7f5]"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reattempt Topic
                </Button>
              </div> */}
            </div>



            {/* Error State */}
            {error && !isLoading && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
                <h3 className="mt-4 text-lg font-semibold text-red-900">
                  Error Loading Results
                </h3>
                <p className="mt-2 text-sm text-red-700">{error}</p>
                <Button
                  onClick={() => router.push("/essay-evaluation")}
                  className="mt-4 bg-red-600 hover:bg-red-700"
                >
                  Start New Essay Test
                </Button>
              </div>
            )}

            {/* Results Content */}
            {!isLoading &&
              !error &&
              resultData &&
              (() => {
                const rawResponse =
                  ((resultData as Record<string, unknown>)
                    .rawResponse as Record<string, unknown>) || {};
                const extractedMetrics =
                  ((resultData as Record<string, unknown>)
                    .extractedMetrics as Record<string, unknown>) || {};

                // Only use actual data from API, no fallbacks to static data
                const topicTitle = (resultData as Record<string, unknown>)
                  .topicTitle as string | undefined;
                const overallScore =
                  (extractedMetrics.overall as number) ||
                  (rawResponse.overall_score as number) ||
                  null;
                const grade =
                  (extractedMetrics.grade as string) ||
                  (rawResponse.grade as string) ||
                  null;
                const executiveSummary =
                  (rawResponse.executive_summary as string) || null;
                const strengths =
                  (rawResponse.strengths_to_retain as string[]) || null;
                const weaknesses = (rawResponse.weaknesses as string[]) || null;
                const recommendations =
                  (rawResponse.next_steps_recommendations as string[]) || null;
                const coreMetrics =
                  (rawResponse.core_evaluation_metrics as Record<
                    string,
                    unknown
                  >) || null;
                const languageMetrics =
                  (rawResponse.language_accuracy_style as Record<
                    string,
                    unknown
                  >) || null;
                const detailedAnalysis =
                  (rawResponse.detailed_analysis as Record<string, unknown>) ||
                  null;
                const quickFixes =
                  (rawResponse.quick_mechanical_fixes as Record<
                    string,
                    unknown
                  >) || null;
                const modelCorrections =
                  (rawResponse.model_corrections_examples as Record<
                    string,
                    unknown
                  >) || null;

                return (
                  <>
                    {/* Topic and Overall Score Header - Only show if we have real data */}
                    {(topicTitle || overallScore || grade) && (
                      <section className="rounded-3xl bg-[#135F4A] px-5 py-7 text-white shadow-sm sm:px-10 sm:py-8 lg:px-14 lg:py-10">
                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                          {topicTitle && (
                            <div className="space-y-3 text-center md:text-left">
                              <div className="inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/80 md:justify-start">
                                Topic
                              </div>
                              <h2 className="text-xl font-semibold sm:text-2xl lg:text-[28px]">
                                {topicTitle}
                              </h2>
                            </div>
                          )}

                          {(overallScore || grade) && (
                            <div className="flex flex-col items-center gap-2 md:items-end">
                              <span className="text-xs font-medium uppercase tracking-wide text-white/80">
                                Overall Essay Score
                              </span>
                              {overallScore && (
                                <div className="text-5xl font-bold leading-none sm:text-6xl lg:text-7xl">
                                  {overallScore}%
                                </div>
                              )}
                              {grade && (
                                <span className="rounded-full bg-[#FFC14E] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-black sm:px-6 sm:py-3">
                                  Grade: {grade}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </section>
                    )}

                    {/* Executive Summary - Only show if data exists */}
                    {executiveSummary && executiveSummary.trim() && (
                      <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
                        <h2 className="mb-4 border-b border-gray-200 pb-3 text-lg font-semibold text-[#1C6758] sm:text-xl">
                          Executive Summary
                        </h2>
                        <p className="text-sm leading-relaxed text-slate-600 sm:text-base lg:text-[17px]">
                          {executiveSummary}
                        </p>
                      </section>
                    )}

                    {/* Core Evaluation Metrics - Only show if data exists */}
                    {coreMetrics && Object.keys(coreMetrics).length > 0 && (
                      <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
                        <h2 className="mb-6 border-b border-gray-200 pb-3 text-lg font-semibold text-[#1C6758] sm:text-xl">
                          Core Evaluation Metrics
                        </h2>
                        <div className="space-y-4">
                          {Object.entries(coreMetrics)
                            .filter(([key]) => !key.includes("_comment"))
                            .map(([key, value]) => {
                              const commentKey = `${key}_comment`;
                              const comment =
                                (coreMetrics as Record<string, unknown>)[
                                  commentKey
                                ] || "";
                              const score =
                                typeof value === "number" ? value : 0;
                              const title = key
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (l: string) =>
                                  l.toUpperCase()
                                );

                              return (
                                <div
                                  key={key}
                                  className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-[#FAFAFA] px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="space-y-1">
                                      <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                                        {title}
                                      </h3>
                                      <p className="text-sm text-slate-500 sm:text-[15px]">
                                        {String(comment)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="inline-flex items-center justify-center rounded-2xl bg-[#E0ECFF] px-5 py-3 text-sm font-semibold text-black sm:text-base">
                                    {score}/100
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </section>
                    )}

                    {/* Language Accuracy & Style - Only show if data exists */}
                    {languageMetrics &&
                      Object.keys(languageMetrics).length > 0 && (
                        <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
                          <h2 className="mb-6 border-b border-gray-200 pb-3 text-lg font-semibold text-[#1C6758] sm:text-xl">
                            Language Accuracy & Style
                          </h2>
                          <div className="space-y-3">
                            {Object.entries(languageMetrics).map(
                              ([category, data]) => {
                                const categoryTitle = category
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase());
                                const dataObj = data as Record<string, unknown>;
                                const issuesCount =
                                  typeof dataObj?.issues_count === "number"
                                    ? dataObj.issues_count
                                    : 0;
                                const examples = Array.isArray(
                                  dataObj?.examples
                                )
                                  ? (dataObj.examples as Array<
                                      Record<string, unknown>
                                    >)
                                  : [];

                                // Get score from extractedMetrics based on category
                                const extractedMetrics = (resultData as Record<string, unknown>).extractedMetrics as Record<string, unknown> || {};
                                let score: number | null = null;
                                
                                // Map API category names to extractedMetrics keys
                                if (category === 'grammar_punctuation') {
                                  const grammarScore = extractedMetrics.grammarScore as Record<string, unknown>;
                                  score = typeof grammarScore?.percentScore === 'number' ? grammarScore.percentScore : null;
                                } else if (category === 'tone_formality') {
                                  const toneScore = extractedMetrics.toneScore as Record<string, unknown>;
                                  score = typeof toneScore?.percentScore === 'number' ? toneScore.percentScore : null;
                                } else if (category === 'sentence_clarity_structure') {
                                  const sentenceScore = extractedMetrics.sentenceScore as Record<string, unknown>;
                                  score = typeof sentenceScore?.percentScore === 'number' ? sentenceScore.percentScore : null;
                                } else if (category === 'vocabulary_enhancement') {
                                  const vocabScore = extractedMetrics.vocabScore as Record<string, unknown>;
                                  score = typeof vocabScore?.percentScore === 'number' ? vocabScore.percentScore : null;
                                }

                                const isExpanded = expandedSections[`language-${category}`] || false;

                                return (
                                  <div
                                    key={category}
                                    className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                                  >
                                    <div 
                                      className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-200 border-b border-gray-200"
                                      onClick={() => toggleSection(`language-${category}`)}
                                    >
                                      <div className="flex items-center gap-3">
                                        <h3 className="text-base font-medium text-gray-900">
                                          {categoryTitle}
                                        </h3>
                                        {score !== null && (
                                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                            {score}%
                                          </span>
                                        )}
                                        <span
                                          className={`inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium ${
                                            issuesCount === 0
                                              ? "bg-emerald-100 text-emerald-700"
                                              : issuesCount <= 2
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                          }`}
                                        >
                                          {issuesCount} issues
                                        </span>
                                      </div>
                                      {isExpanded ? (
                                        <ChevronDown className="h-5 w-5 text-gray-500" />
                                      ) : (
                                        <ChevronRight className="h-5 w-5 text-gray-500" />
                                      )}
                                    </div>
                                    {isExpanded && (
                                      <div className="p-4 bg-white">
                                        {examples.length > 0 ? (
                                          <div className="space-y-3">
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Examples:</h4>
                                            {examples.map(
                                              (example, index: number) => (
                                                <div
                                                  key={index}
                                                  className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                                                >
                                                  <div className="flex flex-col space-y-2">
                                                    <div className="flex items-start gap-2">
                                                      <span className="text-xs font-medium text-red-600 uppercase tracking-wide">Before:</span>
                                                      <span className="text-sm text-red-700 leading-relaxed">
                                                        {String(example.before || "")}
                                                      </span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                      <span className="text-xs font-medium text-green-600 uppercase tracking-wide">After:</span>
                                                      <span className="text-sm text-green-700 leading-relaxed">
                                                        {String(example.after || "")}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        ) : (
                                          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                                            <p className="text-sm font-medium text-emerald-700">
                                              ✅ Excellent! No issues found in this category.
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </section>
                      )}

                    {/* Detailed Analysis - Only show if data exists */}
                    {detailedAnalysis &&
                      Object.keys(detailedAnalysis).length > 0 && (
                        <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
                          <h2 className="mb-6 border-b border-gray-200 pb-3 text-lg font-semibold text-[#1C6758] sm:text-xl">
                            Detailed Analysis
                          </h2>
                          <div className="space-y-3">
                            {Object.entries(detailedAnalysis).map(
                              ([key, data]) => {
                                const dataObj = data as Record<string, unknown>;
                                const title = key
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (l: string) =>
                                    l.toUpperCase()
                                  );
                                const issues = Array.isArray(dataObj?.issues)
                                  ? dataObj.issues
                                  : [];
                                const recommendations = Array.isArray(
                                  dataObj?.recommendations
                                )
                                  ? dataObj.recommendations
                                  : [];

                                const isExpanded = expandedSections[`detailed-${key}`] || false;

                                return (
                                  <div
                                    key={key}
                                    className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                                  >
                                    <div 
                                      className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-200 border-b border-gray-200"
                                      onClick={() => toggleSection(`detailed-${key}`)}
                                    >
                                      <h3 className="text-base font-medium text-gray-900">
                                        {title}
                                      </h3>
                                      {isExpanded ? (
                                        <ChevronDown className="h-5 w-5 text-gray-500" />
                                      ) : (
                                        <ChevronRight className="h-5 w-5 text-gray-500" />
                                      )}
                                    </div>
                                    {isExpanded && (
                                      <div className="p-4 bg-white">
                                        <div className="space-y-4">
                                          {issues.length > 0 && (
                                            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
                                              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-700">
                                                <AlertCircle className="h-4 w-4" />
                                                Issues
                                              </p>
                                              <ul className="space-y-1 text-sm text-rose-600">
                                                {issues.map(
                                                  (issue: string, idx: number) => (
                                                    <li
                                                      key={idx}
                                                      className="leading-relaxed"
                                                    >
                                                      • {issue}
                                                    </li>
                                                  )
                                                )}
                                              </ul>
                                            </div>
                                          )}
                                          {recommendations.length > 0 && (
                                            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                                              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                                                <Lightbulb className="h-4 w-4" />
                                                Recommendations
                                              </p>
                                              <ul className="space-y-1 text-sm text-emerald-600">
                                                {recommendations.map(
                                                  (rec: string, idx: number) => (
                                                    <li
                                                      key={idx}
                                                      className="leading-relaxed"
                                                    >
                                                      • {rec}
                                                    </li>
                                                  )
                                                )}
                                              </ul>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </section>
                      )}

                    {/* Quick Mechanical Fixes - Only show if data exists */}
                    {quickFixes &&
                      Object.keys(quickFixes).length > 0 &&
                      (() => {
                        const hasExamples = Object.values(quickFixes).some(
                          (data) => {
                            const dataObj = data as Record<string, unknown>;
                            const examples = Array.isArray(dataObj?.examples)
                              ? dataObj.examples
                              : [];
                            return examples.length > 0;
                          }
                        );

                        return hasExamples ? (
                          <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
                            <h2 className="mb-5 border-b border-gray-200 pb-3 text-lg font-semibold text-[#1C6758] sm:text-xl">
                              Quick Mechanical Fixes
                            </h2>
                            <div className="space-y-3">
                              {Object.entries(quickFixes).map(
                                ([category, data]) => {
                                  const dataObj = data as Record<
                                    string,
                                    unknown
                                  >;
                                  const categoryTitle = category
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (l: string) =>
                                      l.toUpperCase()
                                    );
                                  const issuesCount =
                                    dataObj?.issues_count || 0;
                                  const examples = Array.isArray(
                                    dataObj?.examples
                                  )
                                    ? dataObj.examples
                                    : [];

                                  if (examples.length === 0) return null;

                                  const isExpanded = expandedSections[`quick-${category}`] || false;

                                  return (
                                    <div key={category} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                                      <div 
                                        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-200 border-b border-gray-200"
                                        onClick={() => toggleSection(`quick-${category}`)}
                                      >
                                        <h3 className="text-base font-medium text-gray-900">
                                          {categoryTitle} ({issuesCount as number}{" "}
                                          issues)
                                        </h3>
                                        {isExpanded ? (
                                          <ChevronDown className="h-5 w-5 text-gray-500" />
                                        ) : (
                                          <ChevronRight className="h-5 w-5 text-gray-500" />
                                        )}
                                      </div>
                                      {isExpanded && (
                                        <div className="p-4 bg-white">
                                          <div className="space-y-3">
                                            {examples.map(
                                              (
                                                fix: Record<string, unknown>,
                                                index: number
                                              ) => (
                                                <div
                                                  key={`${category}-fix-${index}`}
                                                  className="flex items-start gap-3 rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm"
                                                >
                                                  <AlertCircle className="mt-0.5 h-4 w-4 text-yellow-600" />
                                                  <div className="flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                      <span className="font-medium text-slate-600">
                                                        {String(fix.before || "")}
                                                      </span>
                                                      <ArrowRight className="h-5 w-5 " />
                                                      <span className="font-medium text-slate-600">
                                                        {String(fix.after || "")}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </section>
                        ) : null;
                      })()}

                    {/* Model Corrections & Examples - Only show if data exists */}
                    {modelCorrections &&
                      Object.keys(modelCorrections).length > 0 &&
                      (() => {
                        const hasValidContent = Object.values(
                          modelCorrections
                        ).some(
                          (value) =>
                            typeof value === "string" && value.trim().length > 0
                        );

                        return hasValidContent ? (
                          <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
                            <h2 className="mb-6 border-b border-gray-200 pb-3 text-lg font-semibold text-[#1C6758] sm:text-xl">
                              Model Corrections & Examples
                            </h2>
                            <div className="space-y-3">
                              {Object.entries(modelCorrections).map(
                                ([key, value], index) => {
                                  if (
                                    typeof value !== "string" ||
                                    !value.trim()
                                  )
                                    return null;
                                  const title = key
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (l: string) =>
                                      l.toUpperCase()
                                    );

                                  const isExpanded = expandedSections[`model-${key}`] || false;

                                  return (
                                    <div key={key} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                                      <div 
                                        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-200 border-b border-gray-200"
                                        onClick={() => toggleSection(`model-${key}`)}
                                      >
                                        <h3 className="text-base font-medium text-gray-900">
                                          {title}
                                        </h3>
                                        {isExpanded ? (
                                          <ChevronDown className="h-5 w-5 text-gray-500" />
                                        ) : (
                                          <ChevronRight className="h-5 w-5 text-gray-500" />
                                        )}
                                      </div>
                                      {isExpanded && (
                                        <div className="p-4 bg-white">
                                          <div
                                            className={`rounded-lg p-4 ${
                                              index === 0
                                                ? "bg-green-50 border border-green-200"
                                                : index === 1
                                                  ? "bg-blue-50 border border-blue-200"
                                                  : "bg-purple-50 border border-purple-200"
                                            }`}
                                          >
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                                              {value}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </section>
                        ) : null;
                      })()}

                    {/* Strengths to Retain - Only show if data exists */}
                    {strengths &&
                      Array.isArray(strengths) &&
                      strengths.length > 0 && (
                        <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
                          <h2 className="mb-6 border-b border-gray-200 pb-3 text-lg font-semibold text-emerald-600 sm:text-xl">
                            <CheckCircle2 className="mr-2 inline h-5 w-5" />
                            Strengths to Retain
                          </h2>
                          <div className="space-y-3">
                            {strengths.map(
                              (strength: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-4"
                                >
                                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                                  <p className="text-sm text-emerald-800 sm:text-base">
                                    {strength}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </section>
                      )}

                    {/* Areas for Improvement - Only show if data exists */}
                    {weaknesses &&
                      Array.isArray(weaknesses) &&
                      weaknesses.length > 0 && (
                        <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
                          <h2 className="mb-6 border-b border-gray-200 pb-3 text-lg font-semibold text-red-600 sm:text-xl">
                            <AlertCircle className="mr-2 inline h-5 w-5" />
                            High-impact Weakness
                          </h2>
                          <div className="space-y-3">
                            {weaknesses.map(
                              (weakness: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-3 rounded-lg border border-amber-100 bg-red-50 p-4"
                                >
                                  <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600" />
                                  <p className="text-sm text-amber-800 sm:text-base">
                                    {weakness}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </section>
                      )}

                    {/* Next Steps Recommendations - Only show if data exists */}
                    {recommendations &&
                      Array.isArray(recommendations) &&
                      recommendations.length > 0 && (
                        <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
                          <h2 className="mb-6 border-b border-gray-200 pb-3 text-lg font-semibold text-[#1C6758] sm:text-xl">
                            <Lightbulb className="mr-2 inline h-5 w-5" />
                            Next Steps & Recommendations
                          </h2>
                          <div className="space-y-3">
                            {recommendations.map(
                              (recommendation: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4"
                                >
                                  <Lightbulb className="mt-0.5 h-4 w-4 text-blue-600" />
                                  <p className="text-sm text-blue-800 sm:text-base">
                                    {recommendation}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </section>
                      )}

                    {/* Essay Content Review */}
                    {resultData?.essayText && (
                      <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
                        <h2 className="mb-6 border-b border-gray-200 pb-3 text-lg font-semibold text-[#1C6758] sm:text-xl">
                          Your Essay
                        </h2>
                        <div className="rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
                          <p className="whitespace-pre-wrap">
                            {String(
                              (resultData as Record<string, unknown>)
                                ?.essayText || ""
                            )}
                          </p>
                        </div>
                      </section>
                    )}
                  </>
                );
              })()}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default EssayResultsPage;
