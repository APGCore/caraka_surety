import { cn } from "@/common/utils/cn";
import { Alert, AlertDescription, AlertTitle } from "@/components/_shadcn-ui/alert";
import React, { JSX } from "react";

export interface AlertBaseProps {
    icon?: React.ComponentType;
    iconProps?: JSX.IntrinsicElements["svg"];
    className?: string;
    title: string;
    desc?: string;
    isShow?: boolean;
    onClose?: () => void;
}

const AlertBase: React.FC<AlertBaseProps> = ({ title, desc, isShow, icon, iconProps, className }) => {
    if (!isShow) return null;

    return (
        <Alert className={cn(className)}>
            {icon &&
                React.createElement(icon, {
                    className: cn("w-4 h-4 shrink-0", iconProps?.className),
                } as JSX.IntrinsicElements["svg"])}
            <AlertTitle>{title}</AlertTitle>
            {desc && <AlertDescription>{desc}</AlertDescription>}
        </Alert>
    );
};

export default AlertBase;
