import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import { Input } from "@/_features/_common/components/_shadcn-ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_features/_common/components/_shadcn-ui/select";
import { Table, TableRow } from "@/_features/_common/components/_shadcn-ui/table";
import { PrimaryButton } from "@/_features/_common/components/button/primary-button";
import { Pagination } from "@/_features/_common/components/datatable/pagination";
import RenderList from "@/_features/_common/components/render-list";
import TableSkeleton from "@/_features/_common/components/skeleton/table";
import { TableBody, TableCell, TableHead, TableHeader } from "@/components/_shadcn-ui/table";
import { Link } from "@inertiajs/react";
import { Eye, Pencil, Plus, Search, Trash } from "lucide-react";
import { useState } from "react";
import CreateUpdateRegencyModal from "../../components/regency/create-update-regency-modal";
import DetailRegencyModal from "../../components/regency/detail-regency-modal";
import useListRegency from "../../hooks/use-list-regency";
import useRegencyModal from "../../hooks/use-regency-modal";

const ListRegencyPage = () => {
  const {
    isOpenCreateRegency,
    handleOpenCreateRegency,
    isOpenUpdateRegency,
    handleOpenUpdateRegency,
    isOpenDeleteRegency,
    handleOpenDeleteRegency,
    isOpenDetailRegency,
    handleOpenDetailRegency,
    selectedRegency,
  } = useRegencyModal();

  const {
    regencies,
    isLoadingRegencies,
    isSuccessRegencies,
    meta,
    search,
    perPage,
    handleSearchChange,
    handlePerPageChange,
    handlePageChange,
  } = useListRegency();

  return (
    <main className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">Kabupaten/Kota</h1>
        <div className="flex gap-x-3">
          <div className="flex items-center gap-x-2 relative">
            <Search className="w-4 h-4 absolute left-3" />
            <Input
              value={search || ""}
              onChange={handleSearchChange}
              placeholder="Cari Kabupaten/Kota"
              className="h-10 pl-10"
            />
          </div>
          <PrimaryButton onClick={() => handleOpenCreateRegency(true)}>
            <Plus /> <span>Tambah Kabupaten/Kota</span>
          </PrimaryButton>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          <Select value={perPage} onValueChange={handlePerPageChange}>
            <SelectTrigger className="w-max h-12">
              <SelectValue placeholder={perPage} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-0">No</TableHead>
              <TableHead>Kode Kabupaten/Kota</TableHead>
              <TableHead>Nama Kabupaten/Kota</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingRegencies && <TableSkeleton colspan={10} />}
            {isSuccessRegencies && regencies && (
              <RenderList
                of={regencies}
                render={(province: any, index) => {
                  return (
                    <TableRow key={province.id}>
                      <TableCell>{(meta?.from ?? 0) + index}</TableCell>
                      <TableCell>{province.code}</TableCell>
                      <TableCell>{province.name}</TableCell>
                      <TableCell className="flex justify-end">
                        <div className="flex gap-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleOpenDetailRegency(true, province)}>
                            <Eye className="w-4 h-4 text-black" />
                          </Button>
                          <Button
                            className="bg-yellow-300 hover:bg-yellow-400"
                            size="icon"
                            onClick={() => handleOpenUpdateRegency(true, province)}>
                            <Pencil className="w-4 h-4 text-black" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleOpenDeleteRegency(true, province)}>
                            <Trash className="w-4 h-4 text-black" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }}
              />
            )}
          </TableBody>
        </Table>
        {isSuccessRegencies && meta && <Pagination meta={meta} onPageChange={handlePageChange} />}
      </div>

      {/* Create Regency Modal */}
      <CreateUpdateRegencyModal open={isOpenCreateRegency} handleOpen={handleOpenCreateRegency} />

      {/* Update Regency Modal */}
      <CreateUpdateRegencyModal
        open={isOpenUpdateRegency}
        handleOpen={handleOpenUpdateRegency}
        regency={selectedRegency}
      />

      {/* Delete Regency Modal */}
      <CreateUpdateRegencyModal
        open={isOpenDeleteRegency}
        handleOpen={handleOpenDeleteRegency}
        regency={selectedRegency}
      />

      {/* Detail Regency Modal */}
      <DetailRegencyModal open={isOpenDetailRegency} handleOpen={handleOpenDetailRegency} regency={selectedRegency} />
    </main>
  );
};

export default ListRegencyPage;
