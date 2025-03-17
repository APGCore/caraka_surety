export const getNumericValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    return isNaN(event.target.valueAsNumber) ? undefined : event.target.valueAsNumber;
};
