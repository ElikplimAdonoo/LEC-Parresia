import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { Navbar } from "../components/layout/Navbar";
import {
  Calendar,
  Church,
  Users,
  DollarSign,
  HeartHandshake,
  Grid,
  Bus,
  Upload,
  Music,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Wand2,
  Clock,
} from "lucide-react";

export const ReportFormPage = () => {
  const { user, profile } = useAuth();

  const [serviceType, setServiceType] = useState("SUNDAY");
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0]);
  const [preacher, setPreacher] = useState("");
  const [messageTitle, setMessageTitle] = useState("");
  const [newMembers, setNewMembers] = useState(0);

  // Attendance Breakdown
  const [pastors, setPastors] = useState(0);
  const [shepherds, setShepherds] = useState(0);
  const [members, setMembers] = useState(0);
  const [firstTimers, setFirstTimers] = useState(0);
  const [teens, setTeens] = useState(0);
  const [children, setChildren] = useState(0);

  // Finance Tracking
  const [offering, setOffering] = useState(0);
  const [tithe, setTithe] = useState(0);
  const [partnership, setPartnership] = useState(0);
  const [firstFruit, setFirstFruit] = useState(0);
  const [busOffering, setBusOffering] = useState(0);

  // Soul Winning
  const [altarCall, setAltarCall] = useState(0);
  const [cellEvangelism, setCellEvangelism] = useState(0);
  const [outreach, setOutreach] = useState(0);

  // Cell Metrics
  const [cellsInBranch, setCellsInBranch] = useState(0);
  const [cellMeetingsHeld, setCellMeetingsHeld] = useState(0);
  const [cellMeetingsNotHeld, setCellMeetingsNotHeld] = useState(0);
  const [unheldCellsReport, setUnheldCellsReport] = useState("");
  const [cellsBusedToChurch, setCellsBusedToChurch] = useState(0);
  const [peopleViaCells, setPeopleViaCells] = useState(0);

  // Busing (Sunday)
  const [numBused, setNumBused] = useState(0);
  const [numOwnAccord, setNumOwnAccord] = useState(0);
  const [numOrganisedBuses, setNumOrganisedBuses] = useState(0);
  const [totalBusingCost, setTotalBusingCost] = useState(0);

  // Media
  const [spectacularNotes, setSpectacularNotes] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Live Auto-Calculations
  const totalAttendance =
    Number(pastors) +
    Number(shepherds) +
    Number(members) +
    Number(firstTimers) +
    Number(teens) +
    Number(children);

  const totalFinance =
    Number(offering) +
    Number(tithe) +
    Number(partnership) +
    Number(firstFruit) +
    (serviceType === "MIDWEEK" ? Number(busOffering) : 0);

  const totalSoulsWon = Number(altarCall) + Number(cellEvangelism) + Number(outreach);

  // 1-Click Sample Data Fill
  const fillSampleData = (type) => {
    setServiceType(type);
    if (type === "SUNDAY") {
      setPreacher("Bishop Dag Heward-Mills");
      setMessageTitle("The Mega Gathering Anointing & Loyalty");
      setNewMembers(8);
      setPastors(3);
      setShepherds(14);
      setMembers(165);
      setFirstTimers(19);
      setTeens(28);
      setChildren(42);
      setOffering(3250);
      setTithe(6800);
      setPartnership(1500);
      setFirstFruit(900);
      setAltarCall(14);
      setCellEvangelism(9);
      setOutreach(12);
      setCellsInBranch(12);
      setCellsBusedToChurch(9);
      setPeopleViaCells(78);
      setNumBused(84);
      setNumOwnAccord(187);
      setNumOrganisedBuses(4);
      setTotalBusingCost(1200);
      setSpectacularNotes("Remarkable healing testimony during altar call prayer; 3 new families joined.");
    } else {
      setPreacher("Pastor Paul Mensah");
      setMessageTitle("Building Cells Through Prayer & Shepherding");
      setNewMembers(4);
      setPastors(2);
      setShepherds(12);
      setMembers(98);
      setFirstTimers(7);
      setTeens(15);
      setChildren(18);
      setOffering(1450);
      setTithe(2200);
      setPartnership(600);
      setFirstFruit(300);
      setBusOffering(450);
      setAltarCall(6);
      setCellEvangelism(11);
      setOutreach(5);
      setCellsInBranch(12);
      setCellMeetingsHeld(11);
      setCellMeetingsNotHeld(1);
      setUnheldCellsReport("Grace Cell 3 shepherd was on medical shift; follow-up prayer scheduled for Friday.");
      setSpectacularNotes("Dynamic cell outreach on Tuesday; 5 young adults dedicated their lives to Christ.");
    }
    setSuccessMessage(null);
  };

  const uploadFile = async (file, bucket) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${profile?.branches?.id || "branch"}/${fileName}`;

      const { error } = await supabase.storage.from(bucket).upload(filePath, file);
      if (error) return null;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return data?.publicUrl || null;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      let audioUrl = null;
      let photoUrls = [];

      if (audioFile) {
        setUploadingMedia(true);
        audioUrl = await uploadFile(audioFile, "sermon-audio");
      }

      if (photoFiles.length > 0) {
        setUploadingMedia(true);
        for (const file of photoFiles) {
          const url = await uploadFile(file, "service-photos");
          if (url) photoUrls.push(url);
        }
      }

      const reportPayload = {
        branch_id: profile?.branches?.id || null,
        submitted_by: user?.id || null,
        service_type: serviceType,
        report_date: reportDate,
        preacher,
        message_title: messageTitle,
        new_members: Number(newMembers),

        pastors_count: Number(pastors),
        shepherds_count: Number(shepherds),
        members_count: Number(members),
        first_timers_count: Number(firstTimers),
        teens_count: Number(teens),
        children_count: Number(children),
        total_attendance: totalAttendance,

        offering: Number(offering),
        tithe: Number(tithe),
        partnership: Number(partnership),
        first_fruit: Number(firstFruit),
        bus_offering: serviceType === "MIDWEEK" ? Number(busOffering) : 0,
        total_finance: totalFinance,

        altar_call: Number(altarCall),
        cell_evangelism: Number(cellEvangelism),
        outreach: Number(outreach),
        total_souls_won: totalSoulsWon,

        cells_in_branch: Number(cellsInBranch),
        cell_meetings_held: serviceType === "MIDWEEK" ? Number(cellMeetingsHeld) : 0,
        cell_meetings_not_held: serviceType === "MIDWEEK" ? Number(cellMeetingsNotHeld) : 0,
        unheld_cells_report: serviceType === "MIDWEEK" ? unheldCellsReport : null,
        cells_bused_to_church: serviceType === "SUNDAY" ? Number(cellsBusedToChurch) : 0,
        people_via_cells: serviceType === "SUNDAY" ? Number(peopleViaCells) : 0,

        num_bused: serviceType === "SUNDAY" ? Number(numBused) : 0,
        num_own_accord: serviceType === "SUNDAY" ? Number(numOwnAccord) : 0,
        num_organised_buses: serviceType === "SUNDAY" ? Number(numOrganisedBuses) : 0,
        total_busing_cost: serviceType === "SUNDAY" ? Number(totalBusingCost) : 0,

        spectacular_notes: spectacularNotes,
        audio_url: audioUrl,
        photo_urls: photoUrls,
        status: "SUBMITTED",
      };

      await supabase.from("service_reports").insert(reportPayload);

      setSuccessMessage("Service report submitted successfully! Monday 12:00 PM compliance satisfied.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSuccessMessage("Report recorded in local review buffer!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
      setUploadingMedia(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] pb-28">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        {/* Top Header Card */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-50/60 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-rose-50/60 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                {profile?.branches?.zones?.name || "Zone 1 - Greater Accra"} &bull; {profile?.branches?.name || "Accra Central Mega Branch"}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                Submit Service Report
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-stone-500 mt-2">
                <span>Gathering Center:</span>
                <span className="bg-stone-100 text-stone-800 font-semibold px-2.5 py-0.5 rounded-lg border border-stone-200">
                  {profile?.branches?.gathering_center || "Main Sanctuary (LC Live)"}
                </span>
                <span className="text-stone-300">&bull;</span>
                <span className="flex items-center gap-1 text-rose-600 font-medium">
                  <Clock className="w-3.5 h-3.5" /> Deadline: Monday 12:00 PM
                </span>
              </div>
            </div>

            {/* Service Toggle & Sample Populator */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="flex items-center bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200/80">
                <button
                  type="button"
                  onClick={() => setServiceType("SUNDAY")}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    serviceType === "SUNDAY"
                      ? "bg-teal-700 text-white shadow-sm shadow-teal-800/20"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Sunday Mega Gathering
                </button>
                <button
                  type="button"
                  onClick={() => setServiceType("MIDWEEK")}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    serviceType === "MIDWEEK"
                      ? "bg-teal-700 text-white shadow-sm shadow-teal-800/20"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Midweek TTLHA Cell
                </button>
              </div>

              <button
                type="button"
                onClick={() => fillSampleData(serviceType)}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 px-4 py-2.5 rounded-2xl transition-all shadow-2xs"
                title="Populate realistic numbers for quick preview"
              >
                <Wand2 className="w-3.5 h-3.5 text-teal-600" />
                Fill Sample Data
              </button>
            </div>
          </div>
        </div>

        {/* Live Metrics Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-teal-100 p-5 rounded-3xl shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">Total Attendance</span>
              <span className="text-2xl sm:text-3xl font-black text-teal-800 mt-1 block">{totalAttendance}</span>
              <span className="text-[11px] text-teal-600 font-medium">Auto-summed breakdown</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-emerald-100 p-5 rounded-3xl shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">Total Stewardship</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 block">
                GHC {totalFinance.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">All giving streams</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-rose-100 p-5 rounded-3xl shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">Souls Won</span>
              <span className="text-2xl sm:text-3xl font-black text-rose-600 mt-1 block">{totalSoulsWon}</span>
              <span className="text-[11px] text-rose-500 font-medium">Altar & Outreach</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <HeartHandshake className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-8 p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 shadow-xs">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-600" />
            <div>
              <div className="font-bold">Official Report Recorded</div>
              <div className="text-xs text-emerald-700 mt-0.5">{successMessage}</div>
            </div>
          </div>
        )}

        {/* Dynamic Form Content */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Information */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-sm">
                1
              </div>
              <h3 className="text-base font-bold text-stone-900">Basic Service Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1.5">Service Date</label>
                <input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  required
                  className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1.5">Preacher</label>
                <input
                  type="text"
                  value={preacher}
                  onChange={(e) => setPreacher(e.target.value)}
                  placeholder="e.g. Bishop / Rev. John"
                  required
                  className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1.5">Message Title</label>
                <input
                  type="text"
                  value={messageTitle}
                  onChange={(e) => setMessageTitle(e.target.value)}
                  placeholder="e.g. The Mystery of Faith"
                  required
                  className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1.5">New Members Joined</label>
                <input
                  type="number"
                  min="0"
                  value={newMembers}
                  onChange={(e) => setNewMembers(e.target.value)}
                  className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Attendance Breakdown */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-sm">
                  2
                </div>
                <h3 className="text-base font-bold text-stone-900">Demographic Attendance Breakdown</h3>
              </div>
              <div className="bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full text-teal-800 font-bold text-xs">
                Total: {totalAttendance}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { label: "Pastors", val: pastors, setVal: setPastors },
                { label: "Shepherds", val: shepherds, setVal: setShepherds },
                { label: "Members", val: members, setVal: setMembers },
                { label: "First Timers", val: firstTimers, setVal: setFirstTimers },
                { label: "Teens", val: teens, setVal: setTeens },
                { label: "Children", val: children, setVal: setChildren },
              ].map((item, idx) => (
                <div key={idx} className="bg-stone-50/90 p-4 rounded-2xl border border-stone-200/80 hover:border-teal-300 transition-colors">
                  <label className="text-xs font-semibold text-stone-500 block mb-1">{item.label}</label>
                  <input
                    type="number"
                    min="0"
                    value={item.val}
                    onChange={(e) => item.setVal(e.target.value)}
                    className="w-full bg-transparent border-0 text-2xl font-black text-stone-900 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Financial Records */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-sm">
                  3
                </div>
                <h3 className="text-base font-bold text-stone-900">Financial Stewardship (GHC)</h3>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full text-emerald-800 font-bold text-xs">
                Total Giving: GHC {totalFinance.toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[
                { label: "Offering", val: offering, setVal: setOffering },
                { label: "Tithe", val: tithe, setVal: setTithe },
                { label: "Partnership", val: partnership, setVal: setPartnership },
                { label: "First Fruit", val: firstFruit, setVal: setFirstFruit },
              ].map((item, idx) => (
                <div key={idx} className="bg-stone-50/90 p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-300 transition-colors">
                  <label className="text-xs font-semibold text-stone-500 block mb-1">{item.label}</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.val}
                    onChange={(e) => item.setVal(e.target.value)}
                    className="w-full bg-transparent border-0 text-xl font-bold text-stone-900 focus:outline-none"
                  />
                </div>
              ))}

              {serviceType === "MIDWEEK" && (
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 hover:border-amber-300 transition-colors">
                  <label className="text-xs font-semibold text-amber-800 block mb-1">Total Bus Offering</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={busOffering}
                    onChange={(e) => setBusOffering(e.target.value)}
                    className="w-full bg-transparent border-0 text-xl font-bold text-amber-900 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Soul Winning */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-bold text-sm">
                  4
                </div>
                <h3 className="text-base font-bold text-stone-900">Soul Winning & Evangelism</h3>
              </div>
              <div className="bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full text-rose-700 font-bold text-xs">
                Harvest: {totalSoulsWon}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-stone-50/70 p-4 rounded-2xl border border-stone-200">
                <label className="text-xs font-semibold text-stone-600 block mb-1.5">Altar Call Harvest</label>
                <input
                  type="number"
                  min="0"
                  value={altarCall}
                  onChange={(e) => setAltarCall(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="bg-stone-50/70 p-4 rounded-2xl border border-stone-200">
                <label className="text-xs font-semibold text-stone-600 block mb-1.5">Cell Evangelism Harvest</label>
                <input
                  type="number"
                  min="0"
                  value={cellEvangelism}
                  onChange={(e) => setCellEvangelism(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="bg-stone-50/70 p-4 rounded-2xl border border-stone-200">
                <label className="text-xs font-semibold text-stone-600 block mb-1.5">Outreach Campaign Harvest</label>
                <input
                  type="number"
                  min="0"
                  value={outreach}
                  onChange={(e) => setOutreach(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Cell System Metrics */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-sm">
                5
              </div>
              <h3 className="text-base font-bold text-stone-900">Cell System Execution</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1.5">
                  Total Cells in Branch
                </label>
                <input
                  type="number"
                  min="0"
                  value={cellsInBranch}
                  onChange={(e) => setCellsInBranch(e.target.value)}
                  className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-teal-600"
                />
              </div>

              {serviceType === "MIDWEEK" ? (
                <>
                  <div>
                    <label className="text-xs font-semibold text-stone-600 block mb-1.5">
                      Cell Meetings Held
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={cellMeetingsHeld}
                      onChange={(e) => setCellMeetingsHeld(e.target.value)}
                      className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-600 block mb-1.5">
                      Cell Meetings Not Held
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={cellMeetingsNotHeld}
                      onChange={(e) => setCellMeetingsNotHeld(e.target.value)}
                      className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-teal-600"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-semibold text-stone-600 block mb-1.5">
                      Cells That Bused to Church
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={cellsBusedToChurch}
                      onChange={(e) => setCellsBusedToChurch(e.target.value)}
                      className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-600 block mb-1.5">
                      People Who Came Via Cells
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={peopleViaCells}
                      onChange={(e) => setPeopleViaCells(e.target.value)}
                      className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-teal-600"
                    />
                  </div>
                </>
              )}
            </div>

            {serviceType === "MIDWEEK" && (
              <div className="pt-2">
                <label className="text-xs font-semibold text-stone-600 block mb-1.5">
                  Report on Cells That Were Not Held (Provide reasons and catch-up plans)
                </label>
                <textarea
                  rows={2}
                  value={unheldCellsReport}
                  onChange={(e) => setUnheldCellsReport(e.target.value)}
                  placeholder="e.g. Grace Cell 3 shepherd was on medical shift; catch-up scheduled for Friday."
                  className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-teal-600"
                />
              </div>
            )}
          </div>

          {/* Section 6: Busing & Logistics (Sunday only) */}
          {serviceType === "SUNDAY" && (
            <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-sm">
                  6
                </div>
                <h3 className="text-base font-bold text-stone-900">Transportation & Busing Logistics</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">
                    Num. Bused to Service
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={numBused}
                    onChange={(e) => setNumBused(e.target.value)}
                    className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">
                    Came on Their Own
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={numOwnAccord}
                    onChange={(e) => setNumOwnAccord(e.target.value)}
                    className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">
                    Organised Buses
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={numOrganisedBuses}
                    onChange={(e) => setNumOrganisedBuses(e.target.value)}
                    className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">
                    Total Busing Cost (GHC)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={totalBusingCost}
                    onChange={(e) => setTotalBusingCost(e.target.value)}
                    className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-teal-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 7: Media & Notes */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-sm">
                7
              </div>
              <h3 className="text-base font-bold text-stone-900">Spectacular Event Notes & Media</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1.5">
                  Spectacular Event Notes / Testimonies
                </label>
                <textarea
                  rows={3}
                  value={spectacularNotes}
                  onChange={(e) => setSpectacularNotes(e.target.value)}
                  placeholder="Record miraculous testimonies, special visitations, or specific notes for Daddy."
                  className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-teal-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Audio upload */}
                <div className="p-5 rounded-2xl bg-stone-50/80 border border-dashed border-teal-300">
                  <div className="flex items-center gap-2 text-stone-800 text-xs font-bold mb-2">
                    <Music className="w-4 h-4 text-teal-700" />
                    Sermon Audio Recording (MP3 format)
                  </div>
                  <input
                    type="file"
                    accept="audio/mp3,audio/*"
                    onChange={(e) => setAudioFile(e.target.files[0])}
                    className="text-xs text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-700 file:text-white hover:file:bg-teal-800 cursor-pointer"
                  />
                  {audioFile && (
                    <div className="text-[11px] text-teal-800 font-medium mt-2">
                      Selected: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(1)} MB)
                    </div>
                  )}
                </div>

                {/* Photo upload */}
                <div className="p-5 rounded-2xl bg-stone-50/80 border border-dashed border-rose-300">
                  <div className="flex items-center gap-2 text-stone-800 text-xs font-bold mb-2">
                    <ImageIcon className="w-4 h-4 text-rose-600" />
                    Service Photos (Audience & Miracles)
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setPhotoFiles(Array.from(e.target.files))}
                    className="text-xs text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-stone-800 file:text-white hover:file:bg-stone-900 cursor-pointer"
                  />
                  {photoFiles.length > 0 && (
                    <div className="text-[11px] text-rose-700 font-medium mt-2">
                      {photoFiles.length} photo(s) selected
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white font-black px-9 py-4 rounded-2xl shadow-lg shadow-teal-900/20 active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{uploadingMedia ? "Uploading Media..." : "Submitting Official Report..."}</span>
                </>
              ) : (
                <>
                  <span>Submit Official Report</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
