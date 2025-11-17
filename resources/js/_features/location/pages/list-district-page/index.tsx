import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import { Input } from "@/_features/_common/components/_shadcn-ui/input";
import { Label } from "@/_features/_common/components/_shadcn-ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_features/_common/components/_shadcn-ui/select";
import { Table, TableRow } from "@/_features/_common/components/_shadcn-ui/table";
import { PrimaryButton } from "@/_features/_common/components/button/primary-button";
import NewCombobox from "@/_features/_common/components/combobox";
import { Pagination } from "@/_features/_common/components/datatable/pagination";
import RenderList from "@/_features/_common/components/render-list";
import TableSkeleton from "@/_features/_common/components/skeleton/table";
import { TableBody, TableCell, TableHead, TableHeader } from "@/components/_shadcn-ui/table";
import { Eye, Pencil, Plus, Search, Trash } from "lucide-react";
import CreateUpdateDistrictModal from "../../components/district/create-update-district-modal";
import DeleteDistrictModal from "../../components/district/delete-district-modal";
import DetailDistrictModal from "../../components/district/detail-district-modal";
import useDistrictModal from "../../hooks/use-district-modal";
import useListDistrict from "../../hooks/use-list-district";

const ListDistrictPage = () => {
  const {
    isOpenDetailDistrict,
    handleOpenDetailDistrict,
    isOpenCreateDistrict,
    handleOpenCreateDistrict,
    isOpenUpdateDistrict,
    handleOpenUpdateDistrict,
    isOpenDeleteDistrict,
    handleOpenDeleteDistrict,
    selectedDistrict,
  } = useDistrictModal();

  const {
    districts,
    isLoadingDistricts,
    isSuccessDistricts,
    meta,
    search,
    perPage,
    handleSearchChange,
    handlePerPageChange,
    handlePageChange,
    provinceId,
    setProvinceId,
    regencies,
    isLoadingRegencies,
    regencyId,
    setRegencyId,
    provinces,
    isLoadingProvinces,
  } = useListDistrict();

  return (
    <main className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">Kecamatan</h1>
        <div className="flex gap-x-3">
          <div className="flex items-center gap-x-2 relative">
            <Search className="w-4 h-4 absolute left-3" />
            <Input
              value={search || ""}
              onChange={handleSearchChange}
              placeholder="Cari Kecamatan"
              className="h-10 pl-10"
            />
          </div>
          <PrimaryButton onClick={() => handleOpenCreateDistrict(true)}>
            <Plus /> <span>Tambah Kecamatan</span>
          </PrimaryButton>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3 items-end">
          <Select value={perPage} onValueChange={handlePerPageChange}>
            <SelectTrigger className="w-max">
              <SelectValue placeholder={perPage} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <div>
            <Label htmlFor="province_id" className=" pl-1 text-xs font-semibold uppercase underline underline-offset-2">
              Filter Provinsi
            </Label>
            <NewCombobox
              data={Array.isArray(provinces) ? provinces : []}
              valueKey="id"
              labelKey="name"
              isLoading={isLoadingProvinces}
              placeholder="Pilih Provinsi"
              defaultValue={provinceId ?? undefined}
              onSelect={(val: any) => {
                setProvinceId(val.id);
                setRegencyId("");
              }}
            />
          </div>
          <div>
            <Label htmlFor="regency_id" className=" pl-1 text-xs font-semibold uppercase underline underline-offset-2">
              Filter Kabupaten
            </Label>
            <NewCombobox
              data={Array.isArray(regencies) ? regencies : []}
              valueKey="id"
              labelKey="name"
              isLoading={isLoadingRegencies}
              placeholder="Pilih Kabupaten"
              defaultValue={regencyId ?? undefined}
              onSelect={(val: any) => {
                setRegencyId(val.id);
              }}
            />
          </div>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-0">No</TableHead>
              <TableHead>Kode Kecamatan</TableHead>
              <TableHead>Nama Kecamatan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingDistricts && <TableSkeleton colspan={10} />}
            {isSuccessDistricts && districts && (
              <RenderList
                of={districts}
                render={(district: any, index) => {
                  return (
                    <TableRow key={district.id}>
                      <TableCell>{(meta?.from ?? 0) + index}</TableCell>
                      <TableCell>{district.code}</TableCell>
                      <TableCell>{district.name}</TableCell>
                      <TableCell className="flex justify-end">
                        <div className="flex gap-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenDetailDistrict(true, district)}>
                            <Eye className="w-4 h-4 text-black" />
                          </Button>
                          <Button
                            className="bg-yellow-300 hover:bg-yellow-400"
                            size="icon"
                            onClick={() => handleOpenUpdateDistrict(true, district)}>
                            <Pencil className="w-4 h-4 text-black" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleOpenDeleteDistrict(true, district)}>
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
        {isSuccessDistricts && meta && <Pagination meta={meta} onPageChange={handlePageChange} />}
      </div>

      {/* Create District Modal */}
      <CreateUpdateDistrictModal open={isOpenCreateDistrict} handleOpen={handleOpenCreateDistrict} />

      {/* Update District Modal */}
      <CreateUpdateDistrictModal
        open={isOpenUpdateDistrict}
        handleOpen={handleOpenUpdateDistrict}
        district={selectedDistrict}
      />

      {/* Delete District Modal */}
      <DeleteDistrictModal
        open={isOpenDeleteDistrict}
        handleOpen={handleOpenDeleteDistrict}
        district={selectedDistrict}
      />

      {/* Detail District Modal */}
      <DetailDistrictModal
        open={isOpenDetailDistrict}
        handleOpen={handleOpenDetailDistrict}
        district={selectedDistrict}
      />
    </main>
  );
};

export default ListDistrictPage;
