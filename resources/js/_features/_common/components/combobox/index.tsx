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
import { Check, ChevronDown, ChevronsDown, ChevronsUpDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface ComboboxItem {
  [key: string]: any;
}

interface ComboboxProps {
  data: ComboboxItem[];
  labelKey?: string;
  valueKey?: string;
  filterKey?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundText?: string;
  onSelect?: (item: ComboboxItem | null) => void;
  defaultValue?: string | number;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const NewCombobox: React.FC<ComboboxProps> = ({
  data,
  labelKey = "label",
  valueKey = "value",
  filterKey,
  onSelect,
  defaultValue,
  placeholder,
  searchPlaceholder,
  notFoundText,
  isLoading,
  isDisabled,
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
    } else if (!defaultValue) {
      // Reset value jika defaultValue kosong atau undefined
      setValue(null);
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

  const getFilterKey = useCallback(
    (item: ComboboxItem): boolean => {
      if (!item || typeof item !== "object" || !filterKey) return false;
      return Boolean(item[filterKey]);
    },
    [filterKey],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={data.length === 0 || isDisabled}
          className="w-full justify-between">
          {filterKey ? comboboxPlaceholder : value ? getLabel(value) : comboboxPlaceholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                    className={cn("flex items-center justify-between", {
                      "cursor-not-allowed": getFilterKey(item),
                    })}
                    key={getValue(item)}
                    value={getValue(item)}
                    disabled={getFilterKey(item)}
                    onSelect={(currentValue) => {
                      const selectedItem = data.find((i) => String(i[valueKey]) === currentValue) || null;
                      setValue(selectedItem);
                      setOpen(false);
                      if (onSelect) onSelect(selectedItem);
                    }}>
                    <div className="flex items-center gap-2">
                      {getFilterKey(item) ? (
                        <Check className={cn("mr-2 h-4 w-4 opacity-100")} />
                      ) : (
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value?.[valueKey] === item[valueKey] ? "opacity-100" : "opacity-0",
                          )}
                        />
                      )}

                      {getLabel(item)}
                    </div>
                    {getFilterKey(item) && (
                      <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">Sudah Dipilih</span>
                    )}
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
