import React, { useState, useEffect } from "react";
import { AppShell } from "../components/layout/AppShell";
import { useAuth } from "../contexts/AuthContext";
import {
  saveReport,
  getStoredReports,
  checkDuplicateReport,
  undoReport,
  canUndoReport,
  getRemainingUndoTime,
} from "../lib/reportStore";
import { CheckCircle2, ArrowRight, AlertCircle, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ReportFormPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState("SUNDAY_MEGA"); // "SUNDAY_MEGA" | "MIDWEEK_TTLHA"
  const [submitting, setSubmitting] = useState(false);
  const [existingReports, setExistingReports] = useState([]);
  const [validationError, setValidationError] = useState("");
  const [undoNotice, setUndoNotice] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);

  const defaultBranch = profile?.branches?.name || "Parresia";
  const defaultPastor = profile?.full_name || "Rev. Makafui Tetteh Kumahlor";

  const emptyForm = {
    branch_name: defaultBranch,
    pastor_name: defaultPastor,
    service_date: "",
    gathering_center: "",

    // Attendance
    pastors_count: "",
    shepherds_count: "",
    members_count: "",
    first_timers_count: "",
    children_count: "",
    teens_count: "",

    // Finance (GHC)
    offering: "",
    tithe: "",
    partnership: "",
    first_fruit: "",
    total_bus_offering: "", // TTLHA

    // Preacher & Message (Text)
    preacher: "",
    message_title: "",
    new_members: "",

    // Busing (MGS only - 2 on a line)
    num_bused: "",
    num_own_accord: "",
    num_organised_buses: "",
    total_busing_cost: "",

    // Soul Winning
    altar_call: "",
    cell_evangelism: "",
    outreach: "",

    // Cell System
    num_cells_in_branch: "",
    num_cells_bused: "", // MGS
    num_people_via_cells: "", // MGS
    cell_meetings_held: "", // TTLHA
    cell_meetings_not_held: "", // TTLHA

    // Text Areas
    spectacular_event: "",
    unheld_cells_report: "", // TTLHA

    // Media (MGS only)
    sermon_audio_name: "",
    sermon_audio_data: "", // base64 or objectURL
    google_photos_url: "",
  };

  const [form, setForm] = useState(emptyForm);

  // Load existing reports to track already-submitted services
  const refreshReports = async () => {
    try {
      const reports = await getStoredReports();
      setExistingReports(reports);
    } catch (e) {
      console.error("Error loading stored reports:", e);
    }
  };

  useEffect(() => {
    refreshReports();
  }, []);

  const isSunday = serviceType === "SUNDAY_MEGA";

  // Check if a report for this branch, date and service type has already been submitted
  const existingReport = checkDuplicateReport(
    form.branch_name,
    form.service_date,
    serviceType,
    existingReports
  );

  const isUndoable = existingReport && canUndoReport(existingReport);
  const remainingTimeStr = existingReport ? getRemainingUndoTime(existingReport) : null;

  // Dynamic calculations
  const totalAttendance =
    (parseInt(form.pastors_count) || 0) +
    (parseInt(form.shepherds_count) || 0) +
    (parseInt(form.members_count) || 0) +
    (parseInt(form.first_timers_count) || 0) +
    (parseInt(form.children_count) || 0) +
    (parseInt(form.teens_count) || 0);

  const totalFinance =
    (parseFloat(form.offering) || 0) +
    (parseFloat(form.tithe) || 0) +
    (parseFloat(form.partnership) || 0) +
    (parseFloat(form.first_fruit) || 0);

  const totalSoulsWon =
    (parseInt(form.altar_call) || 0) +
    (parseInt(form.cell_evangelism) || 0) +
    (parseInt(form.outreach) || 0);

  const fillSampleData = () => {
    setValidationError("");
    setUndoNotice("");
    if (serviceType === "SUNDAY_MEGA") {
      setForm({
        branch_name: "Parresia",
        pastor_name: "Rev. Makafui Tetteh Kumahlor",
        service_date: new Date().toISOString().split("T")[0],
        gathering_center: "LC Live Center",
        pastors_count: "2",
        shepherds_count: "14",
        members_count: "110",
        first_timers_count: "12",
        children_count: "26",
        teens_count: "20",
        offering: "1450.00",
        tithe: "2500.00",
        partnership: "800.00",
        first_fruit: "500.00",
        total_bus_offering: "",
        preacher: "Bishop Isaac Oti-Boateng",
        message_title: "The Parresia of Faith",
        new_members: "8",
        num_bused: "65",
        num_own_accord: "119",
        num_organised_buses: "3",
        total_busing_cost: "450.00",
        altar_call: "9",
        cell_evangelism: "14",
        outreach: "22",
        num_cells_in_branch: "12",
        num_cells_bused: "10",
        num_people_via_cells: "72",
        cell_meetings_held: "",
        cell_meetings_not_held: "",
        spectacular_event: "Mighty move of the Spirit with testimonies of healing and breakthrough.",
        unheld_cells_report: "",
      });
    } else {
      setForm({
        branch_name: "Parresia",
        pastor_name: "Rev. Makafui Tetteh Kumahlor",
        service_date: new Date().toISOString().split("T")[0],
        gathering_center: "LC Live Center",
        pastors_count: "1",
        shepherds_count: "12",
        members_count: "68",
        first_timers_count: "5",
        children_count: "14",
        teens_count: "10",
        offering: "620.00",
        tithe: "950.00",
        partnership: "400.00",
        first_fruit: "200.00",
        total_bus_offering: "150.00",
        preacher: "Rev. Makafui Tetteh Kumahlor",
        message_title: "TTLHA - Living The Life He Accorded",
        new_members: "3",
        num_bused: "",
        num_own_accord: "",
        num_organised_buses: "",
        total_busing_cost: "",
        altar_call: "4",
        cell_evangelism: "8",
        outreach: "10",
        num_cells_in_branch: "12",
        num_cells_bused: "",
        num_people_via_cells: "",
        cell_meetings_held: "11",
        cell_meetings_not_held: "1",
        spectacular_event: "Powerful cell fellowship with deep communion and spiritual warmth.",
        unheld_cells_report: "Victory Cell Leader travelled out of town for work commitment; rescheduled for Saturday morning.",
      });
    }
  };

  const handleChange = (e) => {
    setValidationError("");
    setUndoNotice("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUndo = async (reportId) => {
    try {
      const undone = await undoReport(reportId);
      // Restore form values from undone report so attendance can be revised
      setForm({
        branch_name: undone.branch_name || defaultBranch,
        pastor_name: undone.pastor_name || defaultPastor,
        service_date: undone.service_date || "",
        gathering_center: undone.gathering_center || "",
        pastors_count: String(undone.pastors_count ?? ""),
        shepherds_count: String(undone.shepherds_count ?? ""),
        members_count: String(undone.members_count ?? ""),
        first_timers_count: String(undone.first_timers_count ?? ""),
        children_count: String(undone.children_count ?? ""),
        teens_count: String(undone.teens_count ?? ""),
        offering: String(undone.offering ?? ""),
        tithe: String(undone.tithe ?? ""),
        partnership: String(undone.partnership ?? ""),
        first_fruit: String(undone.first_fruit ?? ""),
        total_bus_offering: String(undone.total_bus_offering ?? ""),
        preacher: undone.preacher || "",
        message_title: undone.message_title || "",
        new_members: String(undone.new_members ?? ""),
        num_bused: String(undone.num_bused ?? ""),
        num_own_accord: String(undone.num_own_accord ?? ""),
        num_organised_buses: String(undone.num_organised_buses ?? ""),
        total_busing_cost: String(undone.total_busing_cost ?? ""),
        altar_call: String(undone.altar_call ?? ""),
        cell_evangelism: String(undone.cell_evangelism ?? ""),
        outreach: String(undone.outreach ?? ""),
        num_cells_in_branch: String(undone.num_cells_in_branch ?? ""),
        num_cells_bused: String(undone.num_cells_bused ?? ""),
        num_people_via_cells: String(undone.num_people_via_cells ?? ""),
        cell_meetings_held: String(undone.cell_meetings_held ?? ""),
        cell_meetings_not_held: String(undone.cell_meetings_not_held ?? ""),
        spectacular_event: undone.spectacular_event || "",
        unheld_cells_report: undone.unheld_cells_report || "",
      });

      setShowSuccessModal(false);
      setSubmittedReport(null);
      setValidationError("");
      setUndoNotice(
        "Submission has been undone. You can now adjust attendance and figures and re-submit."
      );
      await refreshReports();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setValidationError(err.message || "Failed to undo submission.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    setUndoNotice("");

    // 1. Duplicate Check: Submission cannot be done more than once for the same service
    const duplicate = checkDuplicateReport(
      form.branch_name,
      form.service_date,
      serviceType,
      existingReports
    );

    if (duplicate) {
      setValidationError(
        `A report for ${form.branch_name} on ${form.service_date} (${
          isSunday ? "Mega Gathering Service" : "TTLHA Cell Service"
        }) has already been submitted. Multiple submissions for the same service are not allowed.`
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // 2. Strict mandatory field check: Every single question is required
    const requiredQuestions = isSunday
      ? [
          { key: "service_date", label: "Date" },
          { key: "gathering_center", label: "Gathering Center" },
          { key: "branch_name", label: "Name of Branch" },
          { key: "pastor_name", label: "Name of Pastor" },
          { key: "pastors_count", label: "Pastors" },
          { key: "shepherds_count", label: "Shepherds" },
          { key: "members_count", label: "Members" },
          { key: "first_timers_count", label: "First Timers" },
          { key: "children_count", label: "Children" },
          { key: "teens_count", label: "Teens" },
          { key: "offering", label: "Offering" },
          { key: "tithe", label: "Tithe" },
          { key: "partnership", label: "Partnership" },
          { key: "first_fruit", label: "First Fruit" },
          { key: "preacher", label: "Preacher" },
          { key: "message_title", label: "Message Title" },
          { key: "new_members", label: "Number of New Members" },
          { key: "num_bused", label: "Num. of People Bused to Service" },
          { key: "num_own_accord", label: "Num. That Came on Their Own" },
          { key: "num_organised_buses", label: "Num. of Organised Buses" },
          { key: "total_busing_cost", label: "Total Cost of Busing" },
          { key: "altar_call", label: "Altar Call" },
          { key: "cell_evangelism", label: "Cell Evangelism" },
          { key: "outreach", label: "Outreach" },
          { key: "num_cells_in_branch", label: "Number of Cells in Branch" },
          { key: "num_cells_bused", label: "Number of Cells That Bused to Church" },
          { key: "num_people_via_cells", label: "Num. of People Who Came Through Cells" },
          { key: "spectacular_event", label: "Spectacular Event" },
        ]
      : [
          { key: "service_date", label: "Date" },
          { key: "gathering_center", label: "Gathering Center" },
          { key: "branch_name", label: "Name of Branch" },
          { key: "pastor_name", label: "Name of Pastor" },
          { key: "pastors_count", label: "Pastors" },
          { key: "shepherds_count", label: "Shepherds" },
          { key: "members_count", label: "Members" },
          { key: "first_timers_count", label: "First Timers" },
          { key: "children_count", label: "Children" },
          { key: "teens_count", label: "Teens" },
          { key: "num_cells_in_branch", label: "Number of Cells in Branch" },
          { key: "cell_meetings_held", label: "Cell Meetings Held" },
          { key: "cell_meetings_not_held", label: "Cell Meetings Not Held" },
          { key: "offering", label: "Offering" },
          { key: "tithe", label: "Tithe" },
          { key: "partnership", label: "Partnership" },
          { key: "first_fruit", label: "First Fruit" },
          { key: "total_bus_offering", label: "Total Bus Offering" },
          { key: "preacher", label: "Preacher" },
          { key: "message_title", label: "Message Title" },
          { key: "new_members", label: "Number of New Members" },
          { key: "altar_call", label: "Altar Call" },
          { key: "cell_evangelism", label: "Cell Evangelism" },
          { key: "outreach", label: "Outreach" },
          { key: "spectacular_event", label: "Spectacular Event" },
          { key: "unheld_cells_report", label: "Report on Cells That Were Not Held" },
        ];

    const missing = [];
    for (const q of requiredQuestions) {
      const val = form[q.key];
      if (val === undefined || val === null || String(val).trim() === "") {
        missing.push(q.label);
      }
    }

    if (missing.length > 0) {
      setValidationError(
        `All questions are required. Please fill in: ${missing.slice(0, 3).join(", ")}${
          missing.length > 3 ? ` and ${missing.length - 3} other question(s)` : ""
        }.`
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);

    try {
      const saved = await saveReport({
        ...form,
        service_type: serviceType,
        total_attendance: totalAttendance,
        total_stewardship: totalFinance,
        total_souls_won: totalSoulsWon,
        submitted_by_role: profile?.role || "BRANCH_PASTOR",
        zone_name: "Central Zone",
      });

      setSubmittedReport(saved);
      setShowSuccessModal(true);
      await refreshReports();
    } catch (err) {
      console.error("Submission failed:", err);
      setValidationError(err.message || "Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getDashboardRoute = () => {
    if (profile?.role === "ZONAL_HEAD") return "/zonal";
    if (profile?.role === "EXECUTIVE") return "/executive";
    return "/pastor";
  };

  return (
    <AppShell
      unitName={form.branch_name || "Parresia"}
      title={isSunday ? "MEGA GATHERING SERVICE REPORT" : "TTLHA CELL SERVICE REPORT"}
      subtitle="Report Submission"
      rightAction={
        <button
          type="button"
          onClick={fillSampleData}
          className="text-xs text-gray-400 hover:text-gray-700 underline transition-colors cursor-pointer"
        >
          Fill sample
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-7 pt-3 max-w-xl mx-auto">
        {/* Service Type Switcher */}
        <div className="flex border border-gray-200/80 rounded-lg p-1 bg-gray-50 text-xs">
          <button
            type="button"
            onClick={() => {
              setServiceType("SUNDAY_MEGA");
              setValidationError("");
              setUndoNotice("");
            }}
            className={`flex-1 py-2 rounded-md text-center font-medium transition-all cursor-pointer ${
              isSunday
                ? "bg-white text-[#1B2A6B] font-semibold shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Mega Gathering Service (MGS)
          </button>
          <button
            type="button"
            onClick={() => {
              setServiceType("MIDWEEK_TTLHA");
              setValidationError("");
              setUndoNotice("");
            }}
            className={`flex-1 py-2 rounded-md text-center font-medium transition-all cursor-pointer ${
              !isSunday
                ? "bg-white text-[#1B2A6B] font-semibold shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            TTLHA Cell Service (Midweek)
          </button>
        </div>

        {/* Undo Success Notice */}
        {undoNotice && (
          <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/80 text-xs text-emerald-900 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-900">Attendance Submission Undone</p>
              <p className="text-emerald-800 text-[11px] leading-relaxed mt-0.5">
                {undoNotice}
              </p>
            </div>
          </div>
        )}

        {/* Validation / Error Banner */}
        {validationError && (
          <div className="p-3.5 rounded-lg border border-red-200/90 bg-red-50/80 text-xs text-red-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Incomplete Submission</p>
              <p className="text-red-800 text-[11px] leading-relaxed mt-0.5">
                {validationError}
              </p>
            </div>
          </div>
        )}

        {/* Duplicate Notice Banner with 3-Hour Undo Button */}
        {existingReport && (
          <div className="p-3.5 rounded-lg border border-amber-200/90 bg-amber-50/80 text-xs text-amber-900 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-amber-900">Report Already Submitted</p>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  A report for <strong>{form.branch_name}</strong> on <strong>{form.service_date}</strong> (
                  {isSunday ? "Mega Gathering Service" : "TTLHA Cell Service"}) has already been submitted.
                  No other submission can be done for this same service.
                </p>
                {isUndoable ? (
                  <p className="text-amber-700 text-[11px] font-medium pt-0.5">
                    Undo window active: <strong>{remainingTimeStr} remaining</strong> (expires 3 hours after submission).
                  </p>
                ) : (
                  <p className="text-gray-500 text-[11px] pt-0.5">
                    Undo window expired (submissions can only be undone within 3 hours).
                  </p>
                )}
              </div>
            </div>

            {/* Undo attendance button if within 3 hours */}
            {isUndoable && (
              <div className="pt-1 pl-6">
                <button
                  type="button"
                  onClick={() => handleUndo(existingReport.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded text-xs font-semibold hover:bg-amber-700 transition-colors cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Undo Attendance Submission
                </button>
              </div>
            )}
          </div>
        )}

        {/* SECTION 1: HEADER & SERVICE INFO (No asterisks on labels, all required) */}
        <div className="space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#1B2A6B]">
            {isSunday ? "MEGA GATHERING SERVICE REPORT" : "TTLHA CELL SERVICE"}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Date:</label>
              <input
                type="date"
                name="service_date"
                value={form.service_date}
                onChange={handleChange}
                className="w-full border-b border-gray-200 py-1.5 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Gathering Center:</label>
              <input
                type="text"
                name="gathering_center"
                value={form.gathering_center}
                onChange={handleChange}
                placeholder="Enter gathering center"
                className="w-full border-b border-gray-200 py-1.5 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Name of Branch:</label>
              <input
                type="text"
                name="branch_name"
                value={form.branch_name}
                onChange={handleChange}
                placeholder="Enter name of branch"
                className="w-full border-b border-gray-200 py-1.5 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Name of Pastor:</label>
              <input
                type="text"
                name="pastor_name"
                value={form.pastor_name}
                onChange={handleChange}
                placeholder="Enter name of pastor"
                className="w-full border-b border-gray-200 py-1.5 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: ATTENDANCE (Numbers: 3 on a line - No asterisks, all required) */}
        <div className="space-y-3.5 pt-2 border-t border-gray-100">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#1B2A6B]">
            {isSunday ? "ATTENDANCE" : "CELL ATTENDANCE"}
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Pastors -</label>
              <input
                type="number"
                name="pastors_count"
                value={form.pastors_count}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Shepherds -</label>
              <input
                type="number"
                name="shepherds_count"
                value={form.shepherds_count}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Members -</label>
              <input
                type="number"
                name="members_count"
                value={form.members_count}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs text-gray-500 mb-1">First Timers -</label>
              <input
                type="number"
                name="first_timers_count"
                value={form.first_timers_count}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Children -</label>
              <input
                type="number"
                name="children_count"
                value={form.children_count}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Teens -</label>
              <input
                type="number"
                name="teens_count"
                value={form.teens_count}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
          </div>

          {/* Total at bottom right */}
          <div className="flex justify-end pt-1">
            <span className="text-xs font-semibold text-gray-600">
              {isSunday ? "Total Attendance: " : "Total Cell Attendance: "}
              <span className="text-sm font-extrabold text-[#1B2A6B]">{totalAttendance}</span>
            </span>
          </div>
        </div>

        {/* SECTION 3: CELL SYSTEM REPORT (FOR TTLHA CELL SERVICE - 3 on a line) */}
        {!isSunday && (
          <div className="space-y-3.5 pt-2 border-t border-gray-100">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#1B2A6B]">
              CELL SYSTEM REPORT
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Number of Cells in Branch -
                </label>
                <input
                  type="number"
                  name="num_cells_in_branch"
                  value={form.num_cells_in_branch}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Cell Meetings Held -
                </label>
                <input
                  type="number"
                  name="cell_meetings_held"
                  value={form.cell_meetings_held}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Cell Meetings Not Held -
                </label>
                <input
                  type="number"
                  name="cell_meetings_not_held"
                  value={form.cell_meetings_not_held}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: FINANCE (Numbers: 2 on a line - No asterisks, all required) */}
        <div className="space-y-3.5 pt-2 border-t border-gray-100">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#1B2A6B]">
            FINANCE
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Offering - GHC</label>
              <input
                type="number"
                step="0.01"
                name="offering"
                value={form.offering}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tithe - GHC</label>
              <input
                type="number"
                step="0.01"
                name="tithe"
                value={form.tithe}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Partnership - GHC</label>
              <input
                type="number"
                step="0.01"
                name="partnership"
                value={form.partnership}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">First Fruit - GHC</label>
              <input
                type="number"
                step="0.01"
                name="first_fruit"
                value={form.first_fruit}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
          </div>

          {/* TOTAL BUS OFFERING (TTLHA Midweek) */}
          {!isSunday && (
            <div className="pt-1 max-w-sm">
              <label className="block text-xs text-gray-500 mb-1">Total Bus Offering - GHC</label>
              <input
                type="number"
                step="0.01"
                name="total_bus_offering"
                value={form.total_bus_offering}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
          )}

          {/* Total at bottom right */}
          <div className="flex justify-end pt-1">
            <span className="text-xs font-semibold text-gray-600">
              Total: GHC <span className="text-sm font-extrabold text-[#1B2A6B]">{totalFinance.toFixed(2)}</span>
            </span>
          </div>
        </div>

        {/* SECTION 5: PREACHER & MESSAGE (Text inputs: 1 question to a line - No asterisks, all required) */}
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Preacher: -</label>
            <input
              type="text"
              name="preacher"
              value={form.preacher}
              onChange={handleChange}
              placeholder="Enter name of preacher"
              className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Message Title: -</label>
            <input
              type="text"
              name="message_title"
              value={form.message_title}
              onChange={handleChange}
              placeholder="Enter title of message"
              className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
              required
            />
          </div>

          <div className="max-w-sm">
            <label className="block text-xs text-gray-500 mb-1">Number of New Members -</label>
            <input
              type="number"
              name="new_members"
              value={form.new_members}
              onChange={handleChange}
              placeholder="0"
              className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
              required
            />
          </div>
        </div>

        {/* SECTION 6: BUSING (MGS only - Exactly 2 questions on a line - No asterisks, all required) */}
        {isSunday && (
          <div className="space-y-3.5 pt-2 border-t border-gray-100">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#1B2A6B]">
              BUSING
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Num. of People Bused to Service -
                </label>
                <input
                  type="number"
                  name="num_bused"
                  value={form.num_bused}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Num. That Came on Their Own -
                </label>
                <input
                  type="number"
                  name="num_own_accord"
                  value={form.num_own_accord}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Num. of Organised Buses -
                </label>
                <input
                  type="number"
                  name="num_organised_buses"
                  value={form.num_organised_buses}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Total Cost of Busing - GHC
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="total_busing_cost"
                  value={form.total_busing_cost}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 7: SOUL WINNING REPORT (Numbers: 3 on a line - No asterisks, all required) */}
        <div className="space-y-3.5 pt-2 border-t border-gray-100">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#1B2A6B]">
            SOUL WINNING REPORT
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Altar Call -</label>
              <input
                type="number"
                name="altar_call"
                value={form.altar_call}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Cell Evangelism -</label>
              <input
                type="number"
                name="cell_evangelism"
                value={form.cell_evangelism}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Outreach -</label>
              <input
                type="number"
                name="outreach"
                value={form.outreach}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
          </div>

          {/* Total at bottom right */}
          <div className="flex justify-end pt-1">
            <span className="text-xs font-semibold text-gray-600">
              {isSunday ? "Total Souls Won After Midweek: " : "Total Souls Won Within The Week: "}
              <span className="text-sm font-extrabold text-[#1B2A6B]">{totalSoulsWon}</span>
            </span>
          </div>
        </div>

        {/* SECTION 8: CELL SYSTEM REPORT (FOR MEGA GATHERING ONLY - 3 on a line) */}
        {isSunday && (
          <div className="space-y-3.5 pt-2 border-t border-gray-100">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#1B2A6B]">
              CELL SYSTEM REPORT
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Number of Cells in Branch -
                </label>
                <input
                  type="number"
                  name="num_cells_in_branch"
                  value={form.num_cells_in_branch}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Number of Cells That Bused to Church -
                </label>
                <input
                  type="number"
                  name="num_cells_bused"
                  value={form.num_cells_bused}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Num. of People Who Came Through Cells -
                </label>
                <input
                  type="number"
                  name="num_people_via_cells"
                  value={form.num_people_via_cells}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 9: SPECTACULAR EVENT (Text area: 1 question to a line) */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1B2A6B] mb-1">
            SPECTACULAR EVENT:
          </label>
          <textarea
            name="spectacular_event"
            rows={2}
            value={form.spectacular_event}
            onChange={handleChange}
            placeholder="Record any testimonies, miraculous signs, or spectacular events..."
            className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent resize-none"
            required
          />
        </div>

        {/* SECTION 10: REPORT ON CELLS THAT WERE NOT HELD (TTLHA Midweek: 1 question to a line) */}
        {!isSunday && (
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1B2A6B] mb-1">
              REPORT ON CELLS THAT WERE NOT HELD:
            </label>
            <textarea
              name="unheld_cells_report"
              rows={2}
              value={form.unheld_cells_report}
              onChange={handleChange}
              placeholder="State which cells did not hold meetings and provide details / reasons..."
              className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent resize-none"
              required
            />
          </div>
        )}

        {/* SECTION 11: SERMON AUDIO UPLOAD (MGS only) */}
        {isSunday && (
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#1B2A6B]">
              SERMON AUDIO
            </p>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Upload Your Sermon Audio (MP3, M4A, WAV, AAC)
              </label>
              <input
                type="file"
                accept=".mp3,.m4a,.wav,.aac,audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    setForm((prev) => ({
                      ...prev,
                      sermon_audio_name: file.name,
                      sermon_audio_data: ev.target.result,
                    }));
                  };
                  reader.readAsDataURL(file);
                }}
                className="block w-full text-xs text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-[#1B2A6B]/5 file:text-[#1B2A6B] hover:file:bg-[#1B2A6B]/10 cursor-pointer"
              />
              {form.sermon_audio_data && (
                <div className="mt-2 space-y-1">
                  <p className="text-[10px] text-gray-400">Preview: {form.sermon_audio_name}</p>
                  <audio controls src={form.sermon_audio_data} className="w-full" style={{ height: "32px" }} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 12: GOOGLE PHOTOS LINK (MGS only) */}
        {isSunday && (
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1B2A6B] mb-1">
              SERVICE PHOTOS
            </label>
            <input
              type="url"
              name="google_photos_url"
              value={form.google_photos_url}
              onChange={handleChange}
              placeholder="Paste Google Photos share link (https://photos.app.goo.gl/...)"
              className="w-full border-b border-gray-200 py-1 text-xs text-gray-900 outline-none focus:border-[#1B2A6B] bg-transparent"
            />
            {form.google_photos_url && (
              <a
                href={form.google_photos_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[#1B2A6B] font-medium hover:underline"
              >
                📷 Preview Photos Link
              </a>
            )}
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <div className="pt-4 pb-2">
          <button
            type="submit"
            disabled={submitting || !!existingReport}
            className="w-full py-3 px-4 bg-[#1B2A6B] text-white text-xs font-semibold rounded-lg hover:bg-[#152152] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
          >
            {submitting
              ? "Submitting Report..."
              : existingReport
              ? "Report Already Submitted for This Date"
              : isSunday
              ? "Submit Mega Gathering Service Report"
              : "Submit TTLHA Cell Service Report"}
          </button>
        </div>
      </form>

      {/* MINIMALISTIC SUBMISSION SUCCESS MODAL WITH UNDO BUTTON */}
      {showSuccessModal && submittedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl p-6 sm:p-7 max-w-sm w-full mx-auto text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-gray-900 tracking-tight">
                Report Submitted Successfully
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                The <span className="font-semibold text-gray-800">{submittedReport.service_type === "SUNDAY_MEGA" ? "Mega Gathering Service" : "TTLHA Cell Service"}</span> report for <span className="font-semibold text-gray-800">{submittedReport.branch_name}</span> on <span className="font-semibold text-gray-800">{submittedReport.service_date}</span> has been securely recorded and synced to leadership portals.
              </p>
            </div>

            {/* Quick Metrics Recap */}
            <div className="border border-gray-100 rounded-xl bg-gray-50/80 p-3 grid grid-cols-3 divide-x divide-gray-200/60 text-center">
              <div className="px-1">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Attendance</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{submittedReport.total_attendance}</p>
              </div>
              <div className="px-1">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Stewardship</p>
                <p className="text-xs font-bold text-gray-900 mt-0.5 truncate">
                  GH₵ {Number(submittedReport.total_stewardship || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="px-1">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Souls Won</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{submittedReport.total_souls_won}</p>
              </div>
            </div>

            {/* Modal Actions including Undo Button */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate(getDashboardRoute());
                }}
                className="w-full py-2.5 px-4 bg-[#1B2A6B] text-white text-xs font-semibold rounded-lg hover:bg-[#152152] transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>View Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleUndo(submittedReport.id)}
                className="w-full py-2.5 px-4 border border-amber-200 text-amber-800 bg-amber-50/60 hover:bg-amber-100/80 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                <span>Undo Attendance Submission</span>
              </button>

              <p className="text-[10px] text-gray-400 text-center">
                Undo expires 3 hours after submission
              </p>

              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-2 px-4 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
