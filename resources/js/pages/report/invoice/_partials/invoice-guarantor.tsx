import { formatCurrency } from "@/common/utils/format-currency";
import { Table, TableBody, TableCell, TableRow } from "@/components/_shadcn-ui/table";
import React from "react";

interface InvoiceGuarantorProps {
  guarantorName: string;
  guarantorRate: {
    minimum_payment: number;
    pay_rate: number;
    payment_administration: number;
    stamp_duty: number;
    service_charge: number;
    total: number;
  };
}

const InvoiceGuarantor: React.FC<InvoiceGuarantorProps> = ({ guarantorName, guarantorRate }) => {
  return (
    <>
      <h2 className="text-xl font-semibold">Invoice Asuransi {guarantorName}</h2>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Minimum</TableCell>
            <TableCell>: {formatCurrency(guarantorRate?.minimum_payment)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Rate</TableCell>
            <TableCell>: {guarantorRate?.pay_rate}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Administrasi</TableCell>
            <TableCell>: {formatCurrency(guarantorRate?.payment_administration)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Service Charge</TableCell>
            <TableCell>: {formatCurrency(guarantorRate?.service_charge)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>: {formatCurrency(guarantorRate?.total)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default InvoiceGuarantor;
