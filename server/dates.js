// Malaysia is UTC+8 all year (no daylight saving), so shift the clock by 8 hours.
function malaysiaTime(now) {
  return new Date(now.getTime() + 8 * 60 * 60 * 1000);
}

function todayInMalaysia(now = new Date()) {
  return malaysiaTime(now).toISOString().slice(0, 10);
}

function currentHourInMalaysia(now = new Date()) {
  return malaysiaTime(now).getUTCHours();
}

function hourLabel(hour) {
  if (hour === 12) return '12pm';
  if (hour > 12) return `${hour - 12}pm`;
  return `${hour}am`;
}

// The date facts for an email draft, worked out here so the AI never does date maths.
function visitDateFacts(visitDate, visitHour, today) {
  // Both values are YYYY-MM-DD strings, so parse and compare in UTC to keep the same day.
  const visitMs = Date.parse(`${visitDate}T00:00:00Z`);
  const todayMs = Date.parse(`${today}T00:00:00Z`);
  const visit = new Date(visitMs);
  const daysAway = Math.round((visitMs - todayMs) / (24 * 60 * 60 * 1000));
  return {
    weekday: visit.toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' }),
    date: visit.toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
    }),
    time: hourLabel(visitHour),
    daysAway,
    isReminder: daysAway <= 1,
  };
}

module.exports = { todayInMalaysia, currentHourInMalaysia, hourLabel, visitDateFacts };
