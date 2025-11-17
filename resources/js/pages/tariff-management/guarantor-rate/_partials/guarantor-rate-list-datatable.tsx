import { Badge } from "@/components/_shadcn-ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import { GuarantorRateUtils } from "@/pages/tariff-management/guarantor-rate/guarantor-rate.utils";
import { Link } from "@inertiajs/react";
import { formatDate } from "date-fns";
import React from "react";

interface GuarantorRateListDatatableProps {
  guarantorRates: any;
}

const GuarantorRateListDatatable: React.FC<GuarantorRateListDatatableProps> = ({ guarantorRates }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Berlaku Mulai</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={guarantorRates?.data}
            render={(guarantorRate: any, index: number) => (
              <TableRow key={guarantorRate.id}>
                <TableCell>{guarantorRates?.meta?.from + index}</TableCell>
                <TableCell>
                  {guarantorRate.effective_at ? formatDate(guarantorRate.effective_at, "dd MMMM yyyy") : "-"}
                </TableCell>
                <TableCell>{guarantorRate.pay_rate} %</TableCell>
                <TableCell className="text-right">
                  <Link
                    className="bg-yellow-400 text-black shadow-sm hover:bg-yellow-400/90 px-2 py-1.5 text-sm w-full rounded-sm text-start"
                    href={route(GuarantorRateUtils.link.edit, {
                      guarantorRate: guarantorRate.id,
                    })}>
                    Edit Tarif
                  </Link>
                </TableCell>
              </TableRow>
            )}
            renderFallback={() => (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          />
        </TableBody>
      </Table>
      <ShowingCountDatatable meta={guarantorRates?.meta} />
      <PaginationDatatable meta={guarantorRates?.meta} />
    </>
  );
};

export default GuarantorRateListDatatable;
