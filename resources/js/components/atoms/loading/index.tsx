import { cn } from "@/common/utils/cn";
import { LoaderCircle } from "lucide-react";
import React from "react";

interface ILoading {
  isLoading: boolean;
  className?: string;
}

const Loading: React.FC<ILoading> = ({ isLoading, className }) => {
  if (!isLoading) return null;

  return <LoaderCircle className={cn("animate-spin flex-shrink-0", className)} />;
};

export default Loading;
