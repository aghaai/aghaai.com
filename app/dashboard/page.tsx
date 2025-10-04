"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, PieChart, BookOpen } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsChart,
  Pie,
  Cell,
} from "recharts";
import DashboardHero from "@/components/LandingPage/sections/DashboardHero";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { WelcomeDialog } from "@/components/dialogs";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const DashboardPage = () => {
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [userName, setUserName] = useState("User");
  const [hasEssays, setHasEssays] = useState(false);
  const [activeMetricTab, setActiveMetricTab] = useState<"language" | "core">(
    "core"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Sample data for populated view
  const progressData = [
    { date: "20 May", score: 60 },
    { date: "21 June", score: 80 },
    { date: "25 July", score: 35 },
    { date: "10 Sep", score: 70 },
    { date: "10 Sep", score: 50 },
    { date: "28 Sep", score: 85 },
  ];

  const pieData = [
    { name: "Successful", value: 5, color: "#10b981" },
    { name: "Unsuccessful", value: 2, color: "#ef4444" },
  ];

  const evaluationHistory = useMemo(
    () => [
      {
        date: "20 Oct 2025",
        topic: "Climate Change and Environment Change",
        overallScore: 85,
        coreMetrics: {
          contentRelevance: 32,
          organization: 64,
          language: 46,
          criticalThinking: 22,
          outlineQuality: 46,
        },
        languageMetrics: {
          grammar: 32,
          tone: 64,
          sentenceClarity: 46,
          vocabulary: 22,
        },
      },
      {
        date: "10 Jun 2025",
        topic: "The Impact of Social Media",
        overallScore: 24,
        coreMetrics: {
          contentRelevance: 32,
          organization: 64,
          language: 46,
          criticalThinking: 22,
          outlineQuality: 46,
        },
        languageMetrics: {
          grammar: 32,
          tone: 64,
          sentenceClarity: 46,
          vocabulary: 22,
        },
      },
      {
        date: "20 Oct 2025",
        topic: "Climate Change and Environment Change",
        overallScore: 39,
        coreMetrics: {
          contentRelevance: 32,
          organization: 64,
          language: 46,
          criticalThinking: 22,
          outlineQuality: 46,
        },
        languageMetrics: {
          grammar: 32,
          tone: 64,
          sentenceClarity: 46,
          vocabulary: 22,
        },
      },
      {
        date: "05 Sep 2025",
        topic: "Economic Inequality",
        overallScore: 92,
        coreMetrics: {
          contentRelevance: 32,
          organization: 64,
          language: 46,
          criticalThinking: 22,
          outlineQuality: 46,
        },
        languageMetrics: {
          grammar: 32,
          tone: 64,
          sentenceClarity: 46,
          vocabulary: 22,
        },
      },
      {
        date: "25 May 2025",
        topic: "Climate Change and Environment Change",
        overallScore: 18,
        coreMetrics: {
          contentRelevance: 32,
          organization: 64,
          language: 46,
          criticalThinking: 22,
          outlineQuality: 46,
        },
        languageMetrics: {
          grammar: 32,
          tone: 64,
          sentenceClarity: 46,
          vocabulary: 22,
        },
      },
      {
        date: "19 Apr 2025",
        topic: "Global Trade Policies",
        overallScore: 58,
        coreMetrics: {
          contentRelevance: 30,
          organization: 62,
          language: 44,
          criticalThinking: 28,
          outlineQuality: 40,
        },
        languageMetrics: {
          grammar: 30,
          tone: 58,
          sentenceClarity: 44,
          vocabulary: 24,
        },
      },
      {
        date: "12 Mar 2025",
        topic: "Technological Advancement in Education",
        overallScore: 74,
        coreMetrics: {
          contentRelevance: 36,
          organization: 70,
          language: 50,
          criticalThinking: 32,
          outlineQuality: 52,
        },
        languageMetrics: {
          grammar: 34,
          tone: 66,
          sentenceClarity: 48,
          vocabulary: 30,
        },
      },
    ],
    []
  );

  const totalPages = useMemo(() => {
    if (!hasEssays) {
      return 1;
    }
    return Math.max(1, Math.ceil(evaluationHistory.length / rowsPerPage));
  }, [evaluationHistory, rowsPerPage, hasEssays]);

  const paginatedHistory = useMemo(() => {
    if (!hasEssays) {
      return [];
    }

    const startIndex = (currentPage - 1) * rowsPerPage;
    return evaluationHistory.slice(startIndex, startIndex + rowsPerPage);
  }, [currentPage, evaluationHistory, rowsPerPage, hasEssays]);

  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem("justLoggedIn");
    const storedUserName = sessionStorage.getItem("userName");
    const welcomeDialogShown = sessionStorage.getItem("welcomeDialogShown");

    if (storedUserName) {
      setUserName(storedUserName);
      sessionStorage.removeItem("userName");
    }

    const shouldShowDialog = justLoggedIn === "true" || welcomeDialogShown !== "true";
    if (!shouldShowDialog) {
      return;
    }

    if (justLoggedIn === "true") {
      sessionStorage.removeItem("justLoggedIn");
    }

    setShowWelcomeDialog(true);
    sessionStorage.setItem("welcomeDialogShown", "true");
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [hasEssays]);

  useEffect(() => {
    setCurrentPage((previous) => Math.min(previous, totalPages));
  }, [totalPages]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardHero />

        {/* Toggle Switch */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setHasEssays(!hasEssays)}
            className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm"
          >
            {hasEssays ? "Show Empty State" : "Show With Data"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="items-center mb-4">
                <h3 className="font-semibold text-gray-900">Last Score</h3>
              </div>

              {hasEssays ? (
                <>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold text-green-600">
                      85
                    </span>
                    <span className="text-3xl font-bold text-green-600">
                      /100
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-3">
                    <TrendingUp className="w-3 h-3 mt-3" />
                    +12 from previous
                  </p>
                </>
              ) : (
                <>
                  <div className="flex space-x-0.5">
                    <span className="w-3 h-1 bg-green-500 rounded-full"></span>
                    <span className="w-3 h-1 bg-green-500 rounded-full"></span>
                  </div>
                  <p className="text-gray-500 text-sm mt-3">
                    Complete your first essay
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="items-center mb-4">
                <h3 className="font-semibold text-gray-900">Average Score</h3>
              </div>

              {hasEssays ? (
                <>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold text-purple-600">
                      72
                    </span>
                    <span className="text-3xl font-bold text-purple-600">
                      /100
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Based on 5 previous essays
                  </p>
                </>
              ) : (
                <>
                  <div className="flex space-x-0.5">
                    <span className="w-3 h-1 bg-purple-500 rounded-full"></span>
                    <span className="w-3 h-1 bg-purple-500 rounded-full"></span>
                  </div>
                  <p className="text-gray-500 text-sm mt-3">No essays yet</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="items-center mb-4">
                <h3 className="font-semibold text-gray-900">Pass Rate</h3>
              </div>

              {hasEssays ? (
                <>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold text-yellow-600">
                      80
                    </span>
                    <span className="text-gray-500">%</span>
                  </div>
                  <p className="text-gray-500 text-sm">3 out of 5 essays</p>
                </>
              ) : (
                <>
                  <div className="flex space-x-0.5">
                    <span className="w-3 h-1 bg-yellow-500 rounded-full"></span>
                    <span className="w-3 h-1 bg-yellow-500 rounded-full"></span>
                  </div>
                  <p className="text-gray-500 text-sm mt-3">
                    Start evaluating essays
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Progress Trend */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Progress Trend
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {hasEssays
                  ? "Your essay scores over time"
                  : "Your essay scores will appear here"}
              </p>

              {hasEssays ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-50 flex items-center justify-center border-dashed border-2 border-gray-200 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-gray-400 text-sm">
                      Complete your first essay to see progress
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pass/Fail Ratio */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Performance Outcome
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {hasEssays
                  ? "Your overall performance breakdown"
                  : "Your performance breakdown will appear here"}
              </p>

              {hasEssays ? (
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={true}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-50 flex items-center justify-center border-dashed border-2 border-gray-200 rounded-lg">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">
                      Complete essays to see your ratio
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Essay Progress Overview */}
        <Card className="mb-6 sm:mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Evaluation Overview
                </h3>
                <p className="text-gray-500 text-sm">
                  {hasEssays
                    ? "Check your overall scores and explored sections for detailed feedback."
                    : "Your essay history will appear here after completing evaluations"}
                </p>
              </div>
              {hasEssays && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveMetricTab("language")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeMetricTab === "language"
                        ? "bg-teal-800 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Language & Style
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMetricTab("core")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeMetricTab === "core"
                        ? "bg-teal-800 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Core Metrics
                  </button>
                </div>
              )}
            </div>

            {hasEssays ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 whitespace-nowrap align-middle h-14">
                        Essay Topic
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 whitespace-nowrap align-middle h-14">
                        Overall Score
                      </th>
                      {activeMetricTab === "language" ? (
                        <>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 whitespace-nowrap align-middle h-14">
                            Grammar &amp; Punctuation
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 whitespace-nowrap align-middle h-14">
                            Tone &amp; Formality
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 whitespace-nowrap align-middle h-14">
                            Sentence Clarity &amp; Structure
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 whitespace-nowrap align-middle h-14">
                            Vocabulary Enhancement
                          </th>
                        </>
                      ) : (
                        <>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 whitespace-nowrap align-middle h-14">
                            Content Relevance
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 whitespace-nowrap align-middle h-14">
                            Organization
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 whitespace-nowrap align-middle h-14">
                            Language
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 whitespace-nowrap align-middle h-14">
                            Critical Thinking
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 whitespace-nowrap align-middle h-14">
                            Outline Quality
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedHistory.map((essay, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50 h-16 align-middle"
                      >
                        <td className="py-4 px-4 align-middle">
                          <div className="text-sm font-medium text-gray-900">
                            {essay.topic}
                          </div>
                          <div className="text-xs text-gray-500">
                            {essay.date}
                          </div>
                        </td>
                        <td className="py-4 px-4 align-middle whitespace-nowrap">
                          <span
                            className={`text-sm font-semibold whitespace-nowrap ${
                              essay.overallScore >= 60
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {essay.overallScore}/100
                          </span>
                        </td>
                        {activeMetricTab === "language" ? (
                          <>
                            <td className="py-4 px-4 text-sm text-gray-700 whitespace-nowrap align-middle">
                              {essay.languageMetrics.grammar}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700 whitespace-nowrap align-middle">
                              {essay.languageMetrics.tone}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700 whitespace-nowrap align-middle">
                              {essay.languageMetrics.sentenceClarity}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700 whitespace-nowrap align-middle">
                              {essay.languageMetrics.vocabulary}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-4 px-4 text-sm text-gray-700 whitespace-nowrap align-middle">
                              {essay.coreMetrics.contentRelevance}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700 whitespace-nowrap align-middle">
                              {essay.coreMetrics.organization}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700 whitespace-nowrap align-middle">
                              {essay.coreMetrics.language}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700 whitespace-nowrap align-middle">
                              {essay.coreMetrics.criticalThinking}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700 whitespace-nowrap align-middle">
                              {essay.coreMetrics.outlineQuality}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex flex-wrap gap-3 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded border transition-colors ${
                        currentPage === 1
                          ? "text-gray-300 border-gray-200 cursor-not-allowed"
                          : "text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded border transition-colors ${
                        currentPage === totalPages
                          ? "text-gray-300 border-gray-200 cursor-not-allowed"
                          : "text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="min-h-[300px] flex items-center justify-center border-dashed border-2 border-gray-200 rounded-lg p-8">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-gray-900 font-medium text-lg mb-2">
                    No Essay Yet
                  </h4>
                  <p className="text-gray-500 text-sm mb-6">
                    Start writing your first essay to see detailed analytics
                  </p>
                  <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors">
                    Evaluate your Essay
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Welcome Dialog */}
        <WelcomeDialog
          open={showWelcomeDialog}
          onOpenChange={setShowWelcomeDialog}
          userName={userName}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DashboardPage;
