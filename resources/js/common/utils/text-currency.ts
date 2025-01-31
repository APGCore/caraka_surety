export const textCurrency = (value: any) => {
  if (!value) return "";
  return value
    .toString()
    .replace(/[^0-9]/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
