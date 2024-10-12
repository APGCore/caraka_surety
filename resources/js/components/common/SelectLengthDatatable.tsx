import { cn } from "@/lib/cn";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import RenderList from "./render-list";

interface SelectLengthDatatableProps {
  className?: string;
  onChange: (value: string) => void;
  defaultValue: string;
}

const selectValue = [
  {
    value: "10",
  },
  {
    value: "20",
  },
  {
    value: "50",
  },
  {
    value: "100",
  },
];

const SelectLengthDatatable: React.FC<SelectLengthDatatableProps> = ({ defaultValue, onChange, className }) => {
  return (
    <Select onValueChange={(e) => onChange(e)} value={defaultValue}>
      <SelectTrigger className="w-max">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent className={cn(className)}>
        <RenderList
          of={selectValue}
          render={(selectVal) => <SelectItem value={selectVal.value}>{selectVal.value}</SelectItem>}
        />
      </SelectContent>
    </Select>
  );
};

export default SelectLengthDatatable;
