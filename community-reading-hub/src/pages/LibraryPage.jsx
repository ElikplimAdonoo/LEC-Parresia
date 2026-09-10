import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Navbar } from "../components/layout/Navbar";
import {
  BookOpen,
  Search,
  Grid,
  List,
  Bookmark,
  Headphones,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const LibraryPage = () => {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [viewMode, setViewMode] = useState("GRID");

  const curatedDocs = [
    {
      id: "doc-1",
      title: "The Art of Shepherding & Leadership",
      author: "Bishop Dag Heward-Mills",
      category: "Leadership",
      total_pages: 180,
      description: "Fundamental doctrines of biblical shepherding, cell multiplication, and spiritual loyalty.",
      bgGradient: "from-teal-600 to-teal-800",
      accent: "teal",
    },
    {
      id: "doc-2",
      title: "Soul Winning & Cell Multiplication",
      author: "Pastor Tee Publications",
      category: "Evangelism",
      total_pages: 94,
      description: "Practical steps to host dynamic TTLHA cell meetings and bus new souls to Sunday Mega Gathering.",
      bgGradient: "from-rose-500 to-rose-700",
      accent: "rose",
    },
    {
      id: "doc-3",
      title: "Loyalty and Disloyalty",
      author: "Bishop Dag Heward-Mills",
      category: "Spiritual Growth",
      total_pages: 140,
      description: "An indispensable guide for every church worker, shepherd, and pastor in Christian ministry.",
      bgGradient: "from-amber-600 to-amber-800",
      accent: "amber",
    },
    {
      id: "doc-4",
      title: "Mega Church Principles",
      author: "Bishop Dag Heward-Mills",
      category: "Church Growth",
      total_pages: 210,
      description: "How to make your church grow through busing logistics, anagkazo evangelism, and structured cells.",
      bgGradient: "from-teal-700 to-emerald-800",
      accent: "emerald",
    },
  ];

  const categories = ["ALL", "Leadership", "Evangelism", "Spiritual Growth", "Church Growth"];

  const filteredDocs = curatedDocs.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FBF9F5] pb-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* Hero Banner */}
        <div className="bg-white border border-stone-200/90 p-8 sm:p-10 rounded-3xl mb-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50/70 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-rose-50/70 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Ministry Literature & Word Library
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                Read, Listen & Flourish
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-xl leading-relaxed">
                Explore pastoral e-books and study plans. Listen on-the-go with continuous Voice Text-to-Speech narration and automatic bookmark persistence.
              </p>
            </div>

            <Link
              to="/plans"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white font-bold px-5 py-3.5 rounded-2xl text-xs transition-all shadow-md shadow-teal-900/20 active:scale-95 self-start md:self-auto"
            >
              Join Official Reading Plan
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by book title or author..."
              className="w-full bg-white border border-stone-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 shadow-2xs transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-teal-700 text-white shadow-xs"
                    : "bg-white border border-stone-200 text-stone-600 hover:text-stone-900"
                }`}
              >
                {cat}
              </button>
            ))}

            <div className="h-4 w-[1px] bg-stone-200 mx-1 hidden sm:block" />

            <div className="flex items-center bg-white border border-stone-200 p-1 rounded-xl shadow-2xs">
              <button
                onClick={() => setViewMode("GRID")}
                className={`p-1.5 rounded-lg ${viewMode === "GRID" ? "bg-stone-100 text-stone-900" : "text-stone-400"}`}
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("LIST")}
                className={`p-1.5 rounded-lg ${viewMode === "LIST" ? "bg-stone-100 text-stone-900" : "text-stone-400"}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {viewMode === "GRID" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-stone-200/90 hover:border-teal-300 rounded-3xl overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1 shadow-xs hover:shadow-md"
              >
                {/* Book Cover Banner */}
                <div
                  className={`h-48 bg-gradient-to-br ${doc.bgGradient} p-6 flex flex-col justify-between text-white relative shadow-inner`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-black/20 backdrop-blur-md px-2.5 py-0.5 rounded-full self-start">
                    {doc.category}
                  </span>
                  <div>
                    <h3 className="text-base font-black tracking-tight line-clamp-2 leading-snug">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-white/90 mt-1 font-medium">{doc.author}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed mb-4">
                    {doc.description}
                  </p>

                  <div className="space-y-3 pt-3 border-t border-stone-100">
                    <div className="flex items-center justify-between text-[11px] text-stone-400 font-medium">
                      <span>{doc.total_pages} pages</span>
                      <span className="flex items-center gap-1 text-teal-700 font-semibold">
                        <Headphones className="w-3 h-3" />
                        Voice Ready
                      </span>
                    </div>

                    <Link
                      to={`/read/${doc.id}`}
                      className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-2xl text-xs transition-all shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Read / Listen Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-stone-200/90 rounded-3xl divide-y divide-stone-100 overflow-hidden shadow-xs">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="p-5 flex items-center justify-between gap-4 hover:bg-stone-50/70 transition-colors">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-16 rounded-xl bg-gradient-to-br ${doc.bgGradient} flex items-center justify-center text-white shrink-0 shadow-xs`}
                  >
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">{doc.title}</h3>
                    <p className="text-xs text-stone-500">{doc.author} &bull; {doc.category}</p>
                    <span className="text-[11px] text-stone-400 mt-1 block">{doc.total_pages} pages</span>
                  </div>
                </div>

                <Link
                  to={`/read/${doc.id}`}
                  className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Read Now
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
