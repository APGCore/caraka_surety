import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/cn";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";
import { useEffect } from "react";

export interface ComboboxProps<T> {
  datas: T[];
  labelKey: keyof T; // Key to display as the label
  valueKey: keyof T; // Key to use as the value
  defaultValue?: string | number | null; // Default value
  defaultValueId?: string | number | null; // Default value id
  onSelect?: (value: T) => void; // Callback when an item is selected
  placeholder?: string; // Placeholder text
  notFoundText?: string; // Text to display when no item is found
  className?: string;
  id?: string;
  disabledValue?: boolean;
  reset?: boolean;
}

const Combobox: React.FC<ComboboxProps<any>> = ({
  datas,
  labelKey,
  valueKey,
  defaultValue,
  defaultValueId,
  reset = false,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string | number>("");
  const labelButtonPlaceholder = props?.placeholder ?? "Select item...";

  useEffect(() => {
    if (defaultValue && datas) {
      setValue(defaultValue);
    }
  }, [defaultValue, datas]);

  useEffect(() => {
    if (defaultValueId && datas) {
      const data = datas.find((item) => item?.id === defaultValueId);
      setValue(data?.[valueKey] as string);
    }
  }, [defaultValueId, datas]);

  useEffect(() => {
    if (reset) {
      setValue("");
    }
  }, [reset]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={props.id}
          variant="outline"
          aria-expanded={open}
          className={cn("w-full justify-between px-2 h-10", props.className)}>
          {(() => {
            let label: string = labelButtonPlaceholder;
            if (defaultValueId) {
              label = datas.find((item) => item["id"] === defaultValueId)?.[labelKey] ?? labelButtonPlaceholder;
            } else if (defaultValue) {
              label = datas.find((item) => item["id"] === defaultValue)?.[labelKey] ?? labelButtonPlaceholder;
            } else if (value && defaultValue !== null) {
              label = datas.find((item) => item[valueKey] === value)?.[labelKey] ?? labelButtonPlaceholder;
            }
            return label.length > 15 ? label.slice(0, 15) + "..." : label;
          })()}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        avoidCollisions={false}
        className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
        <Command>
          <CommandInput placeholder={props?.placeholder ?? "Search item..."} className="m-1" />
          <CommandList>
            <CommandEmpty>{props?.notFoundText ?? "No item found."}</CommandEmpty>
            <CommandGroup>
              {datas.map((item) => (
                <CommandItem
                  key={item[valueKey] as React.Key}
                  value={item[valueKey] as string}
                  disabled={item.isChoosed === true}
                  onSelect={(currentValue) => {
                    props.onSelect?.(item);
                    setValue(currentValue === value ? value : currentValue);
                    setOpen(false);
                  }}>
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
