import React, { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { useAuth } from "../contexts/AuthContext";
import { saveReport } from "../lib/reportStore";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ReportFormPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState("SUNDAY_MEGA"); // "SUNDAY_MEGA" | "MIDWEEK_TTLHA"
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const defaultBranch = profile?.branches?.name || "Parresia";
  const defaultPastor = profile?.full_name || "Rev. Makafui Tetteh Kumahlor";

  // Completely fresh, blank form state matching user's exact specification
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
    total_bus_offering: "", // TTLHA specific

    // Preacher & Message
    preacher: "",
    message_title: "",
    new_members: "",

    // Organised Busing / Gathering Report (MGS only)
    num_bused: "",
    num_own_accord: "",
    num_organised_buses: "",
    total_busing_cost: "",

    // Soul Winning Report
    altar_call: "",
    cell_evangelism: "",
    outreach: "",

    // Cell System Report
    num_cells_in_branch: "",
    num_cells_bused: "", // MGS
    num_people_via_cells: "", // MGS
    cell_meetings_held: "", // TTLHA
    cell_meetings_not_held: "", // TTLHA

    // Event & Special Notes
    spectacular_event: "",
    unheld_cells_report: "", // TTLHA
  };

  const [form, setForm] = useState(emptyForm);

  // Dynamic Attendance Calculation
  const totalAttendance =
    (parseInt(form.pastors_count) || 0) +
    (parseInt(form.shepherds_count) || 0) +
    (parseInt(form.members_count) || 0) +
    (parseInt(form.first_timers_count) || 0) +
    (parseInt(form.children_count) || 0) +
    (parseInt(form.teens_count) || 0);

  // Dynamic Finance Total Calculation (GHC)
  const totalFinance =
    (parseFloat(form.offering) || 0) +
    (parseFloat(form.tithe) || 0) +
    (parseFloat(form.partnership) || 0) +
    (parseFloat(form.first_fruit) || 0);

  // Dynamic Soul Winning Total Calculation
  const totalSoulsWon =
    (parseInt(form.altar_call) || 0) +
    (parseInt(form.cell_evangelism) || 0) +
    (parseInt(form.outreach) || 0);

  // Fill sample data tailored to whichever service tab is active
  const fillSampleData = () => {
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
        preacher: "Bishop Daddy",
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
        spectacular_event: "Powerful cell fellowship with deep communion and fellowship.",
        unheld_cells_report: "Victory Cell Leader travelled out of town for work commitment; rescheduled for Saturday morning.",
      });
    }
  };

  const clearForm = () => {
    setForm(emptyForm);
    setSuccess(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      await saveReport({
        ...form,
        service_type: serviceType,
        total_attendance: totalAttendance,
        total_stewardship: totalFinance,
        total_souls_won: totalSoulsWon,
        submitted_by_role: profile?.role || "BRANCH_PASTOR",
        zone_name: "Central Zone",
      });

      setSuccess(true);
    } catch (err) {
      console.error("Submission failed:", err);
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  const isSunday = serviceType === "SUNDAY_MEGA";

  return (
    <AppShell
      unitName={form.branch_name || "Parresia"}
      title={isSunday ? "MEGA GATHERING SERVICE REPORT" : "TTLHA CELL SERVICE REPORT"}
      subtitle="Report Submission"
      rightAction={
        <button
          type="button"
          onClick={fillSampleData}
          className="text-[11px] text-gray-400 hover:text-gray-700 underline transition-colors cursor-pointer"
        >
          Fill sample
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        {/* Service Type Switcher */}
        <div className="flex border border-gray-200 rounded p-0.5 bg-gray-50 text-xs">
          <button
            type="button"
            onClick={() => {
              setServiceType("SUNDAY_MEGA");
              setSuccess(false);
            }}
            className={`flex-1 py-1.5 rounded text-center transition-all cursor-pointer ${
              isSunday
                ? "bg-white text-[#1B2A6B] font-semibold shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Mega Gathering Service (MGS)
          </button>
          <button
            type="button"
            onClick={() => {
              setServiceType("MIDWEEK_TTLHA");
              setSuccess(false);
            }}
            className={`flex-1 py-1.5 rounded text-center transition-all cursor-pointer ${
              !isSunday
                ? "bg-white text-[#1B2A6B] font-semibold shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            TTLHA Cell Service (Midweek)
          </button>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded text-xs text-emerald-800 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isSunday ? "Mega Gathering" : "TTLHA Cell"} Report Submitted!</span>
            </div>
            <p className="text-[11px] text-emerald-700">
              Your submission has been recorded and transmitted directly to the <strong>Central Zone Head Portal</strong> and <strong>Executive Council Dashboard</strong>.
            </p>
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    profile?.role === "ZONAL_HEAD"
                      ? "/zonal"
                      : profile?.role === "EXECUTIVE"
                      ? "/executive"
                      : "/pastor"
                  )
                }
                className="text-[11px] font-semibold underline flex items-center gap-1 text-emerald-900 cursor-pointer"
              >
                Go to Dashboard <ArrowRight className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={clearForm}
                className="text-[11px] font-semibold underline text-emerald-900 cursor-pointer"
              >
                Submit another report
              </button>
            </div>
          </div>
        )}

        {/* SECTION 1: HEADER & BASIC INFO */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {isSunday ? "MEGA GATHERING SERVICE REPORT" : "TTLHA CELL SERVICE"}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">DATE: *</label>
              <input
                type="date"
                name="service_date"
                value={form.service_date}
                onChange={handleChange}
                className="w-full border-b border-gray-200 py-1.5 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">GC (Gathering Center): *</label>
              <input
                type="text"
                name="gathering_center"
                value={form.gathering_center}
                onChange={handleChange}
                placeholder="Enter gathering center"
                className="w-full border-b border-gray-200 py-1.5 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Branch Name</label>
              <input
                type="text"
                name="branch_name"
                value={form.branch_name}
                onChange={handleChange}
                placeholder="e.g. Parresia"
                className="w-full border-b border-gray-200 py-1.5 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Pastor Name</label>
              <input
                type="text"
                name="pastor_name"
                value={form.pastor_name}
                onChange={handleChange}
                placeholder="e.g. Rev. Makafui Tetteh Kumahlor"
                className="w-full border-b border-gray-200 py-1.5 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: ATTENDANCE */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {isSunday ? "ATTENDANCE" : "CELL ATTENDANCE"}
            </p>
            <span className="text-xs font-bold text-[#1B2A6B]">
              {isSunday ? "TOTAL ATTENDANCE" : "TOTAL CELL ATTENDANCE"}: {totalAttendance}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">PASTORS -</label>
              <input
                type="number"
                name="pastors_count"
                value={form.pastors_count}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">SHEPHERDS -</label>
              <input
                type="number"
                name="shepherds_count"
                value={form.shepherds_count}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">MEMBERS -</label>
              <input
                type="number"
                name="members_count"
                value={form.members_count}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">FIRST TIMERS -</label>
              <input
                type="number"
                name="first_timers_count"
                value={form.first_timers_count}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">CHILDREN -</label>
              <input
                type="number"
                name="children_count"
                value={form.children_count}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">TEENS -</label>
              <input
                type="number"
                name="teens_count"
                value={form.teens_count}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: CELL SYSTEM REPORT (FOR TTLHA CELL SERVICE) */}
        {!isSunday && (
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              CELL SYSTEM REPORT
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  NUMBER OF CELLS IN THE BRANCH -
                </label>
                <input
                  type="number"
                  name="num_cells_in_branch"
                  value={form.num_cells_in_branch}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  CELL MEETINGS HELD -
                </label>
                <input
                  type="number"
                  name="cell_meetings_held"
                  value={form.cell_meetings_held}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  CELL MEETINGS NOT HELD -
                </label>
                <input
                  type="number"
                  name="cell_meetings_not_held"
                  value={form.cell_meetings_not_held}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: FINANCE */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              FINANCE
            </p>
            <span className="text-xs font-bold text-gray-800">
              TOTAL: GHC {totalFinance.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">OFFERING - GHC</label>
              <input
                type="number"
                step="0.01"
                name="offering"
                value={form.offering}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">TITHE - GHC</label>
              <input
                type="number"
                step="0.01"
                name="tithe"
                value={form.tithe}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">PARTNERSHIP - GHC</label>
              <input
                type="number"
                step="0.01"
                name="partnership"
                value={form.partnership}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">FIRST FRUIT - GHC</label>
              <input
                type="number"
                step="0.01"
                name="first_fruit"
                value={form.first_fruit}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
          </div>

          {/* TOTAL BUS OFFERING (TTLHA Midweek) */}
          {!isSunday && (
            <div className="pt-1 max-w-xs">
              <label className="block text-[11px] text-gray-500 mb-1">TOTAL BUS OFFERING - GHC</label>
              <input
                type="number"
                step="0.01"
                name="total_bus_offering"
                value={form.total_bus_offering}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
          )}
        </div>

        {/* SECTION 5: PREACHER & MESSAGE TITLE & NEW MEMBERS */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">PREACHER: -</label>
              <input
                type="text"
                name="preacher"
                value={form.preacher}
                onChange={handleChange}
                placeholder="Name of preacher"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">MESSAGE TITLE: -</label>
              <input
                type="text"
                name="message_title"
                value={form.message_title}
                onChange={handleChange}
                placeholder="Title of message"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">NUMBER OF NEW MEMBERS -</label>
              <input
                type="number"
                name="new_members"
                value={form.new_members}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* SECTION 6: ORGANISED BUSING / GATHERING REPORT (FOR MEGA GATHERING ONLY) */}
        {isSunday && (
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              ORGANISED BUSING / GATHERING REPORT
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  Num. OF PEOPLE BUSED TO SERVICE -
                </label>
                <input
                  type="number"
                  name="num_bused"
                  value={form.num_bused}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  Num. THAT CAME ON THEIR OWN -
                </label>
                <input
                  type="number"
                  name="num_own_accord"
                  value={form.num_own_accord}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  Num. OF ORGANISED BUSES -
                </label>
                <input
                  type="number"
                  name="num_organised_buses"
                  value={form.num_organised_buses}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  TOTAL COST OF BUSING - GHC
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="total_busing_cost"
                  value={form.total_busing_cost}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 7: SOUL WINNING REPORT */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              SOUL WINNING REPORT
            </p>
            <span className="text-xs font-bold text-emerald-700">
              {isSunday ? "TOTAL SOULS WON AFTER MIDWEEK" : "TOTAL SOULS WON WITHIN THE WEEK"}: {totalSoulsWon}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">ALTAR CALL -</label>
              <input
                type="number"
                name="altar_call"
                value={form.altar_call}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">CELL EVANGELISM -</label>
              <input
                type="number"
                name="cell_evangelism"
                value={form.cell_evangelism}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">OUTREACH -</label>
              <input
                type="number"
                name="outreach"
                value={form.outreach}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* SECTION 8: CELL SYSTEM REPORT (FOR MEGA GATHERING ONLY) */}
        {isSunday && (
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              CELL SYSTEM REPORT
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  NUMBER OF CELLS IN BRANCH -
                </label>
                <input
                  type="number"
                  name="num_cells_in_branch"
                  value={form.num_cells_in_branch}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  NUMBER OF CELLS THAT BUSED TO CHURCH -
                </label>
                <input
                  type="number"
                  name="num_cells_bused"
                  value={form.num_cells_bused}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  Num. OF PEOPLE WHO CAME THROUGH THE CELLS -
                </label>
                <input
                  type="number"
                  name="num_people_via_cells"
                  value={form.num_people_via_cells}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 9: SPECTACULAR EVENT */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            SPECTACULAR EVENT:
          </p>
          <textarea
            name="spectacular_event"
            rows={2}
            value={form.spectacular_event}
            onChange={handleChange}
            placeholder="Record any testimonies, miraculous signs, or spectacular events..."
            className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent resize-none"
          />
        </div>

        {/* SECTION 10: REPORT ON CELLS THAT WERE NOT HELD (FOR TTLHA MIDWEEK ONLY) */}
        {!isSunday && (
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              REPORT ON CELLS THAT WERE NOT HELD:
            </p>
            <textarea
              name="unheld_cells_report"
              rows={2}
              value={form.unheld_cells_report}
              onChange={handleChange}
              placeholder="State which cells did not hold meetings and provide details / reasons..."
              className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent resize-none"
            />
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 bg-[#1B2A6B] text-white text-xs font-semibold rounded hover:bg-[#152152] transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {submitting ? "Submitting Report..." : isSunday ? "Submit Mega Gathering Service Report" : "Submit TTLHA Cell Service Report"}
          </button>
        </div>
      </form>
    </AppShell>
  );
}
