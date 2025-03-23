import { TableRow } from "@/components/_shadcn-ui/table";
import React from "react";
import { Skeleton } from "../../_shadcn-ui/skeleton";
import { TableCell } from "../../_shadcn-ui/table";

interface TableSkeletonProps {
  colspan: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ colspan }) => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell colSpan={colspan} className="text-center">
            <Skeleton className="h-6 w-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default TableSkeleton;
