import { supabase } from "./supabase";

const STORAGE_KEY = "lec_service_reports_store_v3";

const DEFAULT_REPORTS = [
  {
    id: "rep-default-parresia-1",
    branch_name: "Parresia",
    pastor_name: "Rev. Makafui Tetteh Kumahlor",
    service_type: "SUNDAY_MEGA",
    service_date: "2026-09-13",
    gathering_center: "LC Live Center",
    
    // Attendance
    pastors_count: 2,
    shepherds_count: 14,
    members_count: 110,
    first_timers_count: 12,
    children_count: 26,
    teens_count: 20,
    total_attendance: 184,

    // Finance (GHC)
    offering: 1450.0,
    tithe: 2500.0,
    partnership: 800.0,
    first_fruit: 500.0,
    total_stewardship: 5250.0,

    // Preacher & Message
    preacher: "Bishop Isaac Oti-Boateng",
    message_title: "The Parresia of Faith",
    new_members: 8,

    // Organised Busing / Gathering Report (Sunday)
    num_bused: 65,
    num_own_accord: 119,
    num_organised_buses: 3,
    total_busing_cost: 450.0,

    // Soul Winning Report
    altar_call: 9,
    cell_evangelism: 14,
    outreach: 22,
    total_souls_won: 45,

    // Cell System Report (Sunday)
    num_cells_in_branch: 12,
    num_cells_bused: 10,
    num_people_via_cells: 72,

    spectacular_event: "Mighty outpouring of the Spirit with testimonies of healing and breakthrough.",
    
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
      const mapped = data.map((r) => {
        const raw = r.raw_data || {};
        return {
          id: r.id,
          branch_name: raw.branch_name || "Parresia",
          pastor_name: raw.pastor_name || "Rev. Makafui Tetteh Kumahlor",
          service_type: r.service_type === "SUNDAY" ? "SUNDAY_MEGA" : "MIDWEEK_TTLHA",
          service_date: r.report_date || raw.service_date,
          gathering_center: raw.gathering_center || "LC Live Center",
          
          // Attendance
          pastors_count: raw.pastors_count || r.pastors_count || 0,
          shepherds_count: raw.shepherds_count || r.shepherds_count || 0,
          members_count: raw.members_count || r.members_count || 0,
          first_timers_count: raw.first_timers_count || r.first_timers_count || 0,
          children_count: raw.children_count || r.children_count || 0,
          teens_count: raw.teens_count || r.teens_count || 0,
          total_attendance: r.total_attendance || raw.total_attendance || 0,

          // Finance
          offering: raw.offering || r.offering || 0,
          tithe: raw.tithe || r.tithe || 0,
          partnership: raw.partnership || r.partnership || 0,
          first_fruit: raw.first_fruit || r.first_fruit || 0,
          total_stewardship: r.total_finance || raw.total_stewardship || 0,
          total_bus_offering: raw.total_bus_offering || r.bus_offering || 0,

          // Preacher & Message
          preacher: r.preacher || raw.preacher || "",
          message_title: r.message_title || raw.message_title || "",
          new_members: r.new_members || raw.new_members || 0,

          // Sunday Busing
          num_bused: raw.num_bused || r.num_bused || 0,
          num_own_accord: raw.num_own_accord || r.num_own_accord || 0,
          num_organised_buses: raw.num_organised_buses || r.num_organised_buses || 0,
          total_busing_cost: raw.total_busing_cost || r.total_busing_cost || 0,

          // Soul Winning
          altar_call: raw.altar_call || r.altar_call || 0,
          cell_evangelism: raw.cell_evangelism || r.cell_evangelism || 0,
          outreach: raw.outreach || r.outreach || 0,
          total_souls_won: raw.total_souls_won || r.total_souls_won || 0,

          // Cell System
          num_cells_in_branch: raw.num_cells_in_branch || r.cells_in_branch || 0,
          num_cells_bused: raw.num_cells_bused || r.cells_bused_to_church || 0,
          num_people_via_cells: raw.num_people_via_cells || r.people_via_cells || 0,
          cell_meetings_held: raw.cell_meetings_held || r.cell_meetings_held || 0,
          cell_meetings_not_held: raw.cell_meetings_not_held || r.cell_meetings_not_held || 0,
          unheld_cells_report: raw.unheld_cells_report || r.unheld_cells_report || "",

          spectacular_event: raw.spectacular_event || r.spectacular_notes || "",
          
          zone_name: "Central Zone",
          status: "SUBMITTED",
          created_at: r.created_at || new Date().toISOString(),
        };
      });

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_REPORTS));
    return DEFAULT_REPORTS;
  } catch {
    return DEFAULT_REPORTS;
  }
};

export const checkDuplicateReport = (branchName, serviceDate, serviceType, reportsList = null) => {
  if (!branchName || !serviceDate || !serviceType) return null;
  const list = reportsList || (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_REPORTS;
    } catch {
      return DEFAULT_REPORTS;
    }
  })();

  const b = branchName.trim().toLowerCase();
  const d = serviceDate.trim();
  const t = serviceType.trim();

  return (
    list.find(
      (r) =>
        (r.branch_name || "").trim().toLowerCase() === b &&
        (r.service_date || "").trim() === d &&
        (r.service_type || "").trim() === t
    ) || null
  );
};

export const saveReport = async (reportData) => {
  // Check if report for this branch, date and service type was already submitted
  const raw = localStorage.getItem(STORAGE_KEY);
  const current = raw ? JSON.parse(raw) : DEFAULT_REPORTS;

  const duplicate = checkDuplicateReport(
    reportData.branch_name,
    reportData.service_date,
    reportData.service_type,
    current
  );

  if (duplicate) {
    throw new Error(
      `A report for ${reportData.branch_name} on ${reportData.service_date} (${
        reportData.service_type === "SUNDAY_MEGA" ? "Mega Gathering" : "TTLHA Cell"
      }) has already been submitted.`
    );
  }

  const newReport = {
    id: "rep-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    ...reportData,
    // Store audio and Google Photos
    sermon_audio_name: reportData.sermon_audio_name || null,
    sermon_audio_data: reportData.sermon_audio_data || null,
    google_photos_url: reportData.google_photos_url || null,
    created_at: new Date().toISOString(),
    status: "SUBMITTED",
  };

  // 1. Immediately update LocalStorage cache
  try {
    const updated = [newReport, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("LocalStorage save failed:", e);
  }

  // Notify all listening dashboards of new data
  notifyReportsUpdated();

  // 2. Sync to Supabase so it appears across all devices and URLs (localhost and https)
  try {
    await supabase.from("service_reports").insert([
      {
        service_type: reportData.service_type === "SUNDAY_MEGA" ? "SUNDAY" : "MIDWEEK",
        report_date: reportData.service_date || new Date().toISOString().split("T")[0],
        message_title: reportData.message_title || reportData.sermon_title || "",
        preacher: reportData.preacher || "",
        new_members: parseInt(reportData.new_members) || 0,
        
        pastors_count: parseInt(reportData.pastors_count) || 0,
        shepherds_count: parseInt(reportData.shepherds_count) || 0,
        members_count: parseInt(reportData.members_count) || 0,
        first_timers_count: parseInt(reportData.first_timers_count) || 0,
        teens_count: parseInt(reportData.teens_count) || 0,
        children_count: parseInt(reportData.children_count) || 0,
        total_attendance: reportData.total_attendance || 0,

        offering: parseFloat(reportData.offering) || 0,
        tithe: parseFloat(reportData.tithe) || 0,
        partnership: parseFloat(reportData.partnership) || 0,
        first_fruit: parseFloat(reportData.first_fruit) || 0,
        total_finance: reportData.total_stewardship || 0,
        bus_offering: parseFloat(reportData.total_bus_offering) || 0,

        altar_call: parseInt(reportData.altar_call) || 0,
        cell_evangelism: parseInt(reportData.cell_evangelism) || 0,
        outreach: parseInt(reportData.outreach) || 0,
        total_souls_won: reportData.total_souls_won || 0,

        cells_in_branch: parseInt(reportData.num_cells_in_branch) || 0,
        cell_meetings_held: parseInt(reportData.cell_meetings_held) || 0,
        cell_meetings_not_held: parseInt(reportData.cell_meetings_not_held) || 0,
        unheld_cells_report: reportData.unheld_cells_report || "",

        cells_bused_to_church: parseInt(reportData.num_cells_bused) || 0,
        people_via_cells: parseInt(reportData.num_people_via_cells) || 0,

        num_bused: parseInt(reportData.num_bused) || 0,
        num_own_accord: parseInt(reportData.num_own_accord) || 0,
        num_organised_buses: parseInt(reportData.num_organised_buses) || 0,
        total_busing_cost: parseFloat(reportData.total_busing_cost) || 0,

        spectacular_notes: reportData.spectacular_event || "",
        sermon_audio_name: reportData.sermon_audio_name || null,
        google_photos_url: reportData.google_photos_url || null,
        status: "SUBMITTED",
        raw_data: reportData,
      },
    ]);
  } catch (err) {
    console.warn("Supabase background sync:", err);
  }

  return newReport;
};

// Synchronous cache reader — use as useState initializer for instant load
export const getCachedReportsSync = (branchFilter = null) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_REPORTS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_REPORTS;
    if (!branchFilter) return parsed;
    const bf = branchFilter.trim().toLowerCase();
    const filtered = parsed.filter((r) => (r.branch_name || "").trim().toLowerCase() === bf);
    return filtered.length > 0 ? filtered : parsed;
  } catch {
    return DEFAULT_REPORTS;
  }
};

// Dispatch a CustomEvent so all open dashboards can refresh instantly
export const notifyReportsUpdated = () => {
  try {
    window.dispatchEvent(new CustomEvent("lec_report_updated"));
  } catch {
    // non-browser environment — silently ignore
  }
};

export const canUndoReport = (report) => {
  if (!report || !report.created_at) return false;
  const created = new Date(report.created_at).getTime();
  if (isNaN(created)) return false;
  const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
  return (Date.now() - created) <= THREE_HOURS_MS;
};

export const getRemainingUndoTime = (report) => {
  if (!report || !report.created_at) return null;
  const created = new Date(report.created_at).getTime();
  if (isNaN(created)) return null;
  const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
  const diff = THREE_HOURS_MS - (Date.now() - created);
  if (diff <= 0) return null;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export const undoReport = async (reportId) => {
  let reports = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    reports = raw ? JSON.parse(raw) : DEFAULT_REPORTS;
  } catch {
    reports = DEFAULT_REPORTS;
  }

  const targetReport = reports.find((r) => r.id === reportId);
  if (!targetReport) {
    throw new Error("Report not found to undo.");
  }

  // 3-hour expiry check
  if (!canUndoReport(targetReport)) {
    throw new Error("The undo window has expired. Submissions can only be undone within 3 hours.");
  }

  // Remove report from local storage cache
  const updatedReports = reports.filter((r) => r.id !== reportId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
  } catch (e) {
    console.error("Failed to update localStorage on undo:", e);
  }

  // Remove from Supabase
  try {
    await supabase.from("service_reports").delete().eq("id", reportId);
  } catch (e) {
    console.warn("Supabase undo delete error:", e);
  }

  return targetReport;
};
