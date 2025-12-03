import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import { Checkbox } from "@/_features/_common/components/_shadcn-ui/checkbox";
import Show from "@/_features/_common/components/show";
import { formatCurrency } from "@/common/utils/format-currency";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import { InvoiceUtils } from "@/pages/report/invoice/_partials/invoice.utils";
import { SubmissionStatus } from "@/types/submission-status";
import { Link } from "@inertiajs/react";
import React from "react";

interface InvoiceDatatableProps {
  submissions: any;
  submissionIds: any[];
  checkAll: boolean;
  submissionChecked: any[];
  setSubmissionChecked: (ids: any[]) => void;
}

const InvoiceDatatable: React.FC<InvoiceDatatableProps> = ({
  submissions,
  submissionIds,
  checkAll,
  submissionChecked,
  setSubmissionChecked,
}) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">
              <Checkbox
                type="button"
                checked={checkAll}
                onCheckedChange={(checked: boolean) => {
                  if (checked) {
                    setSubmissionChecked(Array.from(new Set([...submissionChecked, ...submissionIds])));
                  } else {
                    setSubmissionChecked([]);
                  }
                }}
                disabled={!submissions?.data?.length}
              />
            </TableHead>
            <TableHead className="w-0">NO</TableHead>
            <TableHead>Unit Bisnis</TableHead>
            <TableHead className="text-center">NO REG BLANGKO</TableHead>
            <TableHead>NO. JAMINAN</TableHead>
            <TableHead>NAMA PRINCIPAL</TableHead>
            <TableHead>NILAI JAMINAN</TableHead>
            <TableHead>PRODUK</TableHead>
            <TableHead>JENIS JAMINAN</TableHead>
            <TableHead>TANGGAL DIBUAT</TableHead>
            <TableHead>TANGGAL APPROVED</TableHead>
            <TableHead>TANGGAL KIRIM ASURANSI</TableHead>
            <TableHead>AKSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={submissions?.data}
            render={(submission: any, index: number) => (
              <>
                <TableRow key={submission.id}>
                  <TableCell className="w-0">
                    <Checkbox
                      type="button"
                      checked={submissionChecked.includes(submission.id)}
                      onCheckedChange={(checked: boolean) => {
                        if (checked) {
                          setSubmissionChecked([...submissionChecked, submission.id]);
                        } else {
                          setSubmissionChecked(submissionChecked.filter((id) => id !== submission.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{submissions?.meta?.from + index}</TableCell>
                  <TableCell>{submission.office?.name}</TableCell>
                  <TableCell className="text-center">
                    {submission.blank?.number}
                    <Show when={submission.status === SubmissionStatus.REVISED}>
                      <p
                        className={`mt-2 py-1 uppercase text-xs font-semibold rounded text-center bg-yellow-100 text-yellow-800`}>
                        Di Revisi
                      </p>
                    </Show>
                    <Show when={submission.submission_before_id}>
                      <p
                        className={`mt-2 py-1 uppercase text-xs font-semibold rounded text-center bg-yellow-100 text-yellow-800`}>
                        Revisi dari {submission.submission_before?.blank?.number}
                      </p>
                    </Show>
                  </TableCell>
                  <TableCell>{submission.no_guarantee}</TableCell>
                  <TableCell>{submission.principal?.name ?? "-"}</TableCell>
                  <TableCell>{formatCurrency(submission.guarantee_value)}</TableCell>
                  <TableCell>{submission.product?.name ?? "-"}</TableCell>
                  <TableCell>{submission.product_type?.full_name ?? "-"}</TableCell>
                  <TableCell>{submission.created_at}</TableCell>
                  <TableCell>{submission.approved_at}</TableCell>
                  <TableCell>{submission.send_to_guarantor_at ?? "-"}</TableCell>
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
