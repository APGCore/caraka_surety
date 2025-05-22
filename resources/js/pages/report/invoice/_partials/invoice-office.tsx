import { formatCurrency } from "@/common/utils/format-currency";
import { Table, TableBody, TableCell, TableRow } from "@/components/_shadcn-ui/table";
import React from "react";

interface InvoiceOfficeProps {
  officeRate: {
    minimum: number;
    rate: number;
    adm: number;
    service_charges: number;
    total: number;
  };
}

const InvoiceOffice: React.FC<InvoiceOfficeProps> = ({ officeRate }) => {
  return (
    <>
      <h2 className="text-xl font-semibold">Invoice Jual</h2>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Minimum</TableCell>
            <TableCell>: {formatCurrency(officeRate?.minimum)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Rate</TableCell>
            <TableCell>: {officeRate?.rate}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Biaya Administrasi</TableCell>
            <TableCell>: {formatCurrency(officeRate?.adm)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Service Charges</TableCell>
            <TableCell>: {formatCurrency(officeRate?.service_charges)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>: {formatCurrency(officeRate?.total)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default InvoiceOffice;
