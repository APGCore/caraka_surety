import { formatCurrency } from "@/common/utils/format-currency";
import { Table, TableBody, TableCell, TableRow } from "@/components/_shadcn-ui/table";
import React from "react";

interface InvoiceOfficeProps {
  officeRate: {
    minimum: number;
    rate: number;
    premi: number;
    adm: number;
    service_charges: number;
    total: number;
  };
}

const InvoiceOffice: React.FC<InvoiceOfficeProps> = ({ officeRate }) => {
  return (
    <>
      <Table>
        <TableBody>
          {/*<TableRow>*/}
          {/*  <TableCell>Minimum</TableCell>*/}
          {/*  <TableCell>: {formatCurrency(officeRate?.minimum ?? 0)}</TableCell>*/}
          {/*</TableRow>*/}
          {/*<TableRow>*/}
          {/*  <TableCell>Rate</TableCell>*/}
          {/*  <TableCell>: {officeRate?.rate ?? 0} %</TableCell>*/}
          {/*</TableRow>*/}
          <TableRow>
            <TableCell>Premi</TableCell>
            <TableCell>: {formatCurrency(officeRate?.premi ?? 0)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Biaya Administrasi</TableCell>
            <TableCell>: {formatCurrency(officeRate?.adm ?? 0)}</TableCell>
          </TableRow>
          {/*<TableRow>*/}
          {/*  <TableCell>Service Charges</TableCell>*/}
          {/*  <TableCell>: {formatCurrency(officeRate?.service_charges ?? 0)}</TableCell>*/}
          {/*</TableRow>*/}
          <TableRow>
            <TableCell>Total Premi</TableCell>
            <TableCell>: {formatCurrency(officeRate?.total ?? 0)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default InvoiceOffice;
