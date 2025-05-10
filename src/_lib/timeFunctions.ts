export const getHoursDifference = (date1: Date, date2: Date) => {
  const diffInMs = Math.abs(date2.getTime() - date1.getTime());
  const diffInHours = diffInMs / (1000 * 60 * 60);
  return diffInHours;
}