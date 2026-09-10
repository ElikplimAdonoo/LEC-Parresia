import React, { useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { Link } from "react-router-dom";
import { Bookmark, Folder, Share2, Plus } from "lucide-react";

export const BookshelfPage = () => {
  const [shelves] = useState([
    { id: "s1", name: "Currently Reading", count: 2, is_public: false },
    { id: "s2", name: "Completed Ministry Books", count: 5, is_public: true },
    { id: "s3", name: "Cell Shepherding Study", count: 3, is_public: true },
  ]);

  return (
    <div className="min-h-screen bg-[#FBF9F5] pb-24">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Bookmark className="w-4 h-4" />
              Personal Reading Library
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">My Bookshelves</h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Organize study materials, bookmark active devotionals, and share reading lists with your cell.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition-all shadow-xs self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            Create New Shelf
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {shelves.map((shelf) => (
            <div
              key={shelf.id}
              className="bg-white border border-stone-200/90 p-6 rounded-3xl hover:border-teal-300 transition-colors shadow-xs"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                  <Folder className="w-5 h-5" />
                </div>
                {shelf.is_public && (
                  <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200 flex items-center gap-1 font-semibold">
                    <Share2 className="w-3 h-3" /> Shared
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-1">{shelf.name}</h3>
              <p className="text-xs text-stone-500 mb-4">{shelf.count} Document(s) in collection</p>

              <Link
                to="/"
                className="text-xs text-teal-700 font-bold hover:underline inline-flex items-center gap-1"
              >
                Browse Collection &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
