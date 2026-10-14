function validateVisit(visit, today, currentHour) {
  if (!visit || typeof visit.visit_date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(visit.visit_date)) {
    return 'Choose a valid date.';
  }
  // Round-trip the date so impossible dates such as February 30 are refused.
  const date = new Date(`${visit.visit_date}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== visit.visit_date) {
    return 'Choose a valid date.';
  }
  if (visit.visit_date < today) return 'Choose today or a future date.';
  if (!Number.isInteger(visit.visit_hour) || visit.visit_hour < 7 || visit.visit_hour > 21) {
    return 'Choose a whole hour from 7am to 9pm.';
  }
  if (visit.visit_date === today && visit.visit_hour <= currentHour) {
    return 'Choose an hour later than the current time in Malaysia.';
  }
  if (typeof visit.job !== 'string' || !visit.job.trim()) return 'Tell us what needs fixing.';
  if (visit.job.length > 200) return 'Keep the job note to 200 characters or fewer.';
  return null;
}

module.exports = { validateVisit };
