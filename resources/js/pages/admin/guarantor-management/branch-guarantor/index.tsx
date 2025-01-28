import SelectLengthDatatable from "@/components/common/SelectLengthDatatable";
import RoleBasedLayout from "@/components/templates/RoleBasedLayout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/layouts/Admin";
import { getQueryParameter } from "@/lib/get-query-parameter";
import BranchGuarantorDatatable from "@/pages/admin/guarantor-management/branch-guarantor/_partials/branch-guarantor-datatable";
import { BranchGuarantorPageProps } from "@/pages/admin/guarantor-management/branch-guarantor/branch-guarantor-page.type";
import { BranchGuarantorUtils } from "@/pages/admin/guarantor-management/branch-guarantor/branch-guarantor.utils";
import { GuarantorUtils } from "@/pages/admin/guarantor-management/guarantor/guarantor.utils";
import { Head, Link, router } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useState } from "react";

const BranchGuarantorsPage: BranchGuarantorPageProps = ({ branchGuarantors }) => {
  const [select, setSelect] = useState<string>(() => getQueryParameter("per_page") || "10");
  const [search, setSearch] = useState(() => getQueryParameter("search") ?? "");

  const handleSelect = (e: string) => {
    setSelect(e);
    getData(String(select), search);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getData(String(select), search);
  };

  const getData = (per_page: string, search: string) => {
    return router.get(
      route(BranchGuarantorUtils.link.index),
      pickBy({
        per_page,
        search,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-center">
        <div className="flex gap-x-3">
          <SelectLengthDatatable defaultValue={select} onChange={handleSelect} />
        </div>
        <div className="flex gap-x-3">
          <form onSubmit={(e) => handleSearch(e)} className="flex items-end gap-x-3">
            <Input
              className="h-full"
              placeholder="Cari Cabang Asuransi"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit">Cari</Button>
          </form>
        </div>
      </div>
      <BranchGuarantorDatatable branchGuarantors={branchGuarantors} />
    </main>
  );
};

export default BranchGuarantorsPage;

BranchGuarantorsPage.layout = (page: any) => {
  const pagePropsData = page.props;
  const params = { guarantor: pagePropsData.guarantor.id };

  return (
    <RoleBasedLayout user={pagePropsData?.auth?.user}>
      <Head title={pagePropsData?.page_settings?.title ?? "Cabang Asuransi"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route(BranchGuarantorUtils.link.index, params)}>
              {pagePropsData?.page_settings?.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{pagePropsData?.page_settings?.title}</h1>
        <div>
          <Button asChild className="mr-2" variant="outline">
            <Link href={route(GuarantorUtils.link.index)}>Kembali</Link>
          </Button>
          <Button asChild>
            <Link href={route(BranchGuarantorUtils.link.create, params)}>Tambah Cabang Asuransi</Link>
          </Button>
        </div>
      </div>
      {page}
    </RoleBasedLayout>
  );
};
