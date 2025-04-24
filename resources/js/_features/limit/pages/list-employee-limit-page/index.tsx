import { Button } from "@/_features/_common/components/_shadcn-ui/button";
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
import { Input } from "@/components/_shadcn-ui/input";
import { Pencil, Search } from "lucide-react";
import CreateUpdateEmployeeLimitModal from "../../components/employee-limit/create-update-employee-limit-modal";
import useEmployeeLimitModal from "../../hooks/use-employee-limit-modal";
import useListEmployeeLimit from "../../hooks/use-list-employee-limit";

const formatRupiah = (value: number | string | null | undefined) => {
  if (!value) return "Belum diatur";
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

type OfficeType = "Kantor Pusat" | "Kantor Cabang" | "Mitra Agen" | "Mitra Pemasaran";

const ListEmployeeLimitPage = () => {
  const { isOpenUpdateEmployeeLimit, handleOpenUpdateEmployeeLimit, selectedEmployeeLimit } = useEmployeeLimitModal();

  const {
    // Employee Limit
    employeeLimits,
    isLoadingEmployeeLimits,
    isSuccessEmployeeLimits,

    // Search
    search,
    handleSearchChange,
    perPage,
    handlePerPageChange,
    handlePageChange,

    // Product
    productId,
    products,
    isLoadingProducts,
    isSuccessProducts,
    handleProductIdChange,

    // Product type id
    productTypeId,
    productTypes,
    isLoadingProductTypes,
    isSuccessProductTypes,
    handleProductTypeIdChange,

    // Job group
    jobGroup,
    jobGroups,
    isLoadingJobGroups,
    isSuccessJobGroups,
    handleJobGroupChange,

    // Office type
    officeType,
    officeTypes,
    isLoadingOfficeTypes,
    isSuccessOfficeTypes,
    handleOfficeTypeChange,

    // Office id
    officeId,
    offices,
    isLoadingOffices,
    isSuccessOffices,
    handleOfficeIdChange,

    // Meta
    meta,
  } = useListEmployeeLimit({
    initialProductId: "1",
    initialProductTypeId: "1",
    initialJobGroup: "Konstruksi",
    initialOfficeType: "Kantor Pusat",
    initialOfficeId: "1",
  });

  return (
    <main className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Limit Karyawan</h1>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-48 text-sm font-medium text-muted-foreground">Jenis Produk</span>
              <span className="text-sm">:</span>
              <span className="text-sm font-bold">
                {employeeLimits?.profileLimit?.product_type_name || "Belum diatur"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-48 text-sm font-medium text-muted-foreground">Limit Total Kantor</span>
              <span className="text-sm">:</span>
              <span className="text-sm font-bold">
                {employeeLimits?.profileLimit ? formatRupiah(employeeLimits?.profileLimit?.limit) : "Belum diatur"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-48 text-sm font-medium text-muted-foreground">Limit Total Turunan Kantor</span>
              <span className="text-sm">:</span>
              <span className="text-sm font-bold">
                {employeeLimits?.profileLimit
                  ? formatRupiah(employeeLimits?.profileLimit?.limit_inherit)
                  : "Belum diatur"}
              </span>
            </div>
          </div>
        </div>
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
                    of={jobGroups as any[]}
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
            <Select
              onValueChange={(e) => {
                if (e === "Kantor Pusat") {
                  handleOfficeIdChange("1");
                }

                handleOfficeTypeChange(e as OfficeType);
              }}
              defaultValue={officeType}
              disabled={isLoadingOfficeTypes}>
              <SelectTrigger className="min-w-[152px]">
                <SelectValue placeholder="Pilih Jenis Kantor" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <RenderList
                    of={officeTypes as any[]}
                    render={(officeType: any, idx) => <SelectItem value={officeType}>{officeType}</SelectItem>}
                  />
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {officeType !== "Kantor Pusat" && (
            <div className="flex flex-col gap-1">
              <Label htmlFor="office_id" className=" pl-1 text-sm font-semibold text-gray-400">
                Kantor
              </Label>
              <NewCombobox
                className="min-w-[152px]"
                data={Array.isArray(offices) ? offices : []}
                valueKey="id"
                labelKey="name"
                isLoading={isLoadingOffices}
                placeholder="Pilih Kantor"
                defaultValue={officeId}
                onSelect={(val: any) => {
                  handleOfficeIdChange(val.id);
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-0">No</TableHead>
              <TableHead>Nama Karyawan</TableHead>
              <TableHead>Limit</TableHead>
              <TableHead>Limit Turunan</TableHead>
              <TableHead>Kelompok Pekerjaan</TableHead>
              <TableHead>Jenis Produk</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingEmployeeLimits && <TableSkeleton colspan={6} />}
            {isSuccessEmployeeLimits && (
              <RenderList
                of={employeeLimits?.employees}
                render={(employee: any, index) => {
                  return (
                    <TableRow key={index + 1}>
                      <TableCell>{(meta?.from ?? 0) + index}</TableCell>
                      <TableCell>{employee?.name || "Belum diatur"}</TableCell>
                      <TableCell>
                        {employee?.employee_limit?.limit
                          ? formatRupiah(employee?.employee_limit?.limit)
                          : "Belum diatur"}
                      </TableCell>
                      <TableCell>
                        {employee?.employee_limit?.limit_inherit
                          ? formatRupiah(employee?.employee_limit?.limit_inherit)
                          : "Belum diatur"}
                      </TableCell>
                      <TableCell>{jobGroup || "Belum diatur"}</TableCell>
                      <TableCell>{employeeLimits?.profileLimit?.product_type_name || "Belum diatur"}</TableCell>
                      <TableCell className="flex justify-end">
                        <div className="flex gap-x-2">
                          <Button
                            className="bg-yellow-300 hover:bg-yellow-400"
                            size="icon"
                            onClick={() => {
                              const concatData = {
                                // ...(employeeLimits?.profileLimit ? employeeLimits?.profileLimit : {}),
                                // ...employee,
                                employee_limit_id: employee?.employee_limit?.id || null,
                                product_id: productId,
                                product_type_id: productTypeId,
                                job_group: jobGroup,
                                office_id: officeId,
                                employee_id: employee?.id,
                                limit: employee?.employee_limit?.limit || 0,
                                limit_inherit: employee?.employee_limit?.limit_inherit || 0,
                              };

                              console.log({
                                ...employeeLimits?.profileLimit,
                                ...employee,
                              });

                              handleOpenUpdateEmployeeLimit(true, concatData);
                            }}>
                            <Pencil className="w-4 h-4 text-black" />
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
        {isSuccessEmployeeLimits && meta && <Pagination meta={meta} onPageChange={handlePageChange} />}
      </div>

      {/* Update Office Limit Modal */}
      <CreateUpdateEmployeeLimitModal
        open={isOpenUpdateEmployeeLimit}
        handleOpen={handleOpenUpdateEmployeeLimit}
        employeeLimit={selectedEmployeeLimit}
      />
      {/* <CreateUpdateOfficeLimitModal
      open={isOpenUpdateOfficeLimit}
      handleOpen={handleOpenUpdateOfficeLimit}
      officeLimit={selectedOfficeLimit}
    /> */}
    </main>
  );
};

export default ListEmployeeLimitPage;
