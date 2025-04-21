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
import CreateUpdateHostToHostModal from "../../components/create-update-host-to-host-modal";
import DeleteHostToHostModal from "../../components/delete-host-to-host-modal";
import DetailHostToHostModal from "../../components/detail-host-to-host-modal";
import useHostToHostList from "../../hooks/use-host-to-host-list";
import useHostToHostModal from "../../hooks/use-host-to-host-modal";

const ListHostToHostPage = () => {
  const {
    isOpenCreateHostToHost,
    handleOpenCreateHostToHost,
    isOpenUpdateHostToHost,
    handleOpenUpdateHostToHost,
    isOpenDeleteHostToHost,
    handleOpenDeleteHostToHost,
    selectedHostToHost,
    isOpenDetailHostToHost,
    handleOpenDetailHostToHost,
  } = useHostToHostModal();

  const {
    hostToHosts,
    meta,
    isLoadingHostToHosts,
    isSuccessHostToHosts,
    handleSearchChange,
    handlePerPageChange,
    handlePageChange,
    perPage,
    page,
    search,
  } = useHostToHostList();

  return (
    <main className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">Host to Host</h1>
        <div className="flex gap-x-3">
          <div className="flex items-center gap-x-2 relative">
            <Search className="w-4 h-4 absolute left-3" />
            <Input
              value={search || ""}
              onChange={handleSearchChange}
              placeholder="Cari Host to Host"
              className="h-10 pl-10"
            />
          </div>
          <PrimaryButton onClick={() => handleOpenCreateHostToHost(true)}>
            <Plus /> <span>Tambah Host to Host</span>
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
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-0">No</TableHead>
              <TableHead>Nama Asuransi</TableHead>
              <TableHead>Alamat Host Asuransi</TableHead>
              <TableHead>Prefix Auth</TableHead>
              <TableHead>Token</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingHostToHosts && <TableSkeleton colspan={6} />}
            {isSuccessHostToHosts && hostToHosts && (
              <RenderList
                of={hostToHosts}
                render={(hostToHost: any, index) => {
                  return (
                    <TableRow key={hostToHost.id}>
                      <TableCell>{(meta?.from ?? 0) + index}</TableCell>
                      <TableCell>{hostToHost?.guarantor_name || "-"}</TableCell>
                      <TableCell>{hostToHost?.guarantor_url_host || "-"}</TableCell>
                      <TableCell>{hostToHost?.auth_prefix || "-"}</TableCell>
                      <TableCell>{hostToHost?.token || "-"}</TableCell>
                      <TableCell className="flex justify-end">
                        <div className="flex gap-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenDetailHostToHost(true, hostToHost)}>
                            <Eye className="w-4 h-4 text-black" />
                          </Button>
                          <Button
                            className="bg-yellow-300 hover:bg-yellow-400"
                            size="icon"
                            onClick={() => handleOpenUpdateHostToHost(true, hostToHost)}>
                            <Pencil className="w-4 h-4 text-black" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleOpenDeleteHostToHost(true, hostToHost)}>
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
        {isSuccessHostToHosts && meta && <Pagination meta={meta} onPageChange={handlePageChange} />}
      </div>

      {/* Create Host to Host Modal */}
      <CreateUpdateHostToHostModal open={isOpenCreateHostToHost} handleOpen={handleOpenCreateHostToHost} />

      {/* Update Host to Host Modal */}
      <CreateUpdateHostToHostModal
        open={isOpenUpdateHostToHost}
        handleOpen={handleOpenUpdateHostToHost}
        hostToHost={selectedHostToHost}
      />

      {/* Delete Host to Host Modal */}
      <DeleteHostToHostModal
        open={isOpenDeleteHostToHost}
        handleOpen={handleOpenDeleteHostToHost}
        hostToHost={selectedHostToHost}
      />

      {/* Detail Host to Host Modal */}
      <DetailHostToHostModal
        open={isOpenDetailHostToHost}
        handleOpen={handleOpenDetailHostToHost}
        hostToHost={selectedHostToHost}
      />
    </main>
  );
};

export default ListHostToHostPage;
