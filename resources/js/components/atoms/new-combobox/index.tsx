/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/_features/_common/components/_shadcn-ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/_features/_common/components/_shadcn-ui/popover";
import { cn } from "@/_features/_common/utils/cn";
import Show from "@/components/atoms/show";
import { Check, ChevronsUpDown, Eraser } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

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
  className?: string;
  onReset?: () => void;
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
  className,
  onReset,
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

  const handleReset = useCallback(() => {
    setValue(null);
    if (onReset) onReset();
  }, [setValue]);

  return (
    <div className="flex w-full gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={data.length === 0}
            className={cn("w-full justify-between", className)}>
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
                        className={cn(
                          "mr-2 h-4 w-4",
                          value?.[valueKey] === item[valueKey] ? "opacity-100" : "opacity-0",
                        )}
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
      <Show when={onReset !== undefined && value !== null}>
        <Button variant="outline" color="destructive" className="px-2 bg-red-200" onClick={handleReset}>
          <Eraser size="17" />
        </Button>
      </Show>
    </div>
  );
};

export default NewCombobox;
