"use client";

import React, { useEffect, useState } from "react";
import type { ComponentType } from "react";
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
import { essayAPI, type EssayResultResponse } from "@/lib/api/essay";
import { isAxiosError } from "axios";

const coreMetrics = [
  {
    title: "Content Relevance",
    description:
      "Central ideas align with the assigned topic, but featured goals and limited breadth constrain marks.",
    score: 76,
    initial: "CR",
    variant: "blue",
  },
  {
    title: "Organization",
    description:
      "Structure maintains logical sequencing, yet featured goals and limited breadth constrain marks.",
    score: 55,
    initial: "OR",
    variant: "orange",
  },
  {
    title: "Language",
    description:
      "Word choice and tone are monitored, but featured goals and limited breadth constrain marks.",
    score: 81,
    initial: "LA",
    variant: "teal",
  },
  {
    title: "Critical Thinking",
    description:
      "Claims are insightful and are reinforced, but featured goals and limited breadth constrain marks.",
    score: 90,
    initial: "CT",
    variant: "green",
  },
  {
    title: "Outline Quality",
    description:
      "Outline is clear and ideas are reinforced, but featured goals and limited breadth constrain marks.",
    score: 20,
    initial: "OQ",
    variant: "red",
  },
] as const;

type CoreMetricVariant = (typeof coreMetrics)[number]["variant"];

const coreMetricStyles: Record<
  CoreMetricVariant,
  {
    initialBg: string;
    initialText: string;
    scoreBg: string;
    scoreText: string;
  }
> = {
  blue: {
    initialBg: "bg-[#E6F0FF]",
    initialText: "text-[#1E40AF]",
    scoreBg: "bg-[#E0ECFF]",
    scoreText: "text-[#1E40AF]",
  },
  orange: {
    initialBg: "bg-[#FFEFD9]",
    initialText: "text-[#C2410C]",
    scoreBg: "bg-[#FFE4C7]",
    scoreText: "text-[#C2410C]",
  },
  teal: {
    initialBg: "bg-[#D9F6F0]",
    initialText: "text-[#0F766E]",
    scoreBg: "bg-[#C7F0E8]",
    scoreText: "text-[#0F766E]",
  },
  green: {
    initialBg: "bg-[#DCFCE7]",
    initialText: "text-[#047857]",
    scoreBg: "bg-[#BBF7D0]",
    scoreText: "text-[#047857]",
  },
  red: {
    initialBg: "bg-[#FEE2E2]",
    initialText: "text-[#B91C1C]",
    scoreBg: "bg-[#FECACA]",
    scoreText: "text-[#B91C1C]",
  },
};

type IconType = ComponentType<{ className?: string }>;

type LanguageVariant = "critical" | "caution" | "success";

const languageMetricVariants: Record<
  LanguageVariant,
  {
    icon: IconType;
    iconClass: string;
    badgeBg: string;
    badgeText: string;
    chipBg: string;
    chipText: string;
  }
> = {
  critical: {
    icon: AlertCircle,
    iconClass: "text-[#D92E34]",
    badgeBg: "bg-[#FEE2E2]",
    badgeText: "text-[#B91C1C]",
    chipBg: "bg-[#FDF2F2]",
    chipText: "text-[#B91C1C]",
  },
  caution: {
    icon: AlertCircle,
    iconClass: "text-[#F97316]",
    badgeBg: "bg-[#FFEDD5]",
    badgeText: "text-[#9A3412]",
    chipBg: "bg-[#FFF7ED]",
    chipText: "text-[#9A3412]",
  },
  success: {
    icon: CheckCircle2,
    iconClass: "text-[#0F9D58]",
    badgeBg: "bg-[#DCFCE7]",
    badgeText: "text-[#0F9D58]",
    chipBg: "bg-[#ECFDF5]",
    chipText: "text-[#0F9D58]",
  },
};

