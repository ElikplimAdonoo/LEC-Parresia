import React, { useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { MessageSquare, ThumbsUp, Send, BookOpen } from "lucide-react";

export const CommunityPage = () => {
  const [commentText, setCommentText] = useState("");
  const [discussions, setDiscussions] = useState([
    {
      id: "c1",
      author: "Pastor Samuel K.",
      time: "2 hours ago",
      book: "The Art of Shepherding",
      text: "Chapter 2 completely revolutionized how our branch approaches Saturday follow-up. The point on intercessory prayer before busing makes all the difference!",
      likes: 12,
    },
    {
      id: "c2",
      author: "Sister Grace D.",
      time: "Yesterday",
      book: "Loyalty and Disloyalty",
      text: "A profound reminder for every cell worker. Consistency in prayer and submission to leadership always produces enduring fruit.",
      likes: 8,
    },
  ]);

  const handlePost = (e) => {
    e.preventDefault();
    if (!commentText) return;
    setDiscussions([
      {
        id: `c_${Date.now()}`,
        author: "You",
        time: "Just now",
        book: "General Discussion",
        text: commentText,
        likes: 0,
      },
      ...discussions,
    ]);
    setCommentText("");
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] pb-24">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            Reader Fellowship
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Community Reflections</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Share chapter reflections, recommend literature, and engage with believers across all church zones.
          </p>
        </div>

        {/* Post Form */}
        <form onSubmit={handlePost} className="bg-white border border-stone-200/90 p-6 rounded-3xl mb-8 shadow-xs">
          <textarea
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share an insight or testimony from your current reading..."
            className="w-full bg-stone-50/70 border border-stone-200 rounded-2xl p-4 text-xs sm:text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-teal-600 mb-3"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!commentText}
              className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-xs disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              Post Reflection
            </button>
          </div>
        </form>

        {/* Discussions List */}
        <div className="space-y-4">
          {discussions.map((d) => (
            <div key={d.id} className="bg-white border border-stone-200/90 p-6 rounded-3xl shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                    {d.author[0]}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900">{d.author}</span>
                    <span className="text-[11px] text-stone-400 block">{d.time}</span>
                  </div>
                </div>
                <span className="text-[10px] bg-stone-100 text-stone-700 font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-stone-200">
                  <BookOpen className="w-3 h-3 text-teal-700" />
                  {d.book}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed my-3">{d.text}</p>

              <div className="flex items-center gap-4 pt-2 border-t border-stone-100 text-stone-400 text-xs">
                <button className="flex items-center gap-1 hover:text-rose-600 transition-colors">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{d.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
