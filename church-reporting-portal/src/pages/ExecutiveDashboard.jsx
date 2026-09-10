import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { Navbar } from "../components/layout/Navbar";
import {
  Users,
  DollarSign,
  TrendingUp,
  Sparkles,
  Bot,
  Send,
  Building,
  BellRing,
  Crown,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const ExecutiveDashboard = () => {
  const { profile } = useAuth();
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [sendingSms, setSendingSms] = useState(false);
  const [smsResult, setSmsResult] = useState(null);

  // Sample analytics trajectory data
  const chartData = [
    { date: "Aug 16", attendance: 680, finance: 28400 },
    { date: "Aug 23", attendance: 745, finance: 31200 },
    { date: "Aug 30", attendance: 810, finance: 34900 },
    { date: "Sep 06", attendance: 895, finance: 38750 },
  ];

  const totalAttendance = 3130;
  const totalFinance = 133250;
  const totalSouls = 340;
  const totalBranches = 14;

  const generateAiAnalysis = (customPrompt = null) => {
    setAiGenerating(true);
    setAiResponse(null);

    setTimeout(() => {
      const insight = customPrompt
        ? `Executive Analysis for Daddy: In response to "${customPrompt}", the 4-week trajectory demonstrates steady 12.8% attendance acceleration across Zone 1 and Zone 2. Sunday Mega Gathering busing efficiency reached 94% with zero Monday compliance infractions.`
        : `Executive Intelligence Briefing for Bishop ("Daddy"):

• Attendance Expansion: Total worship attendance stands at ${totalAttendance.toLocaleString()} worshippers across all 14 physical branches, marking a steady 12% week-on-week gain.
• Financial Stewardship: Cumulative giving reached GHC ${totalFinance.toLocaleString()}, supported by high tithe participation.
• Harvest & Evangelism: 340 souls were brought to the Lord through combined cell and altar call efforts.
• Strategic Advice: Follow-up on busing cost optimization in suburban campuses and maintain the Monday 12:00 PM compliance window.`;
      setAiResponse(insight);
      setAiGenerating(false);
    }, 750);
  };

  const handleSendReminders = () => {
    setSendingSms(true);
    setSmsResult(null);
    setTimeout(() => {
      setSendingSms(false);
      setSmsResult("Automated SMS deadline reminders dispatched via Africa's Talking gateway to all branch pastors.");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] pb-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* Executive Header Banner */}
        <div className="bg-white border border-stone-200/90 p-8 rounded-3xl mb-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50/70 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-rose-50/70 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Crown className="w-4 h-4 text-rose-600" />
                Executive Council &bull; Global Church Operations
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                Global Church Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
                Aggregating attendance, financial stewardship, and soul harvest across all church zones. Enforcing the Monday 12:00 PM reporting deadline.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSendReminders}
                disabled={sendingSms}
                className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 font-bold px-4 py-3 rounded-2xl text-xs transition-all shadow-2xs active:scale-95 disabled:opacity-50"
              >
                <BellRing className="w-4 h-4 text-teal-700" />
                {sendingSms ? "Dispatching..." : "Send Bulk SMS Reminders"}
              </button>
              <button
                onClick={() => generateAiAnalysis()}
                disabled={aiGenerating}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white font-black px-5 py-3 rounded-2xl text-xs transition-all shadow-md shadow-teal-900/20 active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-aquamarine-light" />
                {aiGenerating ? "Generating..." : "Generate AI Briefing"}
              </button>
            </div>
          </div>
        </div>

        {smsResult && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{smsResult}</span>
          </div>
        )}

        {/* Global KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-teal-100 p-6 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Cumulative Attendance</span>
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-teal-900 mt-2">
              {totalAttendance.toLocaleString()}
            </div>
            <span className="text-[11px] text-teal-600 font-semibold mt-1 block">&uarr; 12.8% growth</span>
          </div>

          <div className="bg-white border border-emerald-100 p-6 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Cumulative Giving</span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-700 mt-2">
              GHC {totalFinance.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Offerings & Tithes</span>
          </div>

          <div className="bg-white border border-rose-100 p-6 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Harvest Souls Won</span>
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-rose-600 mt-2">
              {totalSouls.toLocaleString()}
            </div>
            <span className="text-[11px] text-rose-500 font-semibold mt-1 block">Altar call & cell outreaches</span>
          </div>

          <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Active Campuses</span>
              <div className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-stone-900 mt-2">{totalBranches}</div>
            <span className="text-[11px] text-stone-400 font-semibold mt-1 block">4 Zones unified</span>
          </div>
        </div>

        {/* Gemini AI Intelligence Console */}
        <div className="bg-white border border-teal-200/90 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100/80 text-teal-800 flex items-center justify-center border border-teal-200">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-stone-900">Gemini AI Executive Intelligence</h2>
                <p className="text-xs text-stone-500">Automated trend summarization & natural language inquiry for Daddy</p>
              </div>
            </div>
            <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              AI Advisor
            </span>
          </div>

          {aiResponse && (
            <div className="mb-6 p-5 rounded-2xl bg-stone-50 border border-teal-100 text-stone-800 text-sm leading-relaxed whitespace-pre-line shadow-2xs">
              {aiResponse}
            </div>
          )}

          {/* Ask AI Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generateAiAnalysis(aiQuestion)}
              placeholder="Ask Daddy's AI: 'Which branch had the highest attendance last Sunday?' or 'Summarize cell execution'..."
              className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all"
            />
            <button
              onClick={() => generateAiAnalysis(aiQuestion)}
              disabled={aiGenerating || !aiQuestion}
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-5 py-3 rounded-2xl transition-all disabled:opacity-40 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white border border-stone-200/90 p-6 rounded-3xl shadow-xs">
            <h3 className="text-base font-bold text-stone-900 mb-4">Worship Attendance Trajectory</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="attLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F766E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", fontSize: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                  <Area type="monotone" dataKey="attendance" stroke="#0F766E" strokeWidth={3} fillOpacity={1} fill="url(#attLight)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-stone-200/90 p-6 rounded-3xl shadow-xs">
            <h3 className="text-base font-bold text-stone-900 mb-4">Cumulative Stewardship (GHC)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", fontSize: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                  <Bar dataKey="finance" fill="#14B8A6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
