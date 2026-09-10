import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import {
  ArrowLeft,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Coffee,
  CheckCircle2,
  Bookmark,
} from "lucide-react";

export const ReaderPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(24);
  const [theme, setTheme] = useState("LIGHT"); // LIGHT (Default), SEPIA, DARK
  const [fontSize, setFontSize] = useState(17); // px

  const [isPlayingTts, setIsPlayingTts] = useState(false);
  const [ttsRate, setTtsRate] = useState(1.0);
  const [savedProgressMessage, setSavedProgressMessage] = useState(false);

  const sampleContent = {
    1: `Chapter 1: The Foundation of Calling\n\nMinistry begins not with personal ambition, but with an inward spiritual gravitation towards the cross. Every shepherd must understand that those entrusted into their hands are not merely numbers, but eternal souls for whom Christ offered His life.\n\nWhen we organize our cell gatherings and prepare for the mega congregation, we are participating in the greatest assignment ever conferred upon mankind. The heart of a true shepherd is marked by compassion, intercessory prayer, and tireless faithfulness in the unseen moments.`,
    2: `Chapter 2: The Art of Continuous Evangelism\n\nEvangelism is the lifeblood of the church. Without intentional soul winning, the congregation slowly turns into a memorial rather than a movement. The Lord commanded us to go out into the highways and hedges and compel them to come in, that His house may be filled.\n\nEvery cell leader must prioritize the Saturday outreach and the midweek busing arrangements. When a soul is won, the heaven rejoices, and the kingdom of darkness suffers an irreversible loss.`,
    3: `Chapter 3: Loyalty and Steadfast Leadership\n\nLeadership is tested not in times of peace, but during seasons of expansion and spiritual warfare. A loyal co-laborer values unity above personal preference. Through consistent devotion, alignment with leadership, and unwavering commitment to doctrine, great works are built that endure through generations.`,
  };

  const activeText = sampleContent[currentPage] || sampleContent[1];

  const handleToggleTts = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported by your browser.");
      return;
    }

    if (isPlayingTts) {
      window.speechSynthesis.cancel();
      setIsPlayingTts(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeText.replace(/\\n/g, " "));
      utterance.rate = ttsRate;
      utterance.onend = () => setIsPlayingTts(false);
      utterance.onerror = () => setIsPlayingTts(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingTts(true);
    }
  };

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    if (isPlayingTts && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlayingTts(false);
    }
    setCurrentPage(newPage);
    setSavedProgressMessage(true);
    setTimeout(() => setSavedProgressMessage(false), 2000);
  };

  const getThemeClasses = () => {
    switch (theme) {
      case "SEPIA":
        return {
          bg: "bg-[#F7EFE2] text-[#4A3B2C]",
          card: "bg-[#FDF8EE] border-[#EADAC5]",
          nav: "bg-[#FDF8EE]/95 border-[#EADAC5] text-[#4A3B2C]",
        };
      case "DARK":
        return {
          bg: "bg-stone-950 text-stone-200",
          card: "bg-stone-900 border-stone-800",
          nav: "bg-stone-900/95 border-stone-800 text-white",
        };
      default: // LIGHT (Default)
        return {
          bg: "bg-[#FBF9F5] text-stone-800",
          card: "bg-white border-stone-200/90",
          nav: "bg-white/95 border-stone-200/80 text-stone-800",
        };
    }
  };

  const currentStyle = getThemeClasses();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${currentStyle.bg}`}>
      {/* Top Reading Nav */}
      <header className={`px-4 sm:px-8 py-3.5 border-b sticky top-0 z-40 flex items-center justify-between backdrop-blur-md ${currentStyle.nav}`}>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 rounded-xl hover:bg-stone-200/60 transition-colors"
            title="Back to Library"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-bold truncate max-w-xs sm:max-w-md">The Art of Shepherding & Ministry</h1>
            <p className="text-[11px] opacity-70">
              Page {currentPage} of {totalPages} &bull; {Math.round((currentPage / totalPages) * 100)}% Complete
            </p>
          </div>
        </div>

        {/* Reading Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {savedProgressMessage && (
            <span className="text-[11px] text-teal-700 font-semibold hidden sm:flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-teal-600" />
              Saved
            </span>
          )}

          {/* Theme Toggles */}
          <div className="flex items-center rounded-xl p-1 bg-stone-200/60 border border-stone-300/60">
            <button
              onClick={() => setTheme("LIGHT")}
              className={`p-1.5 rounded-lg ${theme === "LIGHT" ? "bg-white text-stone-900 shadow-xs" : "opacity-60"}`}
              title="Day Paper"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme("SEPIA")}
              className={`p-1.5 rounded-lg ${theme === "SEPIA" ? "bg-[#EADAC5] text-stone-900 shadow-xs" : "opacity-60"}`}
              title="Warm Sepia"
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme("DARK")}
              className={`p-1.5 rounded-lg ${theme === "DARK" ? "bg-stone-800 text-white shadow-xs" : "opacity-60"}`}
              title="Night Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Font Controls */}
          <div className="hidden sm:flex items-center rounded-xl p-1 bg-stone-200/60 border border-stone-300/60">
            <button
              onClick={() => setFontSize((s) => Math.max(13, s - 2))}
              className="px-2 py-0.5 text-xs font-bold opacity-70 hover:opacity-100"
            >
              A-
            </button>
            <span className="text-[11px] px-1 font-mono font-bold">{fontSize}</span>
            <button
              onClick={() => setFontSize((s) => Math.min(26, s + 2))}
              className="px-2 py-0.5 text-xs font-bold opacity-70 hover:opacity-100"
            >
              A+
            </button>
          </div>
        </div>
      </header>

      {/* Reading Canvas */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10 sm:py-16">
        <div
          className={`p-8 sm:p-14 rounded-3xl border shadow-sm transition-all leading-relaxed font-serif ${currentStyle.card}`}
          style={{ fontSize: `${fontSize}px` }}
        >
          <div className="whitespace-pre-line leading-loose">
            {activeText.replace(/\\n/g, "\n")}
          </div>
        </div>
      </main>

      {/* Floating Audio Bar (TTS) */}
      <div className={`sticky bottom-0 border-t px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg backdrop-blur-md ${currentStyle.nav}`}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-200/60 hover:bg-stone-300/70 disabled:opacity-30 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-3 bg-stone-100/90 px-4 py-2 rounded-2xl border border-stone-200">
          <button
            onClick={handleToggleTts}
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white transition-all shadow-xs ${
              isPlayingTts ? "bg-rose-600 animate-pulse" : "bg-teal-700 hover:bg-teal-800"
            }`}
          >
            {isPlayingTts ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
          </button>
          <div className="hidden sm:block">
            <span className="text-xs font-bold text-stone-900 block">
              {isPlayingTts ? "Reading Aloud..." : "Voice Reader (TTS)"}
            </span>
            <span className="text-[10px] text-stone-500">In-browser speech</span>
          </div>

          <select
            value={ttsRate}
            onChange={(e) => setTtsRate(Number(e.target.value))}
            className="bg-transparent text-xs font-mono font-bold text-stone-700 focus:outline-none"
          >
            <option value="0.8">0.8x</option>
            <option value="1.0">1.0x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
          </select>
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-30 transition-all shadow-xs"
        >
          <span className="hidden sm:inline">Next Page</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
