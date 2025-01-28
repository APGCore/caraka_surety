import { CalendarDateRangePicker } from "@/components/common/calendar-daterange-picker";
import ExportDocsButtonDatatable from "@/components/common/export-docs-datatable";
import SearchDatatable from "@/components/common/search-datatable";
import SelectLengthDatatable from "@/components/common/SelectLengthDatatable";
import AdminLayout from "@/layouts/Admin";
import { getQueryParameter } from "@/lib/get-query-parameter";
import { InvoiceUtils } from "@/pages/report/invoice/_partials/invoice.utils";
import { router } from "@inertiajs/react";
import { subDays } from "date-fns";
import { pickBy } from "lodash";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import InvoiceDatatable from "./_partials/invoice-datatable";
import InvoiceHeader from "./_partials/invoice-header";
import { InvoicePageProps } from "./_partials/invoice.type";

const InvoicePage: InvoicePageProps = ({ submissions }) => {
  const [perPage, setPerPage] = useState<string>(() => getQueryParameter("per_page") || "10");
  const [search, setSearch] = useState<string>(() => getQueryParameter("search") || "");
  const [filterDate, setFilterDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const handleSelectInvoiceLength = (perPage: string) => {
    setPerPage(perPage);
    getData({ per_page: perPage, search });
  };

  const handleSearchInvoice = () => {
    getData({ per_page: perPage, search });
  };

  const handleChangeDate = (dateRange: DateRange | undefined) => {
    setFilterDate(dateRange);
    if (dateRange?.from && dateRange?.to) {
      getData({ per_page: perPage, search, date: dateRange });
    }
  };

  const getData = ({ per_page, search, date }: { per_page?: string; search?: string; date?: DateRange }) => {
    router.get(
      route(InvoiceUtils.link.index),
      pickBy({
        per_page,
        search,
        date,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          <ExportDocsButtonDatatable onClick={() => {}} />
          <SelectLengthDatatable defaultValue={perPage} onChange={handleSelectInvoiceLength} />
          <CalendarDateRangePicker
            value={filterDate}
            onDateChange={(date) => handleChangeDate(date)}></CalendarDateRangePicker>
        </div>
        <SearchDatatable
          value={search}
          onChange={setSearch}
          onSubmit={handleSearchInvoice}
          placeholder="Cari Invoice"
        />
      </div>
      <InvoiceDatatable submissions={submissions} />
    </main>
  );
};

export default InvoicePage;

InvoicePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <InvoiceHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </AdminLayout>
  );
};
