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
import { 
  userAPI, 
  type UserStatsData,
  type LanguageStyleOverviewItem, 
  type CoreMatrixOverviewItem,
  type PaginationInfo 
} from "@/lib/api/user";

const DashboardPage = () => {
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [userName, setUserName] = useState("User");
  // Will be calculated dynamically later
  const [activeMetricTab, setActiveMetricTab] = useState<"language" | "core">(
    "core"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // API data states
  const [userStats, setUserStats] = useState<UserStatsData | null>(null);
  const [languageOverview, setLanguageOverview] = useState<LanguageStyleOverviewItem[]>([]);
  const [coreMatrixOverview, setCoreMatrixOverview] = useState<CoreMatrixOverviewItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform user stats for chart
  const progressData = useMemo(() => {
    // Check if userStats has trend data
    if (!userStats || !userStats.trend || userStats.trend.length === 0) {
      // Return empty array when no API data is available
      return [];
    }

    // Transform API trend data for chart
    return userStats.trend
      .filter(item => item && item.score !== undefined && item.score !== null)
      .map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'short' 
        }),
        score: item.score || 0
      }))
      .slice(-6); // Show last 6 entries
  }, [userStats]);

  const pieData = useMemo(() => {
    if (!userStats) {
      return [
        { name: "Successful", value: 0, color: "#10b981" },
        { name: "Unsuccessful", value: 0, color: "#ef4444" },
      ];
    }

    return [
      { name: "Successful", value: userStats.performanceOutcome.successful, color: "#10b981" },
      { name: "Unsuccessful", value: userStats.performanceOutcome.unsuccessful, color: "#ef4444" },
    ];
  }, [userStats]);

  // Dynamic check for essays based on API data
  const hasEssays = useMemo(() => {
    return !isLoading && (
      (languageOverview && languageOverview.length > 0) || 
      (coreMatrixOverview && coreMatrixOverview.length > 0)
    );
  }, [isLoading, languageOverview, coreMatrixOverview]);

  const evaluationHistory = useMemo(() => {
    // If we have API data and it's being displayed, use it
    if (activeMetricTab === "language" && languageOverview && languageOverview.length > 0) {
      return languageOverview.map(item => ({
        date: item.date,
        topic: item.topicTitle,
        overallScore: item.overallScore,
        coreMetrics: {
          contentRelevance: 0, // Not available in language overview
          organization: 0,
          language: 0,
          criticalThinking: 0,
          outlineQuality: 0,
        },
        languageMetrics: {
          grammar: item.grammarScore,
          tone: item.toneScore,
          sentenceClarity: item.sentenceScore,
          vocabulary: item.vocabScore,
        },
      }));
    }
    
    if (activeMetricTab === "core" && coreMatrixOverview && coreMatrixOverview.length > 0) {
      return coreMatrixOverview.map(item => ({
        date: item.date,
        topic: item.topicTitle,
        overallScore: item.overallScore,
        coreMetrics: {
          contentRelevance: item.contentRelevance,
          organization: item.organization,
          language: item.language,
          criticalThinking: item.criticalThinking,
          outlineQuality: item.outlineQuality,
        },
        languageMetrics: {
          grammar: 0, // Not available in core matrix
          tone: 0,
          sentenceClarity: 0,
          vocabulary: 0,
        },
      }));
    }

    // Return empty array when no API data is available
    return [];
  }, [activeMetricTab, languageOverview, coreMatrixOverview]);

  // Use API data directly - no need to calculate since API provides the values
  const calculatedStats = useMemo(() => {
    if (!userStats) {
      return {
        totalEssays: 0,
        lastScore: 0,
        averageScore: 0,
        passRate: 0,
        passCount: 0,
        previousScore: 0,
        improvementPercent: 0,
        improvementDirection: "no-change" as const,
      };
    }

    const totalEssays = userStats.trend ? userStats.trend.length : 0;
    const passCount = userStats.performanceOutcome.successful;
    
    // For previous score, get the second-to-last score from trend
    const validTrendScores = userStats.trend
      ? userStats.trend.filter(item => item.score !== undefined && item.score !== null)
      : [];
    const previousScore = validTrendScores.length > 1 ? validTrendScores[validTrendScores.length - 2]?.score || 0 : 0;

    return {
      totalEssays,
      lastScore: userStats.lastScore,
      averageScore: userStats.averageScore,
      passRate: userStats.passRate,
      passCount,
      previousScore,
      improvementPercent: userStats.improvement.percent,
      improvementDirection: userStats.improvement.direction,
    };
  }, [userStats]);

  const totalPages = useMemo(() => {
    if (!hasEssays) {
      return 1;
    }
    // Use API pagination if available, otherwise fall back to local calculation
    if (pagination && pagination.totalPages > 0) {
      return pagination.totalPages;
    }
    return Math.max(1, Math.ceil(evaluationHistory.length / rowsPerPage));
  }, [evaluationHistory, rowsPerPage, hasEssays, pagination]);

  const paginatedHistory = useMemo(() => {
    if (!hasEssays) {
      return [];
    }

    // Since we're using API pagination, return evaluationHistory directly
    // The API already returns the correct page of data
    return evaluationHistory;
  }, [evaluationHistory, hasEssays]);

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch user stats
        const statsResponse = await userAPI.getUserStats();
        if (statsResponse) {
          // Handle different response structures
          if (Array.isArray(statsResponse)) {
            setUserStats(statsResponse.data);
          } else if (statsResponse.success && statsResponse.data) {
            setUserStats(statsResponse.data);
          } else if (statsResponse.data && Array.isArray(statsResponse.data)) {
            setUserStats(statsResponse.data);
          }
        }

        // Fetch initial overview data based on active tab
        if (activeMetricTab === "language") {
          const langResponse = await userAPI.getLanguageStyleOverview(1, 5);
          if (langResponse.success) {
            setLanguageOverview(langResponse.data.overview);
            setPagination(langResponse.data.pagination);
          }
        } else {
          const coreResponse = await userAPI.getCoreMatrixOverview(1, 5);
          if (coreResponse.success) {
            setCoreMatrixOverview(coreResponse.data.overview);
            setPagination(coreResponse.data.pagination);
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        
        // Handle specific error messages from our improved API
        const errorMessage = err instanceof Error 
          ? err.message 
          : "Failed to load dashboard data. Please try again.";
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [activeMetricTab]); // Include activeMetricTab dependency

  // Fetch overview data when tab or page changes
  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setError(null);
        
        if (activeMetricTab === "language") {
          const response = await userAPI.getLanguageStyleOverview(currentPage, 5);
          if (response.success) {
            setLanguageOverview(response.data.overview);
            setPagination(response.data.pagination);
          }
        } else {
          const response = await userAPI.getCoreMatrixOverview(currentPage, 5);
          if (response.success) {
            setCoreMatrixOverview(response.data.overview);
            setPagination(response.data.pagination);
          }
        }
      } catch (err) {
        console.error("Error fetching overview data:", err);
        
        // Handle specific error messages from our improved API
        const errorMessage = err instanceof Error 
          ? err.message 
          : "Failed to load evaluation data. Please try again.";
        
        setError(errorMessage);
      }
    };

    // Only fetch if not loading initial data
    if (!isLoading) {
      fetchOverviewData();
    }
  }, [activeMetricTab, currentPage, isLoading]);

    useEffect(() => {
    const justRegistered = sessionStorage.getItem("justRegistered");
    const savedUserName = sessionStorage.getItem("userName");

    if (savedUserName) {
      setUserName(savedUserName);
    }

    // Show welcome dialog only for new registrations (not for regular login)
    if (justRegistered === "true") {
      setShowWelcomeDialog(true);
      // Clean up the justRegistered flag
      sessionStorage.removeItem("justRegistered");
      // Mark as shown to prevent future automatic displays
      sessionStorage.setItem("welcomeDialogShown", "true");
    }
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

        {/* Loading State */}
        {isLoading && (
          <div className="mb-6">
            <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Loading dashboard data...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading dashboard data</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="items-center mb-4">
                <h3 className="font-semibold text-gray-900">Last Score</h3>
              </div>

              {!isLoading && (userStats || calculatedStats.totalEssays > 0) ? (
                <>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold text-green-600">
                      {calculatedStats.lastScore}
                    </span>
                    <span className="text-3xl font-bold text-green-600">
                      /100
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-3 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {calculatedStats.lastScore - calculatedStats.previousScore >= 0 ? '+' : ''}
                    {calculatedStats.lastScore - calculatedStats.previousScore} from previous
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

              {!isLoading && (userStats || calculatedStats.totalEssays > 0) ? (
                <>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold text-purple-600">
                      {calculatedStats.averageScore}
                    </span>
                    <span className="text-3xl font-bold text-purple-600">
                      /100
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Based on {calculatedStats.totalEssays} essay{calculatedStats.totalEssays !== 1 ? 's' : ''}
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

              {!isLoading && (userStats || calculatedStats.totalEssays > 0) ? (
                <>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold text-yellow-600">
                      {calculatedStats.passRate}
                    </span>
                    <span className="text-gray-500">%</span>
                  </div>
                  <p className="text-gray-500 text-sm">
                    {calculatedStats.passCount} out of {calculatedStats.totalEssays} essay{calculatedStats.totalEssays !== 1 ? 's' : ''}
                  </p>
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
                Your essay scores over time
              </p>

              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : progressData.length > 0 ? (
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

            {!isLoading && hasEssays ? (
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
                    {isLoading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <tr key={index} className="border-b border-gray-100 h-16 align-middle">
                          <td className="py-4 px-4 align-middle">
                            <div className="animate-pulse">
                              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          </td>
                          <td className="py-4 px-4 align-middle">
                            <div className="animate-pulse">
                              <div className="h-4 bg-gray-200 rounded w-16"></div>
                            </div>
                          </td>
                          {Array.from({ length: activeMetricTab === "language" ? 4 : 5 }).map((_, i) => (
                            <td key={i} className="py-4 px-4 align-middle">
                              <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-8"></div>
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      paginatedHistory.map((essay, index) => (
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
                      ))
                    )}
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
                    No Data Found
                  </h4>
                  <p className="text-gray-500 text-sm mb-6">
                    Start writing your first essay to see detailed analytics and performance data
                  </p>
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
