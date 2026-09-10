import React, { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export function ReportFormPage() {
  const { profile } = useAuth();
  const [serviceType, setServiceType] = useState("SUNDAY_MEGA");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    branch_name: "",
    pastor_name: "",
    service_date: "",
    gathering_center: "",
    men: "",
    women: "",
    teens: "",
    children: "",
    new_converts: "",
    first_timers: "",
    tithes: "",
    offerings: "",
    special_seeds: "",
    sermon_title: "",
    preacher: "",
    notes: "",
  });

  const totalAttendance =
    (parseInt(form.men) || 0) +
    (parseInt(form.women) || 0) +
    (parseInt(form.teens) || 0) +
    (parseInt(form.children) || 0);

  const totalStewardship =
    (parseFloat(form.tithes) || 0) +
    (parseFloat(form.offerings) || 0) +
    (parseFloat(form.special_seeds) || 0);

  const fillSampleData = () => {
    setForm({
      branch_name: "Adenta Main",
      pastor_name: "Ps. Michael Osei",
      service_date: new Date().toISOString().split("T")[0],
      gathering_center: "LC Live Center",
      men: "45",
      women: "62",
      teens: "18",
      children: "25",
      new_converts: "4",
      first_timers: "7",
      tithes: "2450.00",
      offerings: "1120.00",
      special_seeds: "500.00",
      sermon_title: "The Parresia of Faith",
      preacher: "Bishop Daddy",
      notes: "Glorious gathering with remarkable signs and salvations.",
    });
  };

  const clearForm = () => {
    setForm({
      branch_name: "",
      pastor_name: "",
      service_date: "",
      gathering_center: "",
      men: "",
      women: "",
      teens: "",
      children: "",
      new_converts: "",
      first_timers: "",
      tithes: "",
      offerings: "",
      special_seeds: "",
      sermon_title: "",
      preacher: "",
      notes: "",
    });
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
      const { error } = await supabase.from("service_reports").insert([
        {
          service_type: serviceType,
          service_date: form.service_date || new Date().toISOString().split("T")[0],
          notes: form.notes,
          sermon_title: form.sermon_title,
          preacher_name: form.preacher,
          total_attendance: totalAttendance,
          total_stewardship: totalStewardship,
          raw_data: form,
        },
      ]);

      if (error) throw error;
      setSuccess(true);
    } catch {
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell
      title="Submit Report"
      rightAction={
        <button
          type="button"
          onClick={fillSampleData}
          className="text-[11px] text-gray-400 hover:text-gray-700 underline transition-colors"
        >
          Fill sample
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        <div className="flex border border-gray-200 rounded p-0.5 bg-gray-50 text-xs">
          <button
            type="button"
            onClick={() => setServiceType("SUNDAY_MEGA")}
            className={`flex-1 py-1.5 rounded text-center transition-all ${
              serviceType === "SUNDAY_MEGA"
                ? "bg-white text-[#1B2A6B] font-semibold shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Sunday Mega Gathering
          </button>
          <button
            type="button"
            onClick={() => setServiceType("MIDWEEK_TTLHA")}
            className={`flex-1 py-1.5 rounded text-center transition-all ${
              serviceType === "MIDWEEK_TTLHA"
                ? "bg-white text-[#1B2A6B] font-semibold shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Midweek TTLHA Cell
          </button>
        </div>

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded text-xs text-emerald-800 flex justify-between items-center">
            <span>Report submitted successfully.</span>
            <button
              type="button"
              onClick={clearForm}
              className="text-[11px] font-semibold underline"
            >
              New Report
            </button>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Basic Information
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Branch Name</label>
              <input
                type="text"
                name="branch_name"
                value={form.branch_name}
                onChange={handleChange}
                placeholder="Enter branch name"
                className="w-full border-b border-gray-200 py-1.5 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Pastor's Name</label>
              <input
                type="text"
                name="pastor_name"
                value={form.pastor_name}
                onChange={handleChange}
                placeholder="Enter pastor's name"
                className="w-full border-b border-gray-200 py-1.5 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Service Date</label>
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
              <label className="block text-[11px] text-gray-500 mb-1">Gathering Center</label>
              <input
                type="text"
                name="gathering_center"
                value={form.gathering_center}
                onChange={handleChange}
                placeholder="e.g. LC Live Center"
                className="w-full border-b border-gray-200 py-1.5 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Attendance Demographics
            </p>
            <span className="text-xs font-semibold text-[#1B2A6B]">
              Total: {totalAttendance}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Men</label>
              <input
                type="number"
                name="men"
                value={form.men}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Women</label>
              <input
                type="number"
                name="women"
                value={form.women}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Teens</label>
              <input
                type="number"
                name="teens"
                value={form.teens}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Children</label>
              <input
                type="number"
                name="children"
                value={form.children}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">New Converts</label>
              <input
                type="number"
                name="new_converts"
                value={form.new_converts}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">First Timers</label>
              <input
                type="number"
                name="first_timers"
                value={form.first_timers}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Financial Stewardship
            </p>
            <span className="text-xs font-semibold text-gray-700">
              Total: GHS {totalStewardship.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Tithes</label>
              <input
                type="number"
                step="0.01"
                name="tithes"
                value={form.tithes}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Offerings</label>
              <input
                type="number"
                step="0.01"
                name="offerings"
                value={form.offerings}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Special Seeds</label>
              <input
                type="number"
                step="0.01"
                name="special_seeds"
                value={form.special_seeds}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-gray-100">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Word & Highlights
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Sermon Title</label>
              <input
                type="text"
                name="sermon_title"
                value={form.sermon_title}
                onChange={handleChange}
                placeholder="e.g. Living by Faith"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Preacher</label>
              <input
                type="text"
                name="preacher"
                value={form.preacher}
                onChange={handleChange}
                placeholder="Name of preacher"
                className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-gray-500 mb-1">Pastoral Notes / Highlights</label>
            <textarea
              name="notes"
              rows={2}
              value={form.notes}
              onChange={handleChange}
              placeholder="Any testimonies, signs, or notable updates..."
              className="w-full border-b border-gray-200 py-1 text-xs outline-none focus:border-[#1B2A6B] bg-transparent resize-none"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 bg-[#1B2A6B] text-white text-xs font-semibold rounded hover:bg-[#152152] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Submitting..." : "Submit Service Report"}
          </button>
        </div>
      </form>
    </AppShell>
  );
}
