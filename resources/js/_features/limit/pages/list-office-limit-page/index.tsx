import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import { Input } from "@/_features/_common/components/_shadcn-ui/input";
import { Label } from "@/_features/_common/components/_shadcn-ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_features/_common/components/_shadcn-ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/_features/_common/components/_shadcn-ui/table";
import NewCombobox from "@/_features/_common/components/combobox";
import { Pagination } from "@/_features/_common/components/datatable/pagination";
import RenderList from "@/_features/_common/components/render-list";
import TableSkeleton from "@/_features/_common/components/skeleton/table";
import { Pencil, Search, Trash } from "lucide-react";
import CreateUpdateOfficeLimitModal from "../../components/office-limit/create-update-office-limit-modal";
import DeleteOfficeLimitModal from "../../components/office-limit/delete-office-limit-modal";
import useOfficeLimit from "../../hooks/use-list-office-limit";
import useOfficeLimitModal from "../../hooks/use-office-limit-modal";

const ListOfficeLimitPage = () => {
  const {
    isOpenUpdateOfficeLimit,
    handleOpenUpdateOfficeLimit,
    isOpenDeleteOfficeLimit,
    handleOpenDeleteOfficeLimit,
    selectedOfficeLimit,
    handleOpenCreateOfficeLimit,
    isOpenCreateOfficeLimit,
    handleOpenDetailOfficeLimit,
    isOpenDetailOfficeLimit,
  } = useOfficeLimitModal();

  const {
    officeLimits,
    isLoadingOfficeLimits,
    isSuccessOfficeLimits,
    meta,
    handlePageChange,
    productId,
    productTypeId,
    officeType,
    products,
    productTypes,
    jobGroups,
    search,
    perPage,
    handlePerPageChange,
    handleSearchChange,
    isLoadingJobGroups,
    isLoadingProducts,
    isLoadingProductTypes,
    isSuccessProductTypes,
    isSuccessProducts,
    isSuccessJobGroups,
    jobGroup,
    handleJobGroupChange,
    handleProductIdChange,
    handleProductTypeIdChange,
    handleOfficeTypeChange,
    officeTypes,
    isLoadingOfficeTypes,
    isSuccessOfficeTypes,
  } = useOfficeLimit({
    initialProductId: "1",
    initialProductTypeId: "1",
    initialJobGroup: "Konstruksi",
    initialOfficeType: "Kantor Cabang",
  });

  return (
    <main className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">Limit Unit Kantor</h1>
        <div className="flex gap-x-3">
          <div className="flex items-center gap-x-2 relative">
            <Search className="w-4 h-4 absolute left-3" />
            <Input
              value={search || ""}
              onChange={handleSearchChange}
              placeholder="Cari Kantor"
              className="h-10 pl-10"
            />
          </div>
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
          <div className="flex flex-col gap-1">
            <Label htmlFor="product_id" className=" pl-1 text-sm font-semibold text-gray-400">
              Produk
            </Label>
            <NewCombobox
              data={Array.isArray(products) ? products : []}
              valueKey="id"
              labelKey="name"
              isLoading={isLoadingProducts}
              placeholder="Pilih Produk"
              defaultValue={productId}
              onSelect={(val: any) => {
                handleProductIdChange(val.id);
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="product_type_id" className=" pl-1 text-sm font-semibold text-gray-400">
              Jenis Produk
            </Label>
            <NewCombobox
              data={Array.isArray(productTypes) ? productTypes : []}
              valueKey="id"
              labelKey="name"
              isLoading={isLoadingProductTypes}
              placeholder="Pilih Jenis Produk"
              defaultValue={productTypeId}
              onSelect={(val: any) => {
                handleProductTypeIdChange(val.id);
              }}
            />
          </div>
          <div className="flex flex-col gap-[2px]">
            <Label htmlFor="job_group" className=" pl-1 text-sm font-semibold text-gray-400">
              Kelompok Pekerjaan
            </Label>
            <Select onValueChange={handleJobGroupChange} defaultValue={jobGroup} disabled={isLoadingJobGroups}>
              <SelectTrigger className="min-w-[148px]">
                <SelectValue placeholder="Pilih Kelompok Pekarjaan" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <RenderList
                    of={jobGroups ?? []}
                    render={(jobGroup: any) => <SelectItem value={jobGroup.id}>{jobGroup.name}</SelectItem>}
                  />
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-[2px]">
            <Label htmlFor="office_type" className=" pl-1 text-sm font-semibold text-gray-400">
              Jenis Kantor
            </Label>
            <Select onValueChange={handleOfficeTypeChange} defaultValue={officeType} disabled={isLoadingOfficeTypes}>
              <SelectTrigger className="min-w-[152px]">
                <SelectValue placeholder="Pilih Jenis Kantor" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <RenderList
                    of={officeTypes ?? []}
                    render={(officeType: any, idx) => <SelectItem value={officeType}>{officeType}</SelectItem>}
                  />
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-0">No</TableHead>
              <TableHead>Kantor</TableHead>
              <TableHead>Limit</TableHead>
              <TableHead>Limit Turunan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingOfficeLimits && <TableSkeleton colspan={5} />}
            {isSuccessOfficeLimits && officeLimits?.profiles && (
              <RenderList
                of={officeLimits.profiles}
                render={(office: any, index) => {
                  return (
                    <TableRow key={office.id}>
                      <TableCell>{(meta?.from ?? 0) + index}</TableCell>
                      <TableCell>{office?.office_name || "-"}</TableCell>
                      <TableCell>{office?.limit || "-"}</TableCell>
                      <TableCell>{office?.limit_inherit || "-"}</TableCell>
                      <TableCell className="flex justify-end">
                        <div className="flex gap-x-2">
                          <Button
                            className="bg-yellow-300 hover:bg-yellow-400"
                            size="icon"
                            onClick={() => {
                              const concatData = {
                                ...(officeLimits ? officeLimits?.guarantorProductTypeLimit : {}),
                                ...office,
                              };
                              handleOpenUpdateOfficeLimit(true, concatData);
                            }}>
                            <Pencil className="w-4 h-4 text-black" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              const concatData = {
                                ...(officeLimits ? officeLimits?.guarantorProductTypeLimit : {}),
                                ...office,
                              };
                              handleOpenDeleteOfficeLimit(true, concatData);
                            }}>
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
        {isSuccessOfficeLimits && meta && <Pagination meta={meta} onPageChange={handlePageChange} />}
      </div>

      {/* Create Office Limit Modal */}
      <CreateUpdateOfficeLimitModal open={isOpenCreateOfficeLimit} handleOpen={handleOpenCreateOfficeLimit} />

      {/* Update Office Limit Modal */}
      <CreateUpdateOfficeLimitModal
        open={isOpenUpdateOfficeLimit}
        handleOpen={handleOpenUpdateOfficeLimit}
        officeLimit={selectedOfficeLimit}
      />

      {/* Delete Office Limit Modal */}
      {/* <DeleteOfficeLimitModal
        open={isOpenDeleteOfficeLimit}
        handleOpen={handleOpenDeleteOfficeLimit}
        officeLimit={selectedOfficeLimit}
      /> */}

      {/* Detail Host to Host Modal */}
      {/* <DetailHostToHostModal
        open={isOpenDetailHostToHost}
        handleOpen={handleOpenDetailHostToHost}
        hostToHost={selectedHostToHost}
      /> */}
    </main>
  );
};

export default ListOfficeLimitPage;
