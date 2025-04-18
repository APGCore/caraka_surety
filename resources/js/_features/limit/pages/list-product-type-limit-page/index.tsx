import { Badge } from "@/_features/_common/components/_shadcn-ui/badge";
import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import { Input } from "@/_features/_common/components/_shadcn-ui/input";
import { Label } from "@/_features/_common/components/_shadcn-ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
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
import Show from "@/_features/_common/components/show";
import TableSkeleton from "@/_features/_common/components/skeleton/table";
import { textCurrency } from "@/_features/_common/utils/text-currency";
import { SelectValue } from "@/components/_shadcn-ui/select";
import RenderList from "@/components/atoms/render-list";
import { JobTypeEnum } from "@/types/job-type-enum";
import { Pencil, Search } from "lucide-react";
import useListProductTypeLimit from "../../hooks/use-list-product-type-limit";

interface LimitProductTypePageProps {
  initialProductId: string;
  initialJobGroup: string;
}

const LimitProductTypePage = ({ initialProductId, initialJobGroup }: LimitProductTypePageProps) => {
  const {
    productTypeLimits,
    isLoadingProductTypeLimits,
    isSuccessProductTypeLimits,
    meta,
    search,
    page,
    perPage,
    handleSearchChange,
    handlePerPageChange,
    handlePageChange,
    products,
    isLoadingProducts,
    isSuccessProducts,
    productId,
    handleProductIdChange,
    jobGroups,
    isSuccessJobGroups,
    isLoadingJobGroups,
    handleJobGroupChange,
    jobGroupSelected,
  } = useListProductTypeLimit({ initialProductId, initialJobGroup });

  return (
    <main className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex gap-x-3 items-end">
          <div className="flex gap-x-3">
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
          </div>
          <div className="flex flex-col gap-[2px]">
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
          <div className="flex flex-col gap-[2px]">
            <Label htmlFor="job_group" className=" pl-1 text-sm font-semibold text-gray-400">
              Kelompok Pekerjaan
            </Label>
            <Select onValueChange={handleJobGroupChange} defaultValue={jobGroupSelected}>
              <SelectTrigger>
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
        </div>
        <div className="flex gap-x-3">
          <div className="flex items-center gap-x-2 relative">
            <Search className="w-4 h-4 absolute left-3" />
            <Input
              value={search || ""}
              onChange={handleSearchChange}
              placeholder="Cari Jenis Produk"
              className="h-10 pl-10"
            />
          </div>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Kode</TableHead>
              <TableHead>Limit</TableHead>
              <TableHead>Limit Turunan</TableHead>
              <TableHead>Jenis Jaminan</TableHead>
              <TableHead>Kelompok Pekerjaan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingProductTypeLimits && <TableSkeleton colspan={10} />}
            {isSuccessProductTypeLimits && productTypeLimits && (
              <RenderList
                of={productTypeLimits}
                render={(productType, index) => {
                  return (
                    <TableRow key={productType.id}>
                      <TableCell>{(meta?.from ?? 0) + index}</TableCell>
                      <TableCell>{productType.code}</TableCell>
                      <TableCell>
                        {productType.limit ? "Rp. " + textCurrency(productType.limit?.limit) : "Belum di setting"}
                      </TableCell>
                      <TableCell>
                        {productType.limit
                          ? "Rp. " + textCurrency(productType.limit?.limit_inherit)
                          : "Belum di setting"}
                      </TableCell>
                      <TableCell>{productType.name}</TableCell>
                      <TableCell>
                        {productType.job_group}
                        <Show when={productType.job_type == JobTypeEnum.CONDITIONAL}>
                          <Badge className="ml-2 bg-blue-400">{productType.job_type}</Badge>
                        </Show>
                      </TableCell>
                      <TableCell className="flex justify-end">
                        <div className="flex gap-x-2">
                          <Button
                            className="bg-yellow-300 hover:bg-yellow-400"
                            size="icon"
                            // onClick={() => handleOpenUpdateDistrict(true, district)}
                          >
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
        {isSuccessProductTypeLimits && meta && <Pagination meta={meta} onPageChange={handlePageChange} />}
      </div>
    </main>
  );
};

export default LimitProductTypePage;
