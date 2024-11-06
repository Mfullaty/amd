export function checkDate(dateString) {
  // Convert dateString to a Date object
  const date = new Date(dateString);

  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  // Get tomorrow's date
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Checks
  const isToday = (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );

  const isTomorrow = (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  );

  const pastToday = date < today;

  return { isToday, isTomorrow, pastToday };
}
