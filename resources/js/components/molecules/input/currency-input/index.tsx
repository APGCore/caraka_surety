import CurrencyInput from "react-currency-input-field";

type InputCurrencyProps = {
    onChange?: (value: string | undefined) => void;
    defaultValue?: string;
    value?: string;
    placeholder?: string;
};

const InputCurrency = (props: InputCurrencyProps) => {
    return (
        <CurrencyInput
            intlConfig={{ locale: "id-ID", currency: "IDR" }}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-sm"
            defaultValue={props?.defaultValue}
            value={props?.value}
            placeholder={props?.placeholder}
            onValueChange={(val) => {
                props?.onChange?.(val);
            }}
        />
    );
};

export default InputCurrency;