const languageMetrics = [
  {
    title: "Grammar & Punctuation",
    score: "20/100",
    summary: "12 issues found",
    variant: "critical" as LanguageVariant,
    items: [
      {
        original: "“The goverment is”",
        updated: "“The government is”",
      },
      {
        original: "“The goverment's”",
        updated: "“The government's”",
      },
      {
        original: "“The goverment has”",
        updated: "“The government has”",
      },
      {
        original: "“The goverment will”",
        updated: "“The government will”",
      },
    ],
  },
  {
    title: "Tone & Formality",
    score: "100/100",
    summary: "All clear",
    variant: "success" as LanguageVariant,
    items: [],
  },
  {
    title: "Sentence Clarity & Structure",
    score: "86/100",
    summary: "5 issues found",
    variant: "caution" as LanguageVariant,
    items: [
      {
        original: "“kids these days”",
        updated: "“young individuals”",
      },
      {
        original: "“kids these days”",
        updated: "“young individuals”",
      },
      {
        original: "“kids these days”",
        updated: "“young individuals”",
      },
    ],
  },
  {
    title: "Vocabulary Enhancement",
    score: "76/100",
    summary: "8 issues found",
    variant: "critical" as LanguageVariant,
    items: [
      {
        original: "“very big”",
        updated: "“significant”",
      },
      {
        original: "“kids these days”",
        updated: "“young individuals”",
      },
      {
        original: "“things”",
        updated: "“factors / elements”",
      },
      {
        original: "“add these data”",
        updated: "“insert assertive data”",
      },
    ],
  },
];

type AnalysisVariant = "critical" | "success";

const analysisVariantStyles: Record<
  AnalysisVariant,
  {
    icon: IconType;
    circleBg: string;
    circleText: string;
  }
> = {
  critical: {
    icon: AlertCircle,
    circleBg: "bg-[#FEE2E2]",
    circleText: "text-[#B91C1C]",
  },
  success: {
    icon: CheckCircle2,
    circleBg: "bg-[#DCFCE7]",
    circleText: "text-[#047857]",
  },
};

const detailedAnalysis = [
  {
    title: "Thesis Scope",
    variant: "critical" as AnalysisVariant,
    issue:
      "The thesis statement lacks specificity and clear benchmarks for the argument.",
    recommendation:
      "Refine thesis to include specific claims and scope limitations that guide each paragraph.",
  },
  {
    title: "Content Depth",
    variant: "success" as AnalysisVariant,
    issue:
      "Topic sentences connect appropriately, but opportunities for deeper synthesis remain.",
    recommendation:
      "Integrate comparative commentary and draw links between examples to add scholarly depth.",
  },
  {
    title: "Accuracy Issues",
    variant: "critical" as AnalysisVariant,
    issue:
      "Evidence is referenced, yet supporting data is occasionally generalized or unsourced.",
    recommendation:
      "Support each claim with precise, authoritative references and maintain source integrity.",
  },
  {
    title: "Evidence Integration",
    variant: "critical" as AnalysisVariant,
    issue:
      "Quotations are mentioned but not consistently contextualized or analyzed for relevance.",
    recommendation:
      "Blend quoted material with original insight to emphasise argument ownership and clarity.",
  },
];

const quickFixes = [
  "Correct spelling “enviroment” → “environment”",
  "Replace “govt.” with the formal “government”",
  "Ensure subject-verb agreement in paragraph three",
  "Standardize capitalization for climate policy terms",
];

const modelCorrections = [
  {
    title: "Improved Introduction",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ac turpis molestie, dictum erat a, rutrum tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac lobortis urna luctus.",
  },
  {
    title: "Connected Chronology",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ac turpis molestie, dictum erat a, rutrum tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Praesent auctor purus luctus enim egestas, ac lobortis urna luctus.",
  },
  {
    title: "Evidence-Integrated Analysis",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ac turpis molestie, dictum erat a, rutrum tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus.",
  },
];

const strengths = [
  "Clear thesis statement in introduction",
  "Logical paragraph structure",
  "Clear linkage between conclusion and thesis",
  "Strong topic-specific vocabulary",
];

const weaknesses = [
  "Weak evidence integration causing arguments to feel unsupported",
  "Missing strong / authoritative sources to ground claims",
  "Limited counterargument consideration",
  "Needs consistent analytical transitions between ideas",
];

const actionItems = [
  {
    title: "Rebuild Thesis & Outline",
    description:
      "Clarify the controlling idea, tighten paragraph scope, and align each section with the refined thesis.",
  },
  {
    title: "Insert Assertive Data",
    description:
      "Add precise statistics or expert citations to reinforce arguments and address evidence gaps.",
  },
  {
    title: "Apply Analytical Frameworks",
    description:
      "Introduce comparative or cause-effect frameworks to elevate analysis and critical depth.",
  },
  {
    title: "Revise Language & Tone",
    description:
      "Swap informal diction for academic phrasing while preserving clarity and readability.",
  },
  {
    title: "Practice Timed Writing",
    description:
      "Rehearse under timed conditions to streamline structure, pacing, and revision workflow.",
  },
];

const EssayResultsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<EssayResultResponse["data"] | null>(null);
  const [topicTitle, setTopicTitle] = useState("Climate Change and Environmental Change");
  const [overallScore, setOverallScore] = useState(85);

  // Fetch essay result on mount
  useEffect(() => {
    const fetchEssayResult = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get session ID from storage
        const sessionId = sessionStorage.getItem("essaySessionId");
        
        if (!sessionId) {
          setError("No session found. Please start a new essay test.");
          setTimeout(() => {
            router.push("/essay-evaluation");
          }, 2000);
          return;
        }

        // Fetch result from API
        const response = await essayAPI.getEssayResult(sessionId);

        if (response.success && response.data) {
          setResultData(response.data);
          
          // Update topic title
          if (response.data.session.topic?.title) {
            setTopicTitle(response.data.session.topic.title);
          }
          
          // Update overall score
          if (response.data.essayResult.extractedMetrics?.overall) {
            setOverallScore(response.data.essayResult.extractedMetrics.overall);
          }

          // Clear session data after loading results
          sessionStorage.removeItem("essaySessionId");
        } else {
          setError("Failed to load essay results. Please try again.");
        }
      } catch (err) {
        console.error("Failed to fetch essay result:", err);
        const message = isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "An error occurred while loading your results.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEssayResult();
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
            <section className="rounded-3xl bg-[#135F4A] px-5 py-7 text-white shadow-sm sm:px-10 sm:py-8 lg:px-14 lg:py-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3 text-center md:text-left">
                  <div className="inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/80 md:justify-start">
                    Topic
                  </div>
                  <h2 className="text-xl font-semibold sm:text-2xl lg:text-[28px]">
                    {topicTitle}
                  </h2>
                </div>

                <div className="flex flex-col items-center gap-2 md:items-end">
                  <span className="text-xs font-medium uppercase tracking-wide text-white/80">
                    Overall Essay Score
                  </span>
                  <div className="text-5xl font-bold leading-none sm:text-6xl lg:text-7xl">
                    {overallScore}%
                  </div>
                  <span className="rounded-full bg-[#FFC14E] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-black sm:px-6 sm:py-3">
                    Grade: {resultData?.essayResult.extractedMetrics?.grade || "N/A"}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
              <h2 className="mb-4 border-b border-gray-200 pb-3 text-lg font-semibold text-[#1C6758] sm:mb-3 sm:text-xl">
                Executive Summary
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 sm:text-base lg:text-[17px]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                ac turpis molestie, dictum erat a, rutrum tellus. Sed dignissim,
                metus nec fringilla accumsan, risus sem sollicitudin lacus, ut
                interdum tellus elit sed risus. Maecenas eget condimentum velit,
                sit amet feugiat lectus. Class aptent taciti sociosqu ad litora
                torquent per conubia nostra.
              </p>
            </section>

            <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
              <h2 className="mb-6 border-b border-gray-200 pb-3 text-lg font-semibold text-[#1C6758] sm:text-xl">
                Core Evaluation Metrics
              </h2>
              <div className="space-y-4">
                {coreMetrics.map((metric) => {
                  const style = coreMetricStyles[metric.variant];
                  return (
                    <div
                      key={metric.title}
                      className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-[#FAFAFA] px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"
                    >
                      <div className="flex items-start gap-4">
                        <div className="space-y-1">
                          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                            {metric.title}
                          </h3>
                          <p className="text-sm text-slate-500 sm:text-[15px]">
                            {metric.description}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold ${style.scoreBg} text-black sm:text-base`}
                      >
                        {metric.score}/100
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
              <h2 className="mb-6 border-b border-gray-200 pb-3 text-lg font-semibold text-[#1C6758] sm:text-xl">
                Language Accuracy & Style
              </h2>
              <div className="space-y-6">
                {languageMetrics.map((metric) => {
                  const variant = languageMetricVariants[metric.variant];
                  const Icon = variant.icon;
                  return (
                    <div
                      key={metric.title}
                      className="rounded-2xl border border-slate-200 px-5 py-5 lg:px-7"
                    >
                      <div className="sm:flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <div className="sm:flex items-center gap-2 sm:gap-3">
                            <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                              {metric.title}
                            </h3>
                            <div className="flex gap-3 py-3 sm:py-0">
                              <Icon
                                className={`h-5 w-5 -mr-2 ${variant.iconClass}`}
                              />
                              <p className="text-xs text-slate-500 sm:text-sm">
                                {metric.summary}
                              </p>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-lg px-3 py-1 text-sm font-semibold ${variant.badgeBg} ${variant.badgeText}`}
                        >
                          {metric.score}
                        </span>
                      </div>

                      {metric.items.length > 0 ? (
                        <div className="mt-4 space-y-2">
                          {metric.items.map((item, index) => (
                            <div
                              key={`${metric.title}-${index}`}
                              className="flex flex-col gap-2 rounded-lg bg-[#F7F7F7] px-3 py-2 text-sm text-slate-600 shadow-sm sm:flex-row sm:items-center sm:gap-3"
                            >
                              <span className="font-medium text-rose-600">
                                {item.original}
                              </span>
                              <ArrowRight className="hidden h-3.5 w-3.5 text-slate-500 sm:block" />
                              <span className="font-medium text-emerald-600">
                                {item.updated}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-600">
                          Excellent consistency in tone and formality. No
                          revisions required here.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
              <h2 className="mb-6 border-b border-gray-200 pb-3 text-lg font-semibold text-[#1C6758] sm:text-xl">
                Detailed Analysis
              </h2>
              <div className="grid gap-5 lg:grid-cols-2">
                {detailedAnalysis.map((item) => {
                  const variant = analysisVariantStyles[item.variant];
                  const Icon = variant.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-slate-100 bg-white shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                      <div className="space-y-2 py-3">
                        <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
                          <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-rose-600">
                            <Icon className="h-4 w-4" />
                            Issue
                          </p>
                          <p className="ml-6 text-xs leading-relaxed text-rose-700 sm:text-sm">
                            {item.issue}
                          </p>
                        </div>
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                          <p className="mb-1 flex items-center gap-2 text-xs font-semibold text-emerald-600 sm:text-sm">
                            <Lightbulb className="h-4 w-4" />
                            Recommendation
                          </p>
                          <p className="ml-6 text-xs leading-relaxed text-emerald-700 sm:text-sm">
                            {item.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
              <h2 className="mb-5 border-b border-gray-200 pb-3 text-lg font-semibold text-[#1C6758] sm:text-xl">
                Quick Mechanical Fixes
              </h2>
              <div className="space-y-3">
                {quickFixes.map((fix, index) => (
                  <div
                    key={`fix-${index}`}
                    className="flex items-start gap-3 rounded-2xl bg-[#FFF9E6] px-4 py-3 text-sm sm:text-base"
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 text-[#E6B800]" />
                    <p className="text-sm">{fix}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
              <h2 className="mb-6 border-b border-gray-200 pb-3 text-lg font-semibold text-[#1C6758] sm:text-xl">
                Model Corrections & Examples
              </h2>
              <div className="space-y-6">
                {modelCorrections.map((example, index) => (
                  <div key={example.title} className="space-y-3">
                    <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                      {example.title}
                    </h3>
                    <div
                      className={`rounded-2xl px-4 py-4 ${
                        index === 0
                          ? "bg-[#F0FDF4]"
                          : index === 1
                            ? "bg-[#EFF6FF]"
                            : "bg-[#FAF5FF]"
                      }`}
                    >
                      <p className="text-md leading-relaxed">
                        {example.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
                <h2 className="mb-5 border-b border-gray-200 pb-3 text-lg font-semibold text-[#01A63F]">
                  Strengths to Retain
                </h2>
                <div className="space-y-3">
                  {strengths.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-[#01A63F] mt-0.5" />
                      <p className="text-sm text-slate-900">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
                <h2 className="mb-5 border-b border-gray-200 pb-3 text-lg font-semibold text-[#E80712]">
                  High-Impact Weaknesses
                </h2>
                <div className="space-y-3">
                  {weaknesses.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <AlertCircle className="h-4 w-4 text-[#E80712] mt-0.5" />
                      <p className="text-sm text-slate-900">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-8 lg:px-10">
              <h2 className="mb-6 border-b border-gray-200 pb-3 text-lg font-semibold text-[#1C6758] sm:text-xl">
                Next Steps & Recommendations
              </h2>

              <h2 className="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
                Priority Action Items:
              </h2>
              <div className="space-y-4">
                {actionItems.map((item, index) => (
                  <div
                    key={item.title}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-[#EEEEEE] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="flex gap-3 items-center">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1F6B63] text-sm font-semibold text-white">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <h3 className="text-md font-semibold text-slate-900">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                ))}
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
