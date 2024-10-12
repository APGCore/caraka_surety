import { cn } from "@/lib/cn";
import React from "react";
import { Button } from "../ui/button";

interface ExportDocsButtonDatatableProps {
  className?: string;
  onClick: () => void;
}

const ExportDocsButtonDatatable: React.FC<ExportDocsButtonDatatableProps> = ({ className, onClick }) => {
  return (
    <Button className={cn(className)} onClick={onClick}>
      Export
    </Button>
  );
};

export default ExportDocsButtonDatatable;
