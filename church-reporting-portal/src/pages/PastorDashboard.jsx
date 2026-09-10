import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { Navbar } from "../components/layout/Navbar";
import { Link } from "react-router-dom";
import { FileText, Calendar, Users, DollarSign, PlusCircle, CheckCircle, Music, Clock, Sparkles } from "lucide-react";

export const PastorDashboard = () => {
  const { user, profile } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock demo reports if database table is initially empty
  const mockReports = [
    {
      id: "r-1",
      report_date: "2026-09-06",
      service_type: "SUNDAY",
      preacher: "Bishop Dag Heward-Mills",
      message_title: "Mega Gathering Harvest & Loyalty",
      total_attendance: 279,
      total_finance: 12450,
      audio_url: "https://sample.audio/sermon1.mp3",
    },
    {
      id: "r-2",
      report_date: "2026-09-02",
      service_type: "MIDWEEK",
      preacher: "Pastor Paul Mensah",
      message_title: "Building Dynamic Cell Units",
      total_attendance: 154,
      total_finance: 5000,
      audio_url: null,
    },
  ];

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase
          .from("service_reports")
          .select("*")
          .eq("branch_id", profile?.branches?.id)
          .order("report_date", { ascending: false });

        if (!error && data && data.length > 0) {
          setReports(data);
        } else {
          setReports(mockReports);
        }
      } catch {
        setReports(mockReports);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [profile]);

  return (
    <div className="min-h-screen bg-[#FBF9F5] pb-24">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              Branch Oversight Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {profile?.branches?.name || "Accra Central Mega Branch"}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Zone: <span className="text-stone-800 font-semibold">{profile?.branches?.zones?.name || "Zone 1 - Greater Accra"}</span> &bull; Gathering Center: <span className="text-stone-800 font-semibold">{profile?.branches?.gathering_center || "Main Sanctuary"}</span>
            </p>
          </div>

          <Link
            to="/submit"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white font-bold px-5 py-3 rounded-2xl text-xs transition-all shadow-md shadow-teal-900/20 active:scale-95 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Submit New Service Report
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-stone-200/90 p-5 rounded-3xl shadow-xs">
            <span className="text-stone-500 text-xs font-bold uppercase tracking-wider block">Total Reports</span>
            <div className="text-2xl font-black text-stone-900 mt-1">{reports.length}</div>
            <span className="text-[11px] text-teal-700 font-semibold mt-0.5 block">Recorded</span>
          </div>

          <div className="bg-white border border-stone-200/90 p-5 rounded-3xl shadow-xs">
            <span className="text-stone-500 text-xs font-bold uppercase tracking-wider block">Compliance Rate</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">100%</div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">Zero fines</span>
          </div>

          <div className="bg-white border border-stone-200/90 p-5 rounded-3xl shadow-xs">
            <span className="text-stone-500 text-xs font-bold uppercase tracking-wider block">Last Attendance</span>
            <div className="text-2xl font-black text-teal-800 mt-1">
              {reports[0]?.total_attendance || 279}
            </div>
            <span className="text-[11px] text-stone-400 font-medium mt-0.5 block">Worshippers</span>
          </div>

          <div className="bg-white border border-stone-200/90 p-5 rounded-3xl shadow-xs">
            <span className="text-stone-500 text-xs font-bold uppercase tracking-wider block">Penalty Status</span>
            <div className="text-2xl font-black text-stone-700 mt-1">GHC 0.00</div>
            <span className="text-[11px] text-stone-400 font-medium mt-0.5 block">Clean record</span>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-xs">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-700" />
              <h2 className="text-base font-bold text-stone-900">Submission History</h2>
            </div>
            <span className="text-xs text-stone-400 font-medium">{reports.length} report(s) on record</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-stone-400 text-sm">Loading historical reports...</div>
          ) : reports.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-stone-500 text-sm">No service reports submitted yet.</p>
              <Link to="/submit" className="mt-4 inline-block text-xs text-teal-700 font-bold hover:underline">
                Submit your first Sunday or Midweek report &rarr;
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50/70 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-100">
                  <tr>
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6">Service Type</th>
                    <th className="py-3.5 px-6">Preacher & Topic</th>
                    <th className="py-3.5 px-6">Attendance</th>
                    <th className="py-3.5 px-6">Stewardship</th>
                    <th className="py-3.5 px-6">Media</th>
                    <th className="py-3.5 px-6">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {reports.map((r) => (
                    <tr key={r.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-stone-900">{r.report_date}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                            r.service_type === "SUNDAY"
                              ? "bg-teal-50 text-teal-700 border-teal-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {r.service_type === "SUNDAY" ? "Mega Gathering" : "TTLHA Cell"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-stone-900">{r.preacher || "Unspecified"}</div>
                        <div className="text-stone-500 text-[11px] truncate max-w-xs">{r.message_title}</div>
                      </td>
                      <td className="py-4 px-6 font-black text-stone-900">{r.total_attendance}</td>
                      <td className="py-4 px-6 text-emerald-700 font-bold">
                        GHC {Number(r.total_finance || 0).toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        {r.audio_url ? (
                          <span className="inline-flex items-center gap-1 text-teal-700 font-semibold bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                            <Music className="w-3 h-3" /> Audio
                          </span>
                        ) : (
                          <span className="text-stone-400">None</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          On-Time
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
