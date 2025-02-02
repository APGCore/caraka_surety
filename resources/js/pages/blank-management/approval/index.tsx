import { getQueryParameter } from "@/common/utils/get-query-parameter";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import SearchDatatable from "@/components/common/search-datatable";
import SelectLengthDatatable from "@/components/common/select-length-datatable";
import RoleBasedLayout from "@/layouts/role-based-layout";
import BlankDatatable from "@/pages/blank-management/approval/_partials/blank-datatable";
import BlankForm from "@/pages/blank-management/approval/_partials/blank-form";
import BlankHeader from "@/pages/blank-management/approval/_partials/blank-header";
import { BlankPageProps } from "@/pages/blank-management/approval/blank-page.type";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/_shadcn-ui/select";
import RenderList from "@/components/common/render-list";
import Show from "@/components/common/show";
import { Combobox } from "@/components/common/combobox";

const GuarantorPage: BlankPageProps = ({ blanks, blanks_un_approved, links, offices, officeTypes, officeSelected, officeTypeSelected }) => {
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

    const handleSelectOfficeType = (officeType: string) => {
        getData(select, search, officeType, undefined);
    };

    const handleSelectOffice = (officeId: number) => {
        getData(select, search, officeTypeSelected, officeId);
    };

  const getData = (per_page: string, search: string, office_type?: any, profile_id?: any) => {
    return router.get(
      route(links.index),
      pickBy({
        per_page,
        search,
        office_type,
        profile_id,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          <SelectLengthDatatable defaultValue={select} onChange={handleSelect} />
            <Select onValueChange={(value) => handleSelectOfficeType(value)} defaultValue={String(officeTypeSelected)}>
                <SelectTrigger className="min-w-[160px]">
                    <SelectValue placeholder="Pilih " />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <RenderList
                            of={officeTypes}
                            render={(officeType: string) => <SelectItem value={officeType}>{officeType}</SelectItem>}
                        />
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Show when={officeTypeSelected !== officeTypes[0]}>
                <Combobox
                    datas={offices}
                    labelKey={"name"}
                    valueKey={"name"}
                    defaultValue={officeSelected}
                    placeholder={"Pilih Kantor"}
                    className={"min-w-[160px]"}
                    onSelect={(value) => handleSelectOffice(value.id)}
                />
            </Show>
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
    <RoleBasedLayout user={pagePropsData?.auth?.user}>
      <BlankHeader title={pagePropsData?.page_settings?.title ?? "Blangko"} links={pagePropsData?.links} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route(pagePropsData?.links?.index)}>Kelola Blangko</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {page}
    </RoleBasedLayout>
  );
};
