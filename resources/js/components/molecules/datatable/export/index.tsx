import { cn } from "@/common/utils/cn";
import Loading from "@/components/atoms/loading";
import React from "react";
import { Button } from "../../../_shadcn-ui/button";

interface ExportDocsButtonDatatableProps {
  className?: string;
  onClick: () => void;
  isLoading?: boolean;
}

const ExportDocsButtonDatatable: React.FC<ExportDocsButtonDatatableProps> = ({ className, onClick, isLoading }) => {
  return (
    <Button className={cn(className)} onClick={onClick} disabled={isLoading}>
      {isLoading ? <Loading isLoading={isLoading} /> : "Export"}
    </Button>
  );
};

export default ExportDocsButtonDatatable;
