export function hourLabel(hour) {
  if (hour === 12) return '12pm';
  if (hour > 12) return `${hour - 12}pm`;
  return `${hour}am`;
}
