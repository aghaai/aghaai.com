"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Loader2,
} from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const EssayResultsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<Record<string, unknown> | null>(null);
  const [topicTitle, setTopicTitle] = useState("Essay Topic");
  const [overallScore, setOverallScore] = useState(0);
  const [grade, setGrade] = useState("");
  const [executiveSummary, setExecutiveSummary] = useState("");
  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [coreMetrics, setCoreMetrics] = useState<Record<string, unknown>>({});
  const [languageMetrics, setLanguageMetrics] = useState<Record<string, unknown>>({});

  // Load essay result from stored data on mount
  useEffect(() => {
    const loadEssayResult = () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get stored result data
        const storedResult = sessionStorage.getItem("essayResult");
        const storedTopicTitle = sessionStorage.getItem("selectedTopicTitle");
        
        if (!storedResult) {
          setError("No essay result found. Please start a new essay test.");
          setIsLoading(false);
          return;
        }

        try {
          const result = JSON.parse(storedResult);
          console.log("Loaded essay result data:", result);
          
          // Update topic title
          if (storedTopicTitle) {
            setTopicTitle(storedTopicTitle);
          }
          
          // Extract data from the result
          const extractedMetrics = result.extractedMetrics || {};
          const rawResponse = result.rawResponse || {};
          const coreEvalMetrics = rawResponse.core_evaluation_metrics || {};
          
          // Update basic info
          setOverallScore(extractedMetrics.overall_score || rawResponse.overall_score || 0);
          setGrade(extractedMetrics.grade || rawResponse.grade || '');
          setExecutiveSummary(extractedMetrics.executive_summary || rawResponse.executive_summary || '');
          setStrengths(extractedMetrics.strengths_to_retain || rawResponse.strengths_to_retain || []);
          setWeaknesses(extractedMetrics.weaknesses || rawResponse.weaknesses || []);
          setRecommendations(extractedMetrics.next_steps_recommendations || rawResponse.next_steps_recommendations || []);
          
          // Update core metrics
          setCoreMetrics(coreEvalMetrics);
          
          // Update language metrics
          setLanguageMetrics(rawResponse.language_accuracy_style || {});
          
          // Store complete result for reference
          setResultData(result);

          // Keep session data available for potential page refreshes
          // sessionStorage.removeItem("essayResult");
          // sessionStorage.removeItem("essaySessionId");
          // sessionStorage.removeItem("selectedTopicTitle");
        } catch (parseError) {
          console.error("Failed to parse stored result:", parseError);
          setError("Invalid result data. Please start a new essay test.");
        }
      } catch (err) {
        console.error("Failed to load essay result:", err);
        setError("An error occurred while loading your results.");
      } finally {
        setIsLoading(false);
      }
    };

    loadEssayResult();
  }, [router]);

  const handleBackToHome = () => {
    router.push("/dashboard");
  };

  const handleReattemptTopic = () => {
    router.push("/essay-test");
  };

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

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReattemptTopic}
                  className="border-[#1C6758] bg-transparent text-[#1C6758] hover:bg-[#f0f7f5]"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reattempt Topic
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-[#1C6758]" />
                <p className="mt-4 text-lg text-slate-600">Loading your essay results...</p>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
                <h3 className="mt-4 text-lg font-semibold text-red-900">Error Loading Results</h3>
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
            {!isLoading && !error && resultData && (
              <>
            {/* Topic and Overall Score Header */}
            <section className="rounded-3xl bg-[#135F4A] px-5 py-7 text-white shadow-sm sm:px-10 sm:py-8 lg:px-14 lg:py-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3 text-center md:text-left">
                  <div className="inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/80 md:justify-start">
                    Topic
                  </div>
                  <h1 className="text-xl font-bold leading-tight sm:text-2xl lg:text-3xl">
                    {topicTitle}
                  </h1>
                </div>
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-white/80">
                      Essay Score
                    </div>
                    <div className="text-4xl font-bold sm:text-5xl">
                      {overallScore}
                    </div>
                    {grade && (
                      <div className="mt-1 text-lg font-semibold">
                        Grade: {grade}
                      </div>
                    )}
                  </div>
                  <div className="h-12 w-px bg-white/20 hidden sm:block"></div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-white/80">
                      Status
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                      <span className="font-semibold">Evaluated</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Executive Summary */}
            {executiveSummary && (
              <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
                <h2 className="mb-4 text-lg font-semibold text-[#1C6758] sm:text-xl">
                  Executive Summary
                </h2>
                <div className="rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                  {executiveSummary}
                </div>
              </section>
            )}

            {/* Core Evaluation Metrics */}
            {Object.keys(coreMetrics).length > 0 && (
              <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
                <h2 className="mb-6 border-b border-gray-200 pb-3 text-lg font-semibold text-[#1C6758] sm:text-xl">
                  Core Evaluation Metrics
                </h2>
                <div className="grid gap-4 lg:grid-cols-2">
                  {Object.entries(coreMetrics)
                    .filter(([key]) => !key.includes('_comment'))
                    .map(([key, value]) => {
                      const commentKey = `${key}_comment`;
                      const comment = coreMetrics[commentKey] || '';
                      const score = typeof value === 'number' ? value : 0;
                      const title = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                      
                      return (
                        <div
                          key={key}
                          className="flex items-start justify-between rounded-2xl border border-gray-100 px-5 py-6 sm:px-6"
                        >
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-slate-800 sm:text-lg">
                              {title}
                            </h3>
                            <p className="mt-2 text-sm text-slate-600 sm:text-[15px]">
                              {String(comment || '')}
                            </p>
                          </div>
                          <div className="ml-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E0ECFF] text-sm font-semibold text-[#1E40AF]">
                            {score}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </section>
            )}

            {/* Language Accuracy & Style */}
            {Object.keys(languageMetrics).length > 0 && (
              <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
                <h2 className="mb-6 border-b border-gray-200 pb-3 text-lg font-semibold text-[#1C6758] sm:text-xl">
                  Language Accuracy & Style
                </h2>
                <div className="space-y-6">
                  {Object.entries(languageMetrics).map(([category, data]) => {
                    const categoryTitle = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    const dataObj = data as Record<string, unknown>;
                    const issuesCount = typeof dataObj?.issues_count === 'number' ? dataObj.issues_count : 0;
                    const examples = Array.isArray(dataObj?.examples) ? dataObj.examples as Array<Record<string, unknown>> : [];
                    
                    return (
                      <div key={category} className="rounded-2xl border border-slate-200 px-5 py-5 lg:px-7">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold text-slate-900">{categoryTitle}</h3>
                          <span className={`inline-flex items-center rounded-lg px-3 py-1 text-sm font-semibold ${
                            issuesCount === 0 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : issuesCount <= 2 
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {issuesCount} issues
                          </span>
                        </div>
                        
                        {examples.length > 0 ? (
                          <div className="mt-4 space-y-2">
                            {examples.map((example, index: number) => (
                              <div
                                key={index}
                                className="flex flex-col gap-2 rounded-lg bg-[#F7F7F7] px-3 py-2 text-sm shadow-sm sm:flex-row sm:items-center sm:gap-3"
                              >
                                <span className="font-medium text-rose-600">
                                  {String(example.before || '')}
                                </span>
                                <ArrowRight className="hidden h-3.5 w-3.5 text-slate-500 sm:block" />
                                <span className="font-medium text-emerald-600">
                                  {String(example.after || '')}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
                            Excellent! No issues found in this category.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Strengths to Retain */}
            {strengths.length > 0 && (
              <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
                <h2 className="mb-6 border-b border-gray-200 pb-3 text-lg font-semibold text-emerald-600 sm:text-xl">
                  <CheckCircle2 className="mr-2 inline h-5 w-5" />
                  Strengths to Retain
                </h2>
                <div className="space-y-3">
                  {strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                      <p className="text-sm text-emerald-800 sm:text-base">{strength}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Areas for Improvement */}
            {weaknesses.length > 0 && (
              <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
                <h2 className="mb-6 border-b border-gray-200 pb-3 text-lg font-semibold text-amber-600 sm:text-xl">
                  <AlertCircle className="mr-2 inline h-5 w-5" />
                  Areas for Improvement
                </h2>
                <div className="space-y-3">
                  {weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-start gap-3 rounded-lg border border-amber-100 bg-amber-50 p-4">
                      <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600" />
                      <p className="text-sm text-amber-800 sm:text-base">{weakness}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Next Steps Recommendations */}
            {recommendations.length > 0 && (
              <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
                <h2 className="mb-6 border-b border-gray-200 pb-3 text-lg font-semibold text-[#1C6758] sm:text-xl">
                  <Lightbulb className="mr-2 inline h-5 w-5" />
                  Next Steps & Recommendations
                </h2>
                <div className="space-y-3">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
                      <Lightbulb className="mt-0.5 h-4 w-4 text-blue-600" />
                      <p className="text-sm text-blue-800 sm:text-base">{recommendation}</p>
                    </div>
                  ))}
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
                  <p className="whitespace-pre-wrap">{String((resultData as Record<string, unknown>)?.essayText || '')}</p>
                </div>
              </section>
            )}

            <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-[#1C6758] mb-4">What&apos;s Next?</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleReattemptTopic}
                    className="bg-[#1C6758] hover:bg-[#135F4A]"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Another Essay
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleBackToHome}
                    className="border-[#1C6758] text-[#1C6758] hover:bg-[#f0f7f5]"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </section>
              </>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default EssayResultsPage;