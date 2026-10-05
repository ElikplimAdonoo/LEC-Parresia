/**
 * LEC Pastoral Reporting Portal - SMS Service
 * Supports Arkesel & MNotify (Ghana's top SMS gateways)
 * Handles phone normalization (024... -> 23324...)
 * Safe fallback when API key is pending.
 */

// Format Ghana phone number to international standard without '+' (e.g. 233241234567)
export function normalizePhoneNumber(phone) {
  if (!phone) return "";
  let cleaned = String(phone).replace(/[^\d]/g, "");
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    cleaned = "233" + cleaned.substring(1);
  }
  return cleaned;
}

/**
 * Dispatch submission confirmation receipt SMS to pastor
 */
export async function sendSubmissionReceiptSMS(report, pastorPhone) {
  const recipient = normalizePhoneNumber(pastorPhone);
  if (!recipient) {
    console.log("[SMS Service] No valid phone number provided for receipt SMS. Skipping.");
    return { success: false, reason: "No phone number" };
  }

  // Format currency tally text
  let currencyText = `GH₵ ${Number(report.total_stewardship || 0).toFixed(2)}`;
  if (report.currency_totals) {
    const foreigns = Object.entries(report.currency_totals)
      .filter(([curr, val]) => curr !== "GHS" && Number(val) > 0)
      .map(([curr, val]) => `${curr} ${Number(val).toFixed(2)}`);
    if (foreigns.length > 0) {
      currencyText += ` (${foreigns.join(", ")})`;
    }
  }

  const serviceLabel =
    report.service_type === "SUNDAY_MEGA" ? "Mega Gathering" : "TTLHA Cell Service";

  const message = `[Love Economy Church] Report Received: ${report.branch_name} - ${serviceLabel} (${report.service_date}). Attendance: ${report.total_attendance}. Stewardship: ${currencyText}. God bless your leadership!`;

  const provider = import.meta.env.VITE_SMS_PROVIDER || "arkesel"; // 'arkesel' | 'mnotify'
  const apiKey = import.meta.env.VITE_SMS_API_KEY || "";
  const senderId = import.meta.env.VITE_SMS_SENDER_ID || "LEC-PORTAL";

  if (!apiKey) {
    console.info(
      `[SMS Sandbox / Ready Mode] Would send to ${recipient} via ${provider}:\n"${message}"\n(Set VITE_SMS_API_KEY to send live).`
    );
    return { success: true, simulated: true, recipient, message };
  }

  try {
    if (provider.toLowerCase() === "mnotify") {
      const response = await fetch("https://api.mnotify.com/api/sms/quick", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          recipient: [recipient],
          sender: senderId,
          message: message,
          is_schedule: false,
        }),
      });
      const data = await response.json();
      return { success: true, provider: "mnotify", data };
    } else {
      // Default: Arkesel
      const params = new URLSearchParams({
        action: "send-sms",
        api_key: apiKey,
        to: recipient,
        from: senderId,
        sms: message,
      });
      const response = await fetch(`https://sms.arkesel.com/sms/api?${params.toString()}`);
      const text = await response.text();
      return { success: true, provider: "arkesel", raw: text };
    }
  } catch (err) {
    console.error("[SMS Service] Delivery failed:", err);
    return { success: false, error: err.message };
  }
}
