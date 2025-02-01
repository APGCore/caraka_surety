import { getQueryParameter } from "@/common/utils/get-query-parameter";
import { CalendarDateRangePicker } from "@/components/common/calendar-daterange-picker";
import { Combobox } from "@/components/common/combobox";
import ExportDocsButtonDatatable from "@/components/common/export-docs-datatable";
import SearchDatatable from "@/components/common/search-datatable";
import SelectLengthDatatable from "@/components/common/select-length-datatable";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { InvoiceUtils } from "@/pages/report/invoice/_partials/invoice.utils";
import { router } from "@inertiajs/react";
import { subDays } from "date-fns";
import { pickBy } from "lodash";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import InvoiceDatatable from "./_partials/invoice-datatable";
import InvoiceHeader from "./_partials/invoice-header";
import { InvoicePageProps } from "./_partials/invoice.type";

const InvoicePage: InvoicePageProps = ({ submissions, guarantors, guarantorSelected }) => {
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

  const handleSelectGuarantor = (guarantorId: number) => {
    getData({ per_page: perPage, search, date: filterDate, guarantor_id: guarantorId });
  };

  const getData = ({
    per_page,
    search,
    date,
    guarantor_id,
  }: {
    per_page?: string;
    search?: string;
    date?: DateRange;
    guarantor_id?: number;
  }) => {
    router.get(
      route(InvoiceUtils.link.index),
      pickBy({
        per_page,
        search,
        date,
        guarantor_id,
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
          <Combobox
            datas={guarantors}
            labelKey={"name"}
            valueKey={"name"}
            defaultValue={guarantorSelected}
            placeholder={"Pilih Asuransi"}
            className={"min-w-[160px]"}
            onSelect={(value) => handleSelectGuarantor(value.id)}
          />
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
    <RoleBasedLayout user={pagePropsData?.auth?.user}>
      <InvoiceHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
