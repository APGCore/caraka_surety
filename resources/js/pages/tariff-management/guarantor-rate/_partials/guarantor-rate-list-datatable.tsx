import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/_features/_common/components/_shadcn-ui/alert-dialog";
import { Badge } from "@/components/_shadcn-ui/badge";
import { Button } from "@/components/_shadcn-ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import Loading from "@/components/atoms/loading";
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import { GuarantorRateUtils } from "@/pages/tariff-management/guarantor-rate/guarantor-rate.utils";
import { Link, router } from "@inertiajs/react";
import { formatDate } from "date-fns";
import React, { useState } from "react";

interface GuarantorRateListDatatableProps {
  guarantorRates: any;
}

const GuarantorRateListDatatable: React.FC<GuarantorRateListDatatableProps> = ({ guarantorRates }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = (guarantorRateId: number) => {
    setIsLoading(true);
    router.delete(route(GuarantorRateUtils.link.destroy, { guarantorRate: guarantorRateId }), {
      preserveState: true,
      preserveScroll: true,
      onFinish: () => {
        setIsLoading(false);
      },
    });
  };
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
                <TableCell>
                  <div className="flex gap-x-2 justify-end">
                    <Link
                      className="bg-yellow-400 text-black shadow-sm hover:bg-yellow-400/90 px-2 py-1.5 text-sm rounded-sm text-start"
                      href={route(GuarantorRateUtils.link.edit, {
                        guarantorRate: guarantorRate.id,
                      })}>
                      Edit Tarif
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 px-2 py-1.5 text-sm rounded-sm text-start">
                          Hapus Tarif
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 px-2 py-1.5 text-sm rounded-sm text-start"
                            onClick={() => handleDelete(guarantorRate.id)}
                            disabled={isLoading}>
                            <Loading isLoading={isLoading} />
                            Hapus Tarif
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
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
