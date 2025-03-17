export const textCurrency = (value: any) => {
    if (!value) return "0";
    return value
        .toString()
        .replace(/[^0-9]/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
