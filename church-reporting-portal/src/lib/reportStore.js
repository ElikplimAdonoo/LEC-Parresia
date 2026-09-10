import { supabase } from "./supabase";

const STORAGE_KEY = "lec_service_reports_store_v2";

const DEFAULT_REPORTS = [
  {
    id: "rep-default-parresia-1",
    branch_name: "Parresia",
    pastor_name: "Rev. Makafui Tetteh Kumahlor",
    service_type: "SUNDAY_MEGA",
    service_date: new Date().toISOString().split("T")[0],
    gathering_center: "LC Live Center",
    total_attendance: 184,
    total_stewardship: 5250.0,
    new_converts: 6,
    first_timers: 9,
    sermon_title: "The Parresia of Faith",
    preacher: "Bishop Daddy",
    notes: "Supernatural gathering, glorious praise, and mighty testimonies.",
    zone_name: "Central Zone",
    status: "SUBMITTED",
    created_at: new Date().toISOString(),
  },
];

export const getStoredReports = async () => {
  // 1. Try reading from Supabase for live cross-domain/cross-device sync
  try {
    const { data, error } = await supabase
      .from("service_reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      // Map supabase rows to app format
      const mapped = data.map((r) => ({
        id: r.id,
        branch_name: r.raw_data?.branch_name || "Parresia",
        pastor_name: r.raw_data?.pastor_name || "Rev. Makafui Tetteh Kumahlor",
        service_type: r.service_type === "SUNDAY" ? "SUNDAY_MEGA" : "MIDWEEK_TTLHA",
        service_date: r.report_date,
        gathering_center: r.raw_data?.gathering_center || "LC Live Center",
        total_attendance: r.total_attendance || 0,
        total_stewardship: r.total_finance || 0,
        new_converts: r.raw_data?.new_converts || 0,
        first_timers: r.raw_data?.first_timers || 0,
        sermon_title: r.message_title || "",
        preacher: r.preacher || "",
        notes: r.spectacular_notes || "",
        zone_name: "Central Zone",
        status: "SUBMITTED",
        created_at: r.created_at || new Date().toISOString(),
      }));

      // Cache locally
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
      return mapped;
    }
  } catch (err) {
    console.warn("Cloud read fallback to local cache:", err);
  }

  // 2. Fallback to LocalStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.length > 0) return parsed;
    }
    // Seed default if empty so live dashboards always show active Parresia submissions
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_REPORTS));
    return DEFAULT_REPORTS;
  } catch {
    return DEFAULT_REPORTS;
  }
};

export const saveReport = async (reportData) => {
  const newReport = {
    id: "rep-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    ...reportData,
    created_at: new Date().toISOString(),
    status: "SUBMITTED",
  };

  // 1. Immediately update LocalStorage cache
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const current = raw ? JSON.parse(raw) : DEFAULT_REPORTS;
    const updated = [newReport, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("LocalStorage save failed:", e);
  }

  // 2. Sync to Supabase so it appears across all devices and URLs (localhost and https)
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
        raw_data: reportData,
      },
    ]);
  } catch (err) {
    console.warn("Supabase background sync:", err);
  }

  return newReport;
};
