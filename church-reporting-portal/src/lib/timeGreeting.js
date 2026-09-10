// Accra / Ghana local time greeting helper
export const getAccraGreeting = () => {
  try {
    const now = new Date();
    // Use Intl to guarantee Ghana / Africa/Accra local time (GMT)
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Africa/Accra",
      hour: "numeric",
      hour12: false,
    });
    const hour = parseInt(formatter.format(now), 10);

    if (hour < 12) return "GOOD MORNING";
    if (hour < 17) return "GOOD AFTERNOON";
    return "GOOD EVENING";
  } catch {
    const fallbackHour = new Date().getHours();
    if (fallbackHour < 12) return "GOOD MORNING";
    if (fallbackHour < 17) return "GOOD AFTERNOON";
    return "GOOD EVENING";
  }
};
