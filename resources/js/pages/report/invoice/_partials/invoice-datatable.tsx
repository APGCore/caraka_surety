import { PaginationDatatable } from "@/components/common/pagination-datatable";
import RenderList from "@/components/common/render-list";
import Show from "@/components/common/show";
import { ShowingCountDatatable } from "@/components/common/showing-count-datatable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useState } from "react";

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
            <TableHead>NO REG BLANGKO</TableHead>
            <TableHead>NO. JAMINAN</TableHead>
            <TableHead>NAMA PRINCIPAL</TableHead>
            <TableHead>OBLIGEE</TableHead>
            <TableHead>PROJECT</TableHead>
            <TableHead>NILAI JAMINAN</TableHead>
            <TableHead>AWAL</TableHead>
            <TableHead>AKHIR</TableHead>
            <TableHead>HARI ASURANSI</TableHead>
            <TableHead>HARI CABANG</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={submissions?.data}
            render={(submission: any, index: number) => (
              <>
                <TableRow key={submission.id} onClick={() => handleDetail(submission.id)} className={"cursor-pointer"}>
                  <TableCell>{submissions?.meta?.from + index}</TableCell>
                  <TableCell>{submission.blank?.number}</TableCell>
                  <TableCell>{submission.no_guarantee}</TableCell>
                  <TableCell>{submission.principal?.name}</TableCell>
                  <TableCell>{submission.obligee?.name}</TableCell>
                  <TableCell>{submission.job_name}</TableCell>
                  <TableCell>{submission.guarantee_value}</TableCell>
                  <TableCell>{submission.start_date}</TableCell>
                  <TableCell>{submission.end_date}</TableCell>
                  <TableCell>{submission.time_period} Hari</TableCell>
                  <TableCell>{submission.time_period + 1} Hari</TableCell>
                </TableRow>
                <Show when={!!selectedSubmission && selectedSubmission == submission.id}>
                  <TableRow key={"detail-" + submission.id} className={"bg-blue-400 hover:bg-blue-400"}>
                    <TableCell colSpan={11}></TableCell>
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
