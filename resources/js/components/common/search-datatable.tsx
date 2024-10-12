import { cn } from "@/lib/cn";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

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
    <div className={cn("flex", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
        className="flex items-end gap-x-3">
        <Input className="h-full" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
        <Button type="submit">Cari</Button>
      </form>
    </div>
  );
};

export default SearchDatatable;
