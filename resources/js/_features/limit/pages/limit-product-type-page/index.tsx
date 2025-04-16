import { Input } from "@/_features/_common/components/_shadcn-ui/input";
import { Search } from "lucide-react";
import useListProductTypeLimit from "../../hooks/use-list-guarantor-product-type-limit";

const LimitProductTypePage = () => {
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
  } = useListProductTypeLimit();

  return (
    <main className="space-y-2.5">
      <div className="flex items-center justify-end">
        <div className="flex gap-x-3">
          <div className="flex items-center gap-x-2 relative">
            <Search className="w-4 h-4 absolute left-3" />
            <Input
              // value={search || ""}
              // onChange={handleSearchChange}
              placeholder="Cari Kecamatan"
              className="h-10 pl-10"
            />
          </div>
        </div>
      </div>
      {/* <div className="flex justify-between items-end">
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
      </div> */}
    </main>
  );
};

export default LimitProductTypePage;
