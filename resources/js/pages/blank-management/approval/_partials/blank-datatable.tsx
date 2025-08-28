import { Badge } from "@/components/_shadcn-ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import Show from "@/components/atoms/show";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import React from "react";

interface BlankDatatableProps {
  blanks: any;
}

const BlankDatatable: React.FC<BlankDatatableProps> = ({ blanks }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">#</TableHead>
            <TableHead>Kode</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal Dibuat</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {blanks?.data?.length > 0 ? (
            blanks?.data?.map((blank: any, index: number) => (
              <TableRow key={blank.id}>
                <TableCell>{blanks?.meta.from + index}</TableCell>
                <TableCell>{blank.number}</TableCell>
                <TableCell className="space-x-1">
                  <Show when={blank.is_picked}>
                    <Badge className="text-white bg-gray-400">Dipakai Pengajuan</Badge>
                  </Show>
                  <Show when={blank.is_used}>
                    <Badge className="text-white bg-yellow-400">Sudah digunakan</Badge>
                  </Show>
                  <Show when={!blank.is_used}>
                    <Badge className="text-white bg-blue-400">Belum digunakan</Badge>
                  </Show>
                  <Show when={blank.is_broken}>
                    <Badge className="text-white bg-red-400">Rusak</Badge>
                  </Show>
                  <Show when={!blank.is_broken}>
                    <Badge className="text-white bg-green-400">Baik</Badge>
                  </Show>
                  <Show when={blank.is_approved}>
                    <Badge className="text-white bg-green-400">Sudah Diterima</Badge>
                  </Show>
                  <Show when={!blank.is_approved}>
                    <Badge className="text-white bg-yellow-400">Belum Diterima</Badge>
                  </Show>
                  <Show when={blank.from_profile_id}>
                    <Badge className="text-white bg-blue-400">Di Transfer Dari {blank.from_profile?.name}</Badge>
                  </Show>
                </TableCell>
                <TableCell>{blank.created_at}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ShowingCountDatatable meta={blanks?.meta} />
      <PaginationDatatable meta={blanks?.meta} />
    </>
  );
};

export default BlankDatatable;
