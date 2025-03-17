import { cn } from "@/common/utils/cn";
import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        " border-gray-300  focus:border-indigo-500 focus:ring-indigo-500 flex h-9 shadow-sm w-full rounded-sm border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

interface PasswordInputProps extends InputProps {
  className?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className=" relative w-full group">
      <Input {...props} ref={ref} type={showPassword ? "text" : "password"} className={cn("pr-12", className)} />
      {showPassword ? (
        <Eye
          onClick={togglePassword}
          className={cn(
            "absolute right-3 top-[50%] text-slate-500 group-focus-within:text-primary h-5 w-5 translate-y-[-50%] cursor-pointer",
          )}
        />
      ) : (
        <EyeOff
          onClick={togglePassword}
          className={cn(
            "absolute right-3 top-[50%] text-slate-500 group-focus-within:text-primary h-5 w-5 translate-y-[-50%] cursor-pointer",
          )}
        />
      )}
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export { Input, PasswordInput };
