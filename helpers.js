const findSunday = (start) => {
  const dateMilliseconds = Date.parse(start);
  const dateString = new Date(dateMilliseconds);
  const dayOfWeek = dateString.getDay();
  const msInWeek = 1000 * 60 * 60 * 24;
  let subtractDays;

  if (dayOfWeek === 0) {
    subtractDays = 7;
  } else {
    subtractDays = dayOfWeek;
  }

  const subtractToSunday = dateMilliseconds - (subtractDays * msInWeek);
  const newDateString = new Date(subtractToSunday);
  const resetTime = newDateString.setHours(23, 59);
  return resetTime;
};

module.exports = { findSunday };