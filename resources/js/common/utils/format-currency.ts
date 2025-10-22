export const formatCurrency = (value: number | string, minus?: boolean | false) => {
  if (typeof value === "string") {
    value = Number(value);
  }
  if (minus) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(-value);
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
};

export const formatStringWithDots = (str: string, maxLength: number): string => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength - 3) + "...";
  }
  return str;
};
