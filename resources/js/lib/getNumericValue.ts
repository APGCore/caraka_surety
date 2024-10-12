export const getNumericValue = (event: React.ChangeEvent<HTMLInputElement>) => {
  const num = isNaN(event.target.valueAsNumber) ? undefined : event.target.valueAsNumber;
  return num;
};
