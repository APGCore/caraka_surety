import { formatCurrency } from "@/_features/_common/utils/format-currency";
import { Button } from "@/components/_shadcn-ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import { Link } from "@inertiajs/react";
import React from "react";

interface PrincipalDatatableProps {
  principals: any;
}

const PrincipalDatatable: React.FC<PrincipalDatatableProps> = ({ principals }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">#</TableHead>
            <TableHead>Nama Principal</TableHead>
            <TableHead className="text-center">Total Pengajuan Aktif</TableHead>
            <TableHead className="text-right">Total Nilai Jaminan Aktif</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={principals.data}
            render={(principal: any, index: number) => (
              <TableRow key={principal.id}>
                <TableCell>{principals.meta.from + index}</TableCell>
                <TableCell className="font-medium">{principal.name}</TableCell>
                <TableCell className="text-center">{principal.active_submissions_count ?? 0}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(principal.active_guarantee_value_sum ?? 0)}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={route("monitoring.principal.detail", { principal: principal.id })}>
                    <Button variant="outline" size="sm">
                      Detail
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            )}
            renderFallback={() => (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Tidak ada data principal
                </TableCell>
              </TableRow>
            )}
          />
        </TableBody>
      </Table>
      <ShowingCountDatatable meta={principals.meta} />
      <PaginationDatatable meta={principals.meta} />
    </>
  );
};

export default PrincipalDatatable;
