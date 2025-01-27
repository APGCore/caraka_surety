import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/format-currency";
import React from "react";

interface InvoiceBranchOfficeProps {
  branchName: string;
  branchOfficeRate: {
    minimum_bill: number;
    selling_rate: number;
    sales_administration: number;
    service_charge: number;
    total: number;
  };
}

const InvoiceBranchOffice: React.FC<InvoiceBranchOfficeProps> = ({ branchName, branchOfficeRate }) => {
  return (
    <>
      <h2 className="text-xl font-semibold">Invoice {branchName}</h2>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Minimum</TableCell>
            <TableCell>: {formatCurrency(branchOfficeRate?.minimum_bill)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Rate</TableCell>
            <TableCell>: {branchOfficeRate?.selling_rate}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Biaya Administrasi</TableCell>
            <TableCell>: {formatCurrency(branchOfficeRate?.sales_administration)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Service Charge</TableCell>
            <TableCell>: {formatCurrency(branchOfficeRate?.service_charge)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>: {formatCurrency(branchOfficeRate?.total)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default InvoiceBranchOffice;
