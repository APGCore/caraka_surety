import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import React from "react";

interface InvoiceCentralOfficeProps {
    submission: any;
}

const InvoiceDetailDatatable: React.FC<InvoiceCentralOfficeProps> = ({ submission }) => {
    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold">Detail Pengajuan</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>OBLIGEE</TableHead>
                        <TableHead>PROJECT</TableHead>
                        <TableHead>Awal</TableHead>
                        <TableHead>Akhir</TableHead>
                        <TableHead>Hari Asuransi</TableHead>
                        <TableHead>Hari Cabang</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>{submission.obligee?.name}</TableCell>
                        <TableCell>{submission.job_name}</TableCell>
                        <TableCell>{submission.start_date}</TableCell>
                        <TableCell>{submission.end_date}</TableCell>
                        <TableCell>{submission.time_period} Hari</TableCell>
                        <TableCell>{submission.time_period + 1} Hari</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};

export default InvoiceDetailDatatable;
