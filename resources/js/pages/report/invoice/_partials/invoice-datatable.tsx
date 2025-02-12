import { formatCurrency } from "@/common/utils/format-currency";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import InvoiceCentralOffice from "@/pages/report/invoice/_partials/invoice-central-office";
import InvoiceDetailDatatable from "@/pages/report/invoice/_partials/invoice-detail-datatable";
import InvoiceGuarantor from "@/pages/report/invoice/_partials/invoice-guarantor";
import React, { useState } from "react";
import InvoiceBranchOffice from "./invoice-branch-office";

interface InvoiceDatatableProps {
  submissions: any;
}

const InvoiceDatatable: React.FC<InvoiceDatatableProps> = ({ submissions }) => {
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);
  const handleDetail = (submission: number) => {
    if (!selectedSubmission) {
      setSelectedSubmission(submission);
    } else if (selectedSubmission == submission) {
      setSelectedSubmission(null);
    } else {
      setSelectedSubmission(submission);
    }
  };
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
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={submissions?.data}
            render={(submission: any, index: number) => (
              <>
                <TableRow key={submission.id} onClick={() => handleDetail(submission.id)} className={"cursor-pointer"}>
                  <TableCell>{submissions?.meta?.from + index}</TableCell>
                  <TableCell>{submission.created_at}</TableCell>
                  <TableCell>{submission.blank?.number}</TableCell>
                  <TableCell>{submission.no_guarantee}</TableCell>
                  <TableCell>{submission.principal?.name}</TableCell>
                  <TableCell>{formatCurrency(submission.guarantee_value)}</TableCell>
                  <TableCell>{submission.product?.name}</TableCell>
                  <TableCell>{submission.product_type?.name}</TableCell>
                </TableRow>
                <Show when={!!selectedSubmission && selectedSubmission == submission.id}>
                  <TableRow key={"detail-" + submission.id}>
                    <TableCell colSpan={11} className="p-0">
                      <InvoiceDetailDatatable submission={submission} />
                    </TableCell>
                  </TableRow>
                  <TableRow key={"detail-invoice-" + submission.id}>
                    <TableCell colSpan={11} className="p-0">
                      <div className="flex align-center w-full">
                        <div className="bg-orange-300 hover:bg-orange-300 p-2 w-full">
                          <InvoiceCentralOffice centralOfficeRate={submission.central_office_rate} />
                        </div>
                        <Show when={submission.branch_office_rate}>
                          <div className="bg-blue-300 hover:bg-blue-300 p-2 w-full">
                            <InvoiceBranchOffice
                              branchName={submission.staff.office}
                              branchOfficeRate={submission.branch_office_rate}
                            />
                          </div>
                        </Show>
                        <div className="bg-green-300 hover:bg-green-300 p-2 w-full">
                          <InvoiceGuarantor
                            guarantorName={submission.guarantor?.name}
                            guarantorRate={submission.guarantor_rate}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </Show>
              </>
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
      <ShowingCountDatatable meta={submissions?.meta} />
      <PaginationDatatable meta={submissions?.meta} />
    </>
  );
};

export default InvoiceDatatable;
