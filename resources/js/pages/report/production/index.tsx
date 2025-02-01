import { getQueryParameter } from "@/common/utils/get-query-parameter";
import ExportDocsButtonDatatable from "@/components/common/export-docs-datatable";
import SearchDatatable from "@/components/common/search-datatable";
import SelectLengthDatatable from "@/components/common/select-length-datatable";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { InvoiceUtils } from "@/pages/report/invoice/_partials/invoice.utils";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import { useState } from "react";
import InvoiceDatatable from "./_partials/invoice-datatable";
import InvoiceHeader from "./_partials/invoice-header";
import { InvoicePageProps } from "./_partials/invoice.type";

const InvoicePage: InvoicePageProps = ({ invoices }) => {
  const [select, setSelect] = useState<string>(() => getQueryParameter("per_page") || "10");
  const [search, setSearch] = useState<string>(() => getQueryParameter("search") || "");

  const handleSelectInvoiceLength = (per_page: string) => {
    setSelect(per_page);
    getData(per_page, search);
  };

  const handleSearchInvoice = () => {
    getData(select, search);
  };

  const getData = (per_page: string, search: string) => {
    router.get(
      route(InvoiceUtils.link.index),
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
          <ExportDocsButtonDatatable onClick={() => {}} />
          <SelectLengthDatatable defaultValue={select} onChange={handleSelectInvoiceLength} />
        </div>
        <SearchDatatable
          value={search}
          onChange={setSearch}
          onSubmit={handleSearchInvoice}
          placeholder="Cari Invoice"
        />
      </div>
      <InvoiceDatatable invoices={invoices} />
    </main>
  );
};

export default InvoicePage;

InvoicePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout user={pagePropsData?.auth?.user}>
      <InvoiceHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
