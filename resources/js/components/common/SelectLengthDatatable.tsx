import { cn } from "@/lib/cn";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface SelectLengthDatatableProps {
  className?: string;
  onChange: (value: string) => void;
  defaultValue: string;
}

const SelectLengthDatatable: React.FC<SelectLengthDatatableProps> = ({ defaultValue, onChange, className }) => {
  return (
    <Select onValueChange={(e) => onChange(e)} value={defaultValue}>
      <SelectTrigger className="w-max">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent className={cn(className)}>
        <SelectItem value="10">10</SelectItem>
        <SelectItem value="20">20</SelectItem>
        <SelectItem value="50">50</SelectItem>
        <SelectItem value="100">100</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectLengthDatatable;
