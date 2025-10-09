export function makeICS(summary: string, description: string, startIso: string, durationMins = 30) {
  const dt = new Date(startIso);
  const dtEnd = new Date(dt.getTime() + durationMins * 60000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const uid = crypto.randomUUID();
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//OpsCentral//EN", "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH", "BEGIN:VEVENT",
    `UID:${uid}`, `SUMMARY:${summary}`, `DESCRIPTION:${description}`,
    `DTSTART:${fmt(dt)}`, `DTEND:${fmt(dtEnd)}`, `DTSTAMP:${fmt(new Date())}`,
    "END:VEVENT", "END:VCALENDAR"
  ].join("\r\n");
  return new Blob([ics], { type: "text/calendar;charset=utf-8" });
}