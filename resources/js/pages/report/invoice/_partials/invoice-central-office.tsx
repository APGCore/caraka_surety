import { formatCurrency } from "@/common/utils/format-currency";
import { Table, TableBody, TableCell, TableRow } from "@/components/_shadcn-ui/table";
import React from "react";

interface InvoiceCentralOfficeProps {
    centralOfficeRate: {
        minimum: number;
        management_fee: number;
        service_charge: number;
        total: number;
    };
}

const InvoiceCentralOffice: React.FC<InvoiceCentralOfficeProps> = ({ centralOfficeRate }) => {
    return (
        <>
            <h2 className="text-xl font-semibold">Invoice BPR Pusat</h2>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>Minimum</TableCell>
                        <TableCell>: {formatCurrency(centralOfficeRate?.minimum)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Rate</TableCell>
                        <TableCell>: {centralOfficeRate?.management_fee}%</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Service Charge</TableCell>
                        <TableCell>: {formatCurrency(centralOfficeRate?.service_charge)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell>: {formatCurrency(centralOfficeRate?.total)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    );
};

export default InvoiceCentralOffice;
