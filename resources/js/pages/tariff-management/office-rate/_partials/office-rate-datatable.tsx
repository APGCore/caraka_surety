import { Badge } from "@/components/_shadcn-ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import { OfficeRateUtils } from "@/pages/tariff-management/office-rate/office-rate.utils";
import { JobTypeEnum } from "@/types/job-type-enum";
import { Link } from "@inertiajs/react";
import React from "react";

interface OfficeRateDatatableProps {
  profileId: number | null;
  guarantorId: number | null;
  guarantorBranchId: number | null;
  guarantorProductTypes: any;
}

const OfficeRateDatatable: React.FC<OfficeRateDatatableProps> = ({
  profileId,
  guarantorId,
  guarantorBranchId,
  guarantorProductTypes,
}) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No Urut</TableHead>
            <TableHead>Kode</TableHead>
            <TableHead>Jenis Jaminan</TableHead>
            <TableHead>Kelompok Pekerjaan</TableHead>
            <TableHead>Status</TableHead>
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
                <TableCell>{guarantorProductType.name}</TableCell>
                <TableCell>
                  {guarantorProductType.job_group}
                  <Show when={guarantorProductType.job_type == JobTypeEnum.CONDITIONAL}>
                    <Badge className="ml-2 bg-blue-400">{guarantorProductType.job_type}</Badge>
                  </Show>
                </TableCell>
                <TableCell>
                  <Show
                    when={guarantorProductType.office_rate}
                    children={<Badge className="ml-2 bg-green-400">Sudah di setting</Badge>}
                    fallback={<Badge className="ml-2 bg-red-400">Belum di setting</Badge>}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    className="bg-primary text-destructive-foreground shadow-sm hover:bg-primary/90 px-2 py-1.5 text-sm w-full rounded-sm text-start"
                    href={route(OfficeRateUtils.link.create, {
                      profile_id: profileId,
                      guarantor_id: guarantorId,
                      guarantor_branch_id: guarantorBranchId,
                      guarantor_product_type_id: guarantorProductType.id,
                    })}>
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
      <PaginationDatatable meta={guarantorProductTypes?.meta} />
    </>
  );
};

export default OfficeRateDatatable;
