import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import { formatCurrency } from "@/common/utils/format-currency";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import { InvoiceUtils } from "@/pages/report/invoice/_partials/invoice.utils";
import { Link } from "@inertiajs/react";
import React, { useState } from "react";

interface InvoiceDatatableProps {
  submissions: any;
}

const InvoiceDatatable: React.FC<InvoiceDatatableProps> = ({ submissions }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">NO</TableHead>
            <TableHead>TANGGAL PENGAJUAN</TableHead>
            <TableHead>NO REG BLANGKO</TableHead>
            <TableHead>NO. JAMINAN</TableHead>
            <TableHead>NAMA PRINCIPAL</TableHead>
            <TableHead>NILAI JAMINAN</TableHead>
            <TableHead>PRODUK</TableHead>
            <TableHead>JENIS JAMINAN</TableHead>
            <TableHead>AKSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={submissions?.data}
            render={(submission: any, index: number) => (
              <>
                <TableRow key={submission.id}>
                  <TableCell>{submissions?.meta?.from + index}</TableCell>
                  <TableCell>{submission.created_at}</TableCell>
                  <TableCell>{submission.blank?.number}</TableCell>
                  <TableCell>{submission.no_guarantee}</TableCell>
                  <TableCell>{submission.principal?.name}</TableCell>
                  <TableCell>{formatCurrency(submission.guarantee_value)}</TableCell>
                  <TableCell>{submission.product?.name}</TableCell>
                  <TableCell>{submission.product_type?.name}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild>
                      <Link href={route(InvoiceUtils.link.show, { submission: submission.id })}>Detail</Link>
                    </Button>
                  </TableCell>
                </TableRow>
                {/*<Show when={!!selectedSubmission && selectedSubmission == submission.id}>*/}
                {/*  <TableRow key={"detail-" + submission.id}>*/}
                {/*    <TableCell colSpan={11} className="p-0">*/}
                {/*      <InvoiceDetailDatatable submission={submission} />*/}
                {/*    </TableCell>*/}
                {/*  </TableRow>*/}
                {/*  <TableRow key={"detail-invoice-" + submission.id}>*/}
                {/*    <TableCell colSpan={11} className="p-0">*/}
                {/*      <div className="w-full">*/}
                {/*        <Table>*/}
                {/*          <TableBody>*/}
                {/*            <TableRow>*/}
                {/*              <TableCell align="center" className="align-top bg-blue-300 hover:bg-blue-300 p-2 w-[50%]">*/}
                {/*                <InvoiceOffice officeRate={submission.rate.office_rate} />*/}
                {/*              </TableCell>*/}
                {/*              <TableCell className="bg-orange-300 hover:bg-orange-300 p-2 w-[50%]">*/}
                {/*                <InvoiceGuarantor*/}
                {/*                  guarantorName={submission.guarantor?.name}*/}
                {/*                  guarantorRate={submission.rate.guarantor_rate}*/}
                {/*                />*/}
                {/*              </TableCell>*/}
                {/*            </TableRow>*/}
                {/*            <TableRow className="bg-green-300 hover:bg-green-300 p-2">*/}
                {/*              <TableCell>Selisih Total</TableCell>*/}
                {/*              <TableCell>: {formatCurrency(submission.rate.difference)}</TableCell>*/}
                {/*            </TableRow>*/}
                {/*          </TableBody>*/}
                {/*        </Table>*/}
                {/*      </div>*/}
                {/*    </TableCell>*/}
                {/*  </TableRow>*/}
                {/*</Show>*/}
              </>
            )}
            renderFallback={() => (
              <TableRow>
                <TableCell colSpan={11} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          />
        </TableBody>
      </Table>
      <ShowingCountDatatable meta={submissions?.meta} />
      <PaginationDatatable meta={submissions?.meta} />
    </>
  );
};

export default InvoiceDatatable;
