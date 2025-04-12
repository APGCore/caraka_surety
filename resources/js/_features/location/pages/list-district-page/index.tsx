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
import useListDistrict from "../../hooks/use-list-district";

const ListDistrictPage = () => {
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
          <PrimaryButton asChild>
            <Link
              href={route("branch.create", {
                type: "branch",
              })}>
              <Plus /> <span>Tambah Kecamatan</span>
            </Link>
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
              <TableHead>Kode Kecamatan</TableHead>
              <TableHead>Nama Kecamatan</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingDistricts && <TableSkeleton colspan={10} />}
            {isSuccessDistricts && districts && (
              <RenderList
                of={districts}
                render={(province: any, index) => {
                  return (
                    <TableRow key={province.id}>
                      <TableCell>{(meta?.from ?? 0) + index}</TableCell>
                      <TableCell>{province.code}</TableCell>
                      <TableCell>{province.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-x-2">
                          <Button variant="outline" size="icon">
                            <Eye className="w-4 h-4 text-black" />
                          </Button>
                          <Button className="bg-yellow-300 hover:bg-yellow-400" size="icon">
                            <Pencil className="w-4 h-4 text-black" />
                          </Button>
                          <Button variant="destructive" size="icon">
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
    </main>
  );
};

export default ListDistrictPage;
