import React from "react";
import { TableCell, TableRow } from "../../../_shadcn-ui/table";

interface TableSkeletonProps {
    colspan: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ colspan }) => {
    return (
        <TableRow>
            <TableCell colSpan={colspan} className="text-center">
                Data tidak ditemukan!
            </TableCell>
        </TableRow>
    );
};

export default TableSkeleton;
