import { cn } from "@/common/utils/cn";
import React from "react";

interface ContainerProps extends React.PropsWithChildren {
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ className, ...props }) => {
  return <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 ", className)}>{props.children}</div>;
};

export { Container };
