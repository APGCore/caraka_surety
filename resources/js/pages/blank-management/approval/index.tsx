import SearchDatatable from "@/components/common/search-datatable";
import SelectLengthDatatable from "@/components/common/SelectLengthDatatable";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import MainLayoutPage from "@/layouts/MainLayoutPage";
import { getQueryParameter } from "@/lib/get-query-parameter";
import BlankDatatable from "@/pages/blank-management/approval/_partials/blank-datatable";
import BlankForm from "@/pages/blank-management/approval/_partials/blank-form";
import BlankHeader from "@/pages/blank-management/approval/_partials/blank-header";
import { BlankPageProps } from "@/pages/blank-management/approval/blank-page.type";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useState } from "react";

const GuarantorPage: BlankPageProps = ({ blanks, blanks_un_approved, links }) => {
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
      route(links.index),
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
          <SearchDatatable value={search} onChange={setSearch} onSubmit={handleSearch} placeholder="Cari Blangko" />
          <BlankForm blanksUnApproved={blanks_un_approved} links={links} />
        </div>
      </div>
      <BlankDatatable blanks={blanks} />
    </main>
  );
};

export default GuarantorPage;

GuarantorPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <MainLayoutPage user={pagePropsData?.auth?.user} roles={pagePropsData?.roles}>
      <BlankHeader title={pagePropsData?.page_settings?.title ?? "Blangko"} links={pagePropsData?.links} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route(pagePropsData?.links?.index)}>Kelola Blangko</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {page}
    </MainLayoutPage>
  );
};
