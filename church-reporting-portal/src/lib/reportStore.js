import { supabase } from "./supabase";

const STORAGE_KEY = "lec_service_reports_store";

export const getStoredReports = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveReport = async (reportData) => {
  const newReport = {
    id: "rep-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    ...reportData,
    created_at: new Date().toISOString(),
    status: "SUBMITTED",
  };

  // 1. Save locally so it reflects immediately across Pastor, Zonal Head, and Council
  try {
    const current = getStoredReports();
    const updated = [newReport, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("LocalStorage save failed:", e);
  }

  // 2. Also try writing to Supabase
  try {
    await supabase.from("service_reports").insert([
      {
        service_type: reportData.service_type === "SUNDAY_MEGA" ? "SUNDAY" : "MIDWEEK",
        report_date: reportData.service_date || new Date().toISOString().split("T")[0],
        message_title: reportData.sermon_title || "",
        preacher: reportData.preacher || "",
        total_attendance: reportData.total_attendance || 0,
        total_finance: reportData.total_stewardship || 0,
        spectacular_notes: reportData.notes || "",
        status: "SUBMITTED",
      },
    ]);
  } catch (err) {
    console.warn("Supabase background sync:", err);
  }

  return newReport;
};
