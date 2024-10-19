import { textCurrency } from "@/lib/text-currency";

type InputCurrencyProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
};

const InputCurrency = (props: InputCurrencyProps) => {
  const { value, onChange, ...rest } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const formattedValue = textCurrency(value);
    onChange(formattedValue);
  };

  return (
    <input
      {...rest}
      value={textCurrency(value)}
      onChange={handleChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 focus:border-blue-400"
    />
  );
};

export default InputCurrency;
