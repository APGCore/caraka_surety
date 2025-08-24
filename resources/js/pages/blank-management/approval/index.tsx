import { getQueryParameter } from "@/common/utils/get-query-parameter";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import { Combobox } from "@/components/molecules/combobox";
import SelectLengthDatatable from "@/components/molecules/datatable/row-length";
import SearchDatatable from "@/components/molecules/datatable/search";
import RoleBasedLayout from "@/layouts/role-based-layout";
import BlankDatatable from "@/pages/blank-management/approval/_partials/blank-datatable";
import BlankForm from "@/pages/blank-management/approval/_partials/blank-form";
import BlankHeader from "@/pages/blank-management/approval/_partials/blank-header";
import { BlankPageProps } from "@/pages/blank-management/approval/blank-page.type";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useState } from "react";

const GuarantorPage: BlankPageProps = ({
  blanks,
  blanks_un_approved,
  links,
  guarantors,
  guarantorBranches,
  guarantorSelected,
  guarantorBranchSelected,
}) => {
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

  const setGuarantor = (value: any) => {
    getData(String(select), search, value.id);
  };

  const setGuarantorBranch = (value: any) => {
    getData(String(select), search, guarantorSelected?.id, value?.id);
  };

  const getData = (per_page: string, search: string, guarantor_id?: any, guarantor_branch_id?: any) => {
    return router.get(
      route(links.index),
      pickBy({
        per_page,
        search,
        guarantor_id,
        guarantor_branch_id,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          <SelectLengthDatatable defaultValue={select} onChange={handleSelect} />
          <Combobox
            datas={guarantors}
            labelKey={"name"}
            valueKey={"name"}
            defaultValue={guarantorSelected}
            placeholder={"Pilih Asuransi"}
            className={"w-[210px]"}
            onSelect={(value) => setGuarantor(value)}
          />
          <Combobox
            datas={guarantorBranches}
            labelKey={"name"}
            valueKey={"name"}
            defaultValue={guarantorBranchSelected}
            placeholder={"Pilih Cabang Asuransi"}
            className={"min-w-[210px]"}
            onSelect={(value) => setGuarantorBranch(value)}
            isReset={true}
            handleReset={() => setGuarantorBranch(null)}
          />
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
    <RoleBasedLayout propsData={pagePropsData}>
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
