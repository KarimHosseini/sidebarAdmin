export function TimeAgo(previous) {
  const current = new Date();
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - new Date(previous.date);
  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + " ثاینه پیش";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " دقیقه پیش";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " ساعت پیش";
  } else if (elapsed < msPerMonth) {
    return "حدود " + Math.round(elapsed / msPerDay) + " روز پیش";
  } else if (elapsed < msPerYear) {
    return "حدود " + Math.round(elapsed / msPerMonth) + " ماه پیش";
  } else {
    return "حدود " + Math.round(elapsed / msPerYear) + " سال پیش";
  }
}
