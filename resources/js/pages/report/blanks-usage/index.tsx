import { getQueryParameter } from "@/common/utils/get-query-parameter";
import ExportDocsButtonDatatable from "@/components/common/export-docs-datatable";
import SearchDatatable from "@/components/common/search-datatable";
import SelectLengthDatatable from "@/components/common/select-length-datatable";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { BlankUsageUtils } from "@/pages/report/blanks-usage/_partials/blank-usage.utils";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import { useState } from "react";
import BlankUsageDatatable from "./_partials/blank-usage-datatable";
import BlankUsageHeader from "./_partials/blank-usage-header";
import { BlankUsagePageProps } from "./_partials/blank-usage.type";

const BlankUsagePage: BlankUsagePageProps = ({ blankUsage }) => {
  const [select, setSelect] = useState<string>(() => getQueryParameter("per_page") || "10");
  const [search, setSearch] = useState<string>(() => getQueryParameter("search") || "");
  const [exportOption, setExportOption] = useState<string>("unit");

  const handleSelectInvoiceLength = (per_page: string) => {
    setSelect(per_page);
    getData(per_page, search);
  };

  const handleSearchInvoice = () => {
    getData(select, search);
  };

  const getData = (per_page: string, search: string) => {
    router.get(
      route(BlankUsageUtils.link.index),
      pickBy({
        per_page,
        search,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const handleExport = () => {
    const routeName = exportOption === "unit" ? "report.blank-usage.export-unit" : "report.blank-usage.export-branch";
    window.location.href = route(routeName);
    console.log("Export option:", exportOption);
  };

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          <ExportDocsButtonDatatable onClick={handleExport} />
          {/* Combo box to choose between unit or branch export */}
          <div>
            <select
              value={exportOption}
              onChange={(e) => setExportOption(e.target.value)}
              className="border rounded p-2">
              <option value="unit">Export per Satuan</option>
              <option value="branch">Export per Cabang</option>
            </select>
          </div>

          <SelectLengthDatatable defaultValue={select} onChange={handleSelectInvoiceLength} />
        </div>
        <SearchDatatable
          value={search}
          onChange={setSearch}
          onSubmit={handleSearchInvoice}
          placeholder="Cari Invoice"
        />
      </div>
      <BlankUsageDatatable BlankUsages={blankUsage} />
    </main>
  );
};

export default BlankUsagePage;

BlankUsagePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout user={pagePropsData?.auth?.user}>
      <BlankUsageHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
