import { getQueryParameter } from "@/common/utils/get-query-parameter";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/_shadcn-ui/alert-dialog";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/_shadcn-ui/breadcrumb";
import { Button, buttonVariants } from "@/components/_shadcn-ui/button";
import { Input } from "@/components/_shadcn-ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/_shadcn-ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import RoleBasedLayout from "@/layouts/role-based-layout";
import HostToHostCreate from "@/pages/admin/host-to-host-management/host-to-host/_partials/create";
import HostToHostEdit from "@/pages/admin/host-to-host-management/host-to-host/_partials/edit";
import { HostToHostUtils } from "@/pages/admin/host-to-host-management/host-to-host/_partials/host-to-host.utils";
import { Head, router } from "@inertiajs/react";
import { TrashIcon } from "@radix-ui/react-icons";
import { pickBy } from "lodash";
import { useState } from "react";
import { ListHostToHostPageProps } from "./list-host-to-host-page.type";

const ListHostToHost: ListHostToHostPageProps = (props) => {
    const { data: hostToHosts, meta } = props.hostToHosts;

    const [select, setSelect] = useState(() =>
        getQueryParameter("per_page") ? Number(getQueryParameter("per_page")) : 10,
    );
    const [search, setSearch] = useState(() => getQueryParameter("search") ?? "");
    const handleSelect = (e: string) => {
        setSelect(Number(e));
        getData(e, search);
    };

    const handleSearchNew = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        getData(String(select), search);
    };

    const getData = (perPage: string, search: string) => {
        return router.get(
            route(HostToHostUtils.link.index),
            pickBy({
                per_page: perPage,
                search,
            }),
            { preserveState: true, preserveScroll: true },
        );
    };

    const deleteData = (hostToHost: any) => {
        router.delete(route(HostToHostUtils.link.destroy, hostToHost.id));
    };

    return (
        <main className="space-y-2.5">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-3xl">Host to Host</h1>
                <div className="flex gap-x-3">
                    <HostToHostCreate />
                </div>
            </div>

            <div className="flex justify-between items-end">
                <div className="flex gap-x-3">
                    <Button>Export</Button>
                    <Select onValueChange={(e) => handleSelect(e)} defaultValue={String(select)}>
                        <SelectTrigger className="w-max">
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-x-3">
                    <form onSubmit={(e) => handleSearchNew(e)} className="flex items-end gap-x-3">
                        <Input placeholder="Cari Asuransi" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <Button type="submit">Cari</Button>
                    </form>
                </div>
            </div>
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-0">#</TableHead>
                            <TableHead>Nama Asuransi</TableHead>
                            <TableHead>Alamat Host Asuransi</TableHead>
                            <TableHead>Prefix Auth</TableHead>
                            <TableHead>Token</TableHead>
                            <TableHead>Terakhir Di Akses</TableHead>
                            <TableHead>Tanggal Dibuat</TableHead>
                            <TableHead className="text-right" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {hostToHosts.length > 0 ? (
                            <RenderList
                                of={hostToHosts}
                                render={(hostToHost: any, index: number) => (
                                    <TableRow key={hostToHost.id}>
                                        <TableCell>{meta.from + index}</TableCell>
                                        <TableCell>{hostToHost?.guarantor_name}</TableCell>
                                        <TableCell>{hostToHost?.guarantor_url_host}</TableCell>
                                        <TableCell>{hostToHost?.auth_prefix}</TableCell>
                                        <TableCell>{hostToHost?.token}</TableCell>
                                        <TableCell>{hostToHost?.accessed_at}</TableCell>
                                        <TableCell>{hostToHost?.created_at}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-x-2">
                                                <HostToHostEdit hostToHost={hostToHost} />
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive">
                                                            <TrashIcon />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Apakah Anda benar-benar yakin?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Tindakan ini akan menghapus data, apakah anda yakin?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => {
                                                                    deleteData(hostToHost);
                                                                }}
                                                                className={buttonVariants({ variant: "destructive" })}>
                                                                Lanjutkan Hapus
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            />
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    No data found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <ShowingCountDatatable meta={meta} />
            <PaginationDatatable meta={meta} />
        </main>
    );
};

export default ListHostToHost;

ListHostToHost.layout = (page: any) => {
    const pagePropsData = page.props;

    return (
        <RoleBasedLayout propsData={pagePropsData}>
            <Head title={pagePropsData?.page_settings?.title} />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>{pagePropsData?.page_settings?.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            {page}
        </RoleBasedLayout>
    );
};
