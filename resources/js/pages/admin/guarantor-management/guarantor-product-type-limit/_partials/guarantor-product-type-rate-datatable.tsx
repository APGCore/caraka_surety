import { PaginationDatatable } from "@/components/common/pagination-datatable";
import RenderList from "@/components/common/render-list";
import { ShowingCountDatatable } from "@/components/common/showing-count-datatable";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { textCurrency } from "@/lib/text-currency";
import FormGuarantorProductTypeRate from "@/pages/admin/guarantor-management/guarantor-product-type-limit/_partials/form-guarantor-product-type-rate";
import React, { useState } from "react";

interface GuarantorRateDatatableProps {
  guarantorProductTypes: any;
}

const GuarantorProductTypeRateDatatable: React.FC<GuarantorRateDatatableProps> = ({ guarantorProductTypes }) => {
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<any>();
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kode</TableHead>
            <TableHead>Limit</TableHead>
            <TableHead>Jenis Jaminan</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={guarantorProductTypes?.data}
            render={(guarantorProductType: any) => (
              <TableRow key={guarantorProductType.id}>
                <TableCell>{guarantorProductType.code}</TableCell>
                <TableCell>
                  {guarantorProductType.limit?.limit
                    ? "Rp. " + textCurrency(guarantorProductType.limit?.limit)
                    : "Belum di setting"}
                </TableCell>
                <TableCell>{guarantorProductType.full_name}</TableCell>
                <TableCell className="text-right">
                  <Button
                    className="bg-primary text-destructive-foreground shadow-sm hover:bg-primary/60 px-2 py-1.5 text-sm w-[40%] rounded-sm text-start"
                    onClick={() => {
                      setOpenForm(true);
                      setSelectedData(guarantorProductType);
                    }}>
                    Setting Tarif
                  </Button>
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
      <AlertDialog open={openForm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Setting Limit {selectedData?.full_name}</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini akan setting limit pengajuan</AlertDialogDescription>
          </AlertDialogHeader>
          <FormGuarantorProductTypeRate guarantorProductType={selectedData} closeForm={() => setOpenForm(false)} />
        </AlertDialogContent>
      </AlertDialog>
      <ShowingCountDatatable meta={guarantorProductTypes?.meta} />
      <PaginationDatatable meta={guarantorProductTypes?.meta} only={["profiles"]} />
    </>
  );
};

export default GuarantorProductTypeRateDatatable;
