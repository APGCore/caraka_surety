/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/common/utils/cn";
import { Button } from "@/components/_shadcn-ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/_shadcn-ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/_shadcn-ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface ComboboxItem {
  [key: string]: any;
}

interface ComboboxProps {
  data: ComboboxItem[];
  labelKey?: string;
  valueKey?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundText?: string;
  onSelect?: (item: ComboboxItem | null) => void;
  defaultValue?: string | number;
  isLoading?: boolean;
}

const NewCombobox: React.FC<ComboboxProps> = ({
  data,
  labelKey = "label",
  valueKey = "value",
  onSelect,
  defaultValue,
  placeholder,
  searchPlaceholder,
  notFoundText,
  isLoading,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<ComboboxItem | null>(null);
  const comboboxPlaceholder = useMemo(
    () => (isLoading ? `Sedang memuat ...` : placeholder ? placeholder : "Select an option..."),
    [placeholder, isLoading],
  );
  const comboboxSearchPlaceholder = useMemo(() => searchPlaceholder || "Search...", [searchPlaceholder]);
  const comboboxNotFoundText = useMemo(() => notFoundText || "No results found.", [notFoundText]);

  useEffect(() => {
    if (defaultValue && data.length > 0) {
      const selectedItem = data.find((item) => String(item[valueKey]) === String(defaultValue)) || null;
      setValue(selectedItem);
    }
  }, [defaultValue, data, valueKey]);

  const getLabel = useCallback(
    (item: ComboboxItem) => (item[labelKey] ? String(item[labelKey]) : "Unknown"),
    [labelKey],
  );

  const getValue = useCallback(
    (item: ComboboxItem) => (item[valueKey] ? String(item[valueKey]) : "Unknown"),
    [valueKey],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={data.length === 0}
          className="w-full justify-between">
          {value ? getLabel(value) : comboboxPlaceholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        avoidCollisions={false}
        className={cn("p-0 w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]")}>
        <Command
          filter={(value, search) => {
            const item = data.find((item) => getValue(item) === String(value));
            return item && getLabel(item).toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
          }}>
          <CommandInput disabled={isLoading} placeholder={comboboxSearchPlaceholder} />
          <CommandList>
            <CommandEmpty>{comboboxNotFoundText}</CommandEmpty>
            <CommandGroup>
              {isLoading ? (
                <CommandItem disabled>
                  <Check className="mr-2 h-4 w-4 opacity-0" />
                  Loading...
                </CommandItem>
              ) : (
                data.map((item) => (
                  <CommandItem
                    key={getValue(item)}
                    value={getValue(item)}
                    onSelect={(currentValue) => {
                      const selectedItem = data.find((i) => String(i[valueKey]) === currentValue) || null;
                      setValue(selectedItem);
                      setOpen(false);
                      if (onSelect) onSelect(selectedItem);
                    }}>
                    <Check
                      className={cn("mr-2 h-4 w-4", value?.[valueKey] === item[valueKey] ? "opacity-100" : "opacity-0")}
                    />
                    {getLabel(item)}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default NewCombobox;
