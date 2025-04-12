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
import { Eye, Pencil, Plus, Search, Trash } from "lucide-react";
import CreateUpdateProvinceModal from "../../components/province/create-update-province-modal";
import DeleteProvinceModal from "../../components/province/delete-province-modal";
import DetailProvinceModal from "../../components/province/detail-province-modal";
import useListProvince from "../../hooks/use-list-province";
import useProvinceModal from "../../hooks/use-province-modal";

const ListProvincePage = () => {
  const {
    isOpenDetailProvince,
    handleOpenDetailProvince,
    isOpenCreateProvince,
    handleOpenCreateProvince,
    isOpenUpdateProvince,
    handleOpenUpdateProvince,
    isOpenDeleteProvince,
    handleOpenDeleteProvince,
    selectedProvince,
  } = useProvinceModal();

  const {
    provinces,
    isLoadingProvinces,
    isSuccessProvinces,
    meta,
    search,
    perPage,
    handleSearchChange,
    handlePerPageChange,
    handlePageChange,
  } = useListProvince();

  return (
    <main className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">Provinsi</h1>
        <div className="flex gap-x-3">
          <div className="flex items-center gap-x-2 relative">
            <Search className="w-4 h-4 absolute left-3" />
            <Input
              value={search || ""}
              onChange={handleSearchChange}
              placeholder="Cari Provinsi"
              className="h-10 pl-10"
            />
          </div>
          <PrimaryButton onClick={() => handleOpenCreateProvince(true)}>
            <Plus /> <span>Tambah Provinsi</span>
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
              <TableHead>Kode Provinsi</TableHead>
              <TableHead>Nama Provinsi</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingProvinces && <TableSkeleton colspan={10} />}
            {isSuccessProvinces && provinces && (
              <RenderList
                of={provinces}
                render={(province: any, index) => {
                  return (
                    <TableRow key={province.id}>
                      <TableCell>{(meta?.from ?? 0) + index}</TableCell>
                      <TableCell>{province.code}</TableCell>
                      <TableCell>{province.name}</TableCell>
                      <TableCell className="flex justify-end">
                        <div className="flex gap-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenDetailProvince(true, province)}>
                            <Eye className="w-4 h-4 text-black" />
                          </Button>
                          <Button
                            className="bg-yellow-300 hover:bg-yellow-400"
                            size="icon"
                            onClick={() => handleOpenUpdateProvince(true, province)}>
                            <Pencil className="w-4 h-4 text-black" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleOpenDeleteProvince(true, province)}>
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
        {isSuccessProvinces && meta && <Pagination meta={meta} onPageChange={handlePageChange} />}
      </div>

      {/* Create Province Modal */}
      <CreateUpdateProvinceModal open={isOpenCreateProvince} handleOpen={handleOpenCreateProvince} />

      {/* Update Province Modal */}
      <CreateUpdateProvinceModal
        open={isOpenUpdateProvince}
        handleOpen={handleOpenUpdateProvince}
        province={selectedProvince}
      />

      {/* Delete Province Modal */}
      <DeleteProvinceModal
        open={isOpenDeleteProvince}
        handleOpen={handleOpenDeleteProvince}
        province={selectedProvince}
      />

      {/* Detail Province Modal */}
      <DetailProvinceModal
        open={isOpenDetailProvince}
        handleOpen={handleOpenDetailProvince}
        province={selectedProvince}
      />
    </main>
  );
};

export default ListProvincePage;
