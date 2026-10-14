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

module.exports = { todayInMalaysia, currentHourInMalaysia };
