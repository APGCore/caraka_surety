export const getDayName = (dateString: any) => {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const date = new Date(dateString);
  return days[date.getDay()];
};

export const getMonthName = (dateString: any) => {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const date = new Date(dateString);
  return months[date.getMonth()];
};

export const formatToDateIndonesian = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = getMonthName(dateString);
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export const formatToDayDateIndonesian = (dateString: string): string => {
  const date = new Date(dateString);
  const day = getDayName(dateString);
  const dayNumber = date.getDate();
  const month = getMonthName(dateString);
  const year = date.getFullYear();

  return `${day}, ${dayNumber} ${month} ${year}`;
};

export const formatToDateTimeIndonesian = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = getMonthName(dateString);
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${day} ${month} ${year} ${hours}:${minutes}`;
};

export const formatToDayName = (dateString: string): string => {
  return getDayName(dateString);
};

export const formatToMonthName = (dateString: string): string => {
  return getMonthName(dateString);
};

export const formatToYear = (dateString: string): string => {
  const date = new Date(dateString);
  return date.getFullYear().toString();
};
