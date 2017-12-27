const findSunday = (start) => {
  const dateMilliseconds = Date.parse(start);
  const dateString = new Date(dateMilliseconds);
  const dayOfWeek = dateString.getDay();
  const subtractDays = dayOfWeek * 1000 * 60 * 60 * 24;
  const subtractToSunday = dateMilliseconds - subtractDays;
  const newDateString = new Date(subtractToSunday);
  const resetTime = newDateString.setHours(23, 59);
  return resetTime;
};

module.exports = { findSunday };