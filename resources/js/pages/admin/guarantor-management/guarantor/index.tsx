import { getQueryParameter } from "@/common/utils/get-query-parameter";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import { Button } from "@/components/_shadcn-ui/button";
import { Input } from "@/components/_shadcn-ui/input";
import SelectLengthDatatable from "@/components/molecules/datatable/row-length";
import RoleBasedLayout from "@/layouts/role-based-layout";
import GuarantorDatatable from "@/pages/admin/guarantor-management/guarantor/_partials/guarantor-datatable";
import { GuarantorPageProps } from "@/pages/admin/guarantor-management/guarantor/guarantor-page.type";
import { GuarantorUtils } from "@/pages/admin/guarantor-management/guarantor/guarantor.utils";
import { Head, Link, router } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useState } from "react";

const GuarantorPage: GuarantorPageProps = ({ guarantors }) => {
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
      route(GuarantorUtils.link.index),
      pickBy({
        per_page,
        search,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          <SelectLengthDatatable defaultValue={select} onChange={handleSelect} />
        </div>
        <div className="flex gap-x-3">
          <form onSubmit={(e) => handleSearch(e)} className="flex items-end gap-x-3">
            <Input
              className="h-full"
              placeholder="Cari Asuransi"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit">Cari</Button>
          </form>
        </div>
      </div>
      <GuarantorDatatable guarantors={guarantors} />
    </main>
  );
};

export default GuarantorPage;

GuarantorPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <Head title={pagePropsData?.page_settings?.title ?? "Asuransi"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route(GuarantorUtils.link.index)}>Kelola Asuransi</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{pagePropsData?.page_settings?.title}</h1>
        <Button asChild>
          <Link href={route(GuarantorUtils.link.create)}>Tambah Asuransi</Link>
        </Button>
      </div>
      {page}
    </RoleBasedLayout>
  );
};
