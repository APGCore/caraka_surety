import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/_features/_common/components/_shadcn-ui/alert-dialog";
import { Button } from "@/components/_shadcn-ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import Loading from "@/components/atoms/loading";
import RenderList from "@/components/atoms/render-list";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import { OfficeRateUtils } from "@/pages/tariff-management/office-rate/office-rate.utils";
import { Link, router } from "@inertiajs/react";
import { formatDate } from "date-fns";
import React, { useState } from "react";

interface OfficeRateDatatableProps {
  profileRates: any;
}

const OfficeRateDatatable: React.FC<OfficeRateDatatableProps> = ({ profileRates }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = (profileRateId: number) => {
    setIsLoading(true);
    router.delete(route(OfficeRateUtils.link.destroy, { profileRate: profileRateId }), {
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
            of={profileRates?.data}
            render={(profileRate: any, index: number) => (
              <TableRow key={profileRate.id}>
                <TableCell>{profileRates?.meta?.from + index}</TableCell>
                <TableCell>
                  {profileRate.effective_at ? formatDate(profileRate.effective_at, "dd MMMM yyyy") : "-"}
                </TableCell>
                <TableCell>{profileRate.selling_rate} %</TableCell>
                <TableCell className="flex gap-x-2 justify-end">
                  <Link
                    className="bg-yellow-400 text-black shadow-sm hover:bg-yellow-400/90 px-2 py-1.5 text-sm rounded-sm text-start"
                    href={route(OfficeRateUtils.link.edit, {
                      profileRate: profileRate.id,
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
                          onClick={() => handleDelete(profileRate.id)}
                          disabled={isLoading}>
                          <Loading isLoading={isLoading} />
                          Hapus Tarif
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
      <ShowingCountDatatable meta={profileRates?.meta} />
      <PaginationDatatable meta={profileRates?.meta} />
    </>
  );
};

export default OfficeRateDatatable;
