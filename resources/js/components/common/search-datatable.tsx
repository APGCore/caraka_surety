import { cn } from "@/common/utils/cn";
import React from "react";
import { Button } from "../_shadcn-ui/button";
import { Input } from "../_shadcn-ui/input";

interface SearchDatatableProps {
  className?: string;
  value: any;
  placeholder?: string;
  onChange: (e: any) => void;
  onSubmit: (e: any) => void;
}

const SearchDatatable: React.FC<SearchDatatableProps> = ({
  value,
  placeholder = "Search Data",
  className,
  onChange,
  onSubmit,
}) => {
  return (
    <div className={"flex"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
        className="flex items-end w-full  gap-x-3">
        <Input
          className={cn("h-full w-full", className)}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Button type="submit">Cari</Button>
      </form>
    </div>
  );
};

export default SearchDatatable;
