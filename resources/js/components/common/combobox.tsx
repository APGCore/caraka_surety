import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/cn";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";

export interface ComboboxProps<T> {
  datas: T[];
  labelKey: keyof T; // Key to display as the label
  valueKey: keyof T; // Key to use as the value
  defaultValue?: string | number; // Default value
  onSelect?: (value: T, currentValue: any) => void; // Callback when an item is selected
  placeholder?: string; // Placeholder text
  notFoundText?: string; // Text to display when no item is found
  className?: string;
  id?: string;
  disabledValue?: boolean;
}

const Combobox: React.FC<ComboboxProps<any>> = ({
  datas,
  labelKey,
  valueKey,
  defaultValue,
  onSelect,
  placeholder = "Select item...",
  notFoundText = "No item found.",
  className,
  id,
  disabledValue,
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string | number>(defaultValue ?? "");
  const [valueObj, setValueObj] = React.useState<object | undefined>(
    () => datas.find((item) => item[valueKey] === defaultValue) || {},
  );

  const handleSelect = (item: any, currentValue: string) => {
    onSelect?.(item, valueObj);
    setValue(currentValue === value ? "" : currentValue);
    setValueObj(item);
    setOpen(false);
  };

  const selectedItemLabel = value ? datas.find((item) => item[valueKey] === value)?.[labelKey] : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          aria-expanded={open}
          className={cn("w-full justify-between px-2 h-10", className)}>
          {selectedItemLabel}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="m-1" />
          <CommandList>
            <CommandEmpty>{notFoundText}</CommandEmpty>
            <CommandGroup>
              {datas.map((item) => (
                <CommandItem
                  key={item[valueKey] as React.Key}
                  value={item[valueKey] as string}
                  disabled={item.isChoosed === true}
                  onSelect={(currentValue) => handleSelect(item, currentValue)}>
                  <Check className={cn("mr-2 h-4 w-4", value === item[valueKey] ? "opacity-100" : "opacity-0")} />
                  {item[labelKey]}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { Combobox };
