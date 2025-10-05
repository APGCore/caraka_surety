import { formatCurrency } from "@/common/utils/format-currency";
import { Table, TableBody, TableCell, TableRow } from "@/components/_shadcn-ui/table";
import React from "react";

interface InvoiceGuarantorProps {
  guarantorName: string;
  guarantorRate: {
    minimum: number;
    rate: number;
    adm: number;
    service_charges: number;
    premi: number;
    total: number;
    commission: number;
    pph_commission: number;
    nett_commission: number;
    nett_premi: number;
  };
}

const InvoiceGuarantor: React.FC<InvoiceGuarantorProps> = ({ guarantorName, guarantorRate }) => {
  return (
    <>
      <h2 className="text-xl font-semibold">Invoice Asuransi {guarantorName}</h2>
      <Table>
        <TableBody>
          {/*<TableRow>*/}
          {/*  <TableCell>Minimum</TableCell>*/}
          {/*  <TableCell>: {formatCurrency(guarantorRate?.minimum ?? 0)}</TableCell>*/}
          {/*</TableRow>*/}
          {/*<TableRow>*/}
          {/*  <TableCell>Rate</TableCell>*/}
          {/*  <TableCell>: {guarantorRate?.rate ?? 0} %</TableCell>*/}
          {/*</TableRow>*/}
          <TableRow>
            <TableCell>Premi</TableCell>
            <TableCell>: {formatCurrency(guarantorRate?.premi ?? 0)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Biaya Administrasi</TableCell>
            <TableCell>: {formatCurrency(guarantorRate?.adm ?? 0)}</TableCell>
          </TableRow>
          {/*<TableRow>*/}
          {/*  <TableCell>Service Charge</TableCell>*/}
          {/*  <TableCell>: {formatCurrency(guarantorRate?.service_charges ?? 0)}</TableCell>*/}
          {/*</TableRow>*/}
          <TableRow>
            <TableCell>Total Premi</TableCell>
            <TableCell>: {formatCurrency(guarantorRate?.total ?? 0)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Komisi</TableCell>
            <TableCell>: {formatCurrency(guarantorRate?.commission ?? 0)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>PPH Komisi</TableCell>
            <TableCell>: {formatCurrency(guarantorRate?.pph_commission ?? 0)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>NETT Komisi</TableCell>
            <TableCell>: {formatCurrency(guarantorRate?.nett_commission ?? 0)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>NETT Premi</TableCell>
            <TableCell>: {formatCurrency(guarantorRate?.nett_premi ?? 0)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default InvoiceGuarantor;
