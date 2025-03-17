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
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
import { Check, ChevronDown, Eraser } from "lucide-react";
import * as React from "react";
import { useEffect } from "react";

export interface ComboboxProps<T> {
    datas: T[];
    labelKey: keyof T; // Key to display as the label
    valueKey: keyof T; // Key to use as the value
    defaultValue?: string | number | null; // Default value
    defaultValueId?: string | number | null; // Default value id
    onSelect?: (value: T) => void; // Callback when an item is selected
    onReset?: (resetVal: boolean) => void; // Callback when reset
    handleReset?: () => void; // Callback when reset
    placeholder?: string; // Placeholder text
    notFoundText?: string; // Text to display when no item is found
    className?: string;
    dotLength?: number;
    id?: string;
    disabledValue?: boolean;
    reset?: boolean;
    shortValue?: boolean;
    isWidthSameWithInput?: boolean;
    checkedWithCondition?: boolean;
    isSelectFirst?: boolean;
    isReset?: boolean;
    containerClassName?: string;
}

const Combobox: React.FC<ComboboxProps<any>> = ({
    datas,
    labelKey,
    valueKey,
    defaultValue,
    defaultValueId,
    reset = false,
    shortValue = false,
    isWidthSameWithInput = true,
    isSelectFirst = false,
    isReset = false,
    ...props
}) => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<string | number | null>("");
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
            if (props?.onReset && typeof props.onReset === "function") {
                props.onReset(false);
            }
        }
    }, [reset]);

    const shortText = (text: string, length: number) => {
        return text.length > length ? text.slice(0, length) + "..." : text;
    };

    return (
        <div className={cn("flex", props.containerClassName)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={props.id}
                        variant="outline"
                        aria-expanded={open}
                        className={cn("w-full justify-between px-2 h-10", props.className)}>
                        {(() => {
                            let label: string = labelButtonPlaceholder;
                            if (isSelectFirst && datas.length > 0) {
                                label = datas[0][labelKey] ?? labelButtonPlaceholder;
                            } else if (defaultValueId) {
                                label =
                                    datas.find((item) => item["id"] === defaultValueId)?.[labelKey] ??
                                    labelButtonPlaceholder;
                            } else if (defaultValue) {
                                label =
                                    datas.find((item) => item["id"] === defaultValue)?.[labelKey] ??
                                    labelButtonPlaceholder;
                            } else if (value && defaultValue !== null) {
                                label =
                                    datas.find((item) => item[valueKey] === value)?.[labelKey] ??
                                    labelButtonPlaceholder;
                            }
                            return shortValue ? shortText(label, 15) : label;
                        })()}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    avoidCollisions={false}
                    className={cn("p-0", {
                        "w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]":
                            isWidthSameWithInput,
                    })}>
                    <Command>
                        <CommandInput placeholder={props?.placeholder ?? "Search item..."} className="m-1" />
                        <CommandList>
                            <CommandEmpty>{props?.notFoundText ?? "No item found."}</CommandEmpty>
                            <CommandGroup>
                                <RenderList
                                    of={datas}
                                    render={(item: any, idx: number) => (
                                        <CommandItem
                                            key={idx + 1}
                                            value={item[valueKey] as string}
                                            disabled={item.isChoosed === true}
                                            onSelect={(currentValue) => {
                                                props.onSelect?.(item);
                                                setValue(currentValue === value ? "" : currentValue);
                                                setOpen(false);
                                            }}>
                                            {props?.checkedWithCondition && item.isChoosed ? (
                                                <Check className={cn("mr-2 h-4 w-4 opacity-100")} />
                                            ) : (
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        value === item[valueKey] ? "opacity-100" : "opacity-0",
                                                    )}
                                                />
                                            )}
                                            {item[labelKey]}
                                        </CommandItem>
                                    )}
                                />
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <Show when={defaultValue && isReset}>
                <Button
                    variant="outline"
                    color="destructive"
                    className="px-2 bg-red-200"
                    onClick={() => {
                        setValue(null);
                        if (typeof props?.handleReset === "function") {
                            props.handleReset();
                        }
                    }}>
                    <Eraser size="17" />
                </Button>
            </Show>
        </div>
    );
};

export { Combobox };
