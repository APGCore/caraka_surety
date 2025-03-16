import { cn } from "@/common/utils/cn";
import { ComponentPropsWithRef, forwardRef, useEffect, useState } from "react";

type InputFieldProps = ComponentPropsWithRef<"input"> & {
    id: string;
    label: string;
    type?: string;
};

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ id, label, type = "text", ...props }, ref) => {
        const [value, setValue] = useState("");

        useEffect(() => {
            const input = document.getElementById(id) as HTMLInputElement;

            if (input) {
                // Check initial value in case autofill happens before useEffect runs
                setValue(input.value);

                // Use MutationObserver to detect autofill changes
                const observer = new MutationObserver(() => {
                    setValue(input.value);
                });

                observer.observe(input, { attributes: true, attributeFilter: ["value"] });

                return () => observer.disconnect();
            }
        }, [id]);

        return (
            <div className="relative w-full">
                <input
                    {...props}
                    ref={ref}
                    id={id}
                    type={type}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        props.onChange?.(e);
                    }}
                    className={cn(
                        "peer w-full border-b-2 min-h-[60px] h-full border-red-500 bg-transparent px-2 pt-7 pb-0 text-gray-900 focus:outline-none focus:ring-0 focus:border-red-700",
                        {
                            "border-red-700": value,
                        },
                    )}
                />
                <label
                    htmlFor={id}
                    className={`absolute left-2 transition-all ${
                        value ? "top-1 text-sm font-bold text-red-700" : "top-7 text-base text-gray-400"
                    } peer-focus:top-1 peer-focus:text-sm peer-focus:font-bold peer-focus:text-red-700`}>
                    {label}
                </label>
            </div>
        );
    },
);
