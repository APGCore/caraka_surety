import { PaginationDatatable } from "@/components/common/pagination-datatable";
import RenderList from "@/components/common/render-list";
import { ShowingCountDatatable } from "@/components/common/showing-count-datatable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GuarantorRateUtils } from "@/pages/admin/guarantor-management/guarantor-rate/guarantor-rate.utils";
import { Link } from "@inertiajs/react";
import React from "react";

interface GuarantorRateDatatableProps {
  guarantorProductTypes: any;
}

const GuarantorRateDatatable: React.FC<GuarantorRateDatatableProps> = ({ guarantorProductTypes }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No Urut</TableHead>
            <TableHead>Kode</TableHead>
            <TableHead>Jenis Jaminan</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={guarantorProductTypes?.data}
            render={(guarantorProductType: any) => (
              <TableRow key={guarantorProductType.id}>
                <TableCell>{guarantorProductType.no}</TableCell>
                <TableCell>{guarantorProductType.code}</TableCell>
                <TableCell>{guarantorProductType.full_name}</TableCell>
                <TableCell className="text-right">
                  <Link
                    className="bg-primary text-destructive-foreground shadow-sm hover:bg-primary/90 px-2 py-1.5 text-sm w-full rounded-sm text-start"
                    href={route(GuarantorRateUtils.link.create, guarantorProductType.id)}>
                    Setting Tarif
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
      <ShowingCountDatatable meta={guarantorProductTypes?.meta} />
      <PaginationDatatable meta={guarantorProductTypes?.meta} only={["profiles"]} />
    </>
  );
};

export default GuarantorRateDatatable;
