import React, { useState } from "react";
import { Navbar } from "../../components/layout/Navbar";
import {
  Shield,
  BookPlus,
  Users,
  BarChart3,
  Upload,
  CheckCircle2,
  Trash2,
} from "lucide-react";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("LIBRARY");
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newCategory, setNewCategory] = useState("Leadership");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [members, setMembers] = useState([
    { id: "m1", name: "Kofi Annan", email: "kofi@example.com", status: "ACTIVE", booksRead: 4 },
    { id: "m2", name: "Ama Boateng", email: "ama@example.com", status: "ACTIVE", booksRead: 7 },
    { id: "m3", name: "Flagged User", email: "flagged@example.com", status: "SUSPENDED", booksRead: 0 },
  ]);

  const handleUploadDoc = (e) => {
    e.preventDefault();
    if (!newTitle) return;
    setUploadSuccess(true);
    setNewTitle("");
    setNewAuthor("");
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const handleToggleStatus = (id) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: m.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" } : m
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] pb-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" />
              Administrative Oversight
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Reading Hub Operations Console
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Manage literature catalog, enforce reader moderation, and review community analytics.
            </p>
          </div>

          <div className="flex items-center bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
            {[
              { id: "LIBRARY", label: "Library Catalog", icon: BookPlus },
              { id: "USERS", label: "Member Access", icon: Users },
              { id: "ANALYTICS", label: "Analytics", icon: BarChart3 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-teal-700 text-white shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === "LIBRARY" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-stone-200/90 p-6 rounded-3xl shadow-xs">
              <h3 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4 text-teal-700" />
                Upload New Document
              </h3>

              {uploadSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Document published to library!
                </div>
              )}

              <form onSubmit={handleUploadDoc} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">Book Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    placeholder="e.g. Catch the Anointing"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">Author</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Bishop Dag Heward-Mills"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-teal-600"
                  >
                    <option value="Leadership">Leadership</option>
                    <option value="Evangelism">Evangelism</option>
                    <option value="Spiritual Growth">Spiritual Growth</option>
                    <option value="Church Growth">Church Growth</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">PDF File</label>
                  <input
                    type="file"
                    accept=".pdf"
                    className="text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-700 file:text-white cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-xs"
                >
                  Publish to Community
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs">
              <h3 className="text-base font-bold text-stone-900 mb-4">Published Library Literature</h3>
              <div className="divide-y divide-stone-100">
                {[
                  { title: "The Art of Shepherding & Leadership", author: "Bishop Dag Heward-Mills", cat: "Leadership", reads: 142 },
                  { title: "Soul Winning & Cell Multiplication", author: "Pastor Tee Publications", cat: "Evangelism", reads: 88 },
                  { title: "Loyalty and Disloyalty", author: "Bishop Dag Heward-Mills", cat: "Spiritual Growth", reads: 215 },
                ].map((b, i) => (
                  <div key={i} className="py-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">{b.title}</h4>
                      <p className="text-xs text-stone-500">{b.author} &bull; {b.cat}</p>
                      <span className="text-[11px] text-teal-700 font-semibold mt-1 block">{b.reads} Active Readers</span>
                    </div>

                    <button className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "USERS" && (
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-stone-900 mb-4">Registered Readers & Permissions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50/70 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-100">
                  <tr>
                    <th className="py-3 px-4">Member</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Books Read</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-stone-900">{m.name}</td>
                      <td className="py-3.5 px-4 text-stone-500">{m.email}</td>
                      <td className="py-3.5 px-4 font-black">{m.booksRead}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            m.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleStatus(m.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                            m.status === "ACTIVE"
                              ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                          }`}
                        >
                          {m.status === "ACTIVE" ? "Suspend Account" : "Reactivate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "ANALYTICS" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-teal-100 p-6 rounded-3xl shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Active Daily Readers</span>
              <div className="text-3xl font-black text-teal-900 mt-2">184</div>
              <span className="text-xs text-teal-700 font-semibold mt-1 block">&uarr; 14% growth this month</span>
            </div>
            <div className="bg-white border border-emerald-100 p-6 rounded-3xl shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Total Reading Minutes</span>
              <div className="text-3xl font-black text-emerald-700 mt-2">12,450 min</div>
              <span className="text-xs text-stone-400 font-medium mt-1 block">TTS and reader combined</span>
            </div>
            <div className="bg-white border border-rose-100 p-6 rounded-3xl shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Top Church Literature</span>
              <div className="text-base font-black text-stone-900 mt-2">The Art of Shepherding</div>
              <span className="text-xs text-rose-600 font-semibold mt-1 block">215 completions</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
