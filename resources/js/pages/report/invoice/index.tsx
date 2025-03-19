import { getQueryParameter } from "@/common/utils/get-query-parameter";
import { CalendarDateRangePicker } from "@/components/molecules/calendar/daterange-calendar";
import { Combobox } from "@/components/molecules/combobox";
import ExportDocsButtonDatatable from "@/components/molecules/datatable/export";
import SelectLengthDatatable from "@/components/molecules/datatable/row-length";
import SearchDatatable from "@/components/molecules/datatable/search";
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

const InvoicePage: InvoicePageProps = ({
  submissions,
  guarantors,
  guarantorSelected,
  products,
  productSelected,
  productTypes,
  productTypeSelected,
}) => {
  const [perPage, setPerPage] = useState<string>(() => getQueryParameter("per_page") || "10");
  const [search, setSearch] = useState<string>(() => getQueryParameter("search") || "");
  const [filterDate, setFilterDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const handleSelectInvoiceLength = (perPage: string) => {
    setPerPage(perPage);
    getData({ per_page: perPage });
  };

  const handleSearchInvoice = () => {
    getData({ searchValue: search });
  };

  const handleChangeDate = (dateRange: DateRange | undefined) => {
    setFilterDate(dateRange);
    if (dateRange?.from && dateRange?.to) {
      const dates = {
        from:
          (dateRange?.from?.toLocaleDateString("en-CA") || subDays(new Date(), 7).toLocaleDateString("en-CA")) +
          " 00:00:00",
        to: (dateRange?.to?.toLocaleDateString("en-CA") || new Date().toLocaleDateString("en-CA")) + " 23:59:59",
      };
      getData({ date: dates });
    }
  };

  const handleSelectGuarantor = (guarantorId: number) => {
    getData({ guarantor_id: guarantorId });
  };

  const handleSelectProduct = (productId?: number | null) => {
    getData({ product_id: productId });
  };

  const handleSelectProductType = (productTypeId?: number | null) => {
    getData({ product_type_id: productTypeId });
  };

  const getData = ({
    per_page = perPage,
    searchValue = search,
    date,
    guarantor_id = guarantorSelected,
    product_id = productSelected,
    product_type_id = productTypeSelected,
  }: {
    per_page?: string;
    searchValue?: string;
    date?: { from: string; to: string };
    guarantor_id?: number;
    product_id?: number | null;
    product_type_id?: number | null;
  }) => {
    router.get(
      route(InvoiceUtils.link.index),
      pickBy({
        per_page,
        search: searchValue,
        date,
        guarantor_id,
        product_id,
        product_type_id,
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
          <CalendarDateRangePicker value={filterDate} onDateChange={(date) => handleChangeDate(date)} />
        </div>
        <SearchDatatable
          value={search}
          onChange={setSearch}
          onSubmit={handleSearchInvoice}
          placeholder="Cari Invoice"
        />
      </div>
      <div className="flex gap-x-3">
        <Combobox
          datas={guarantors}
          labelKey={"name"}
          valueKey={"name"}
          defaultValue={guarantorSelected}
          placeholder={"Pilih Asuransi"}
          className={"min-w-[160px]"}
          onSelect={(value) => handleSelectGuarantor(value.id)}
        />
        <Combobox
          datas={products}
          labelKey={"name"}
          valueKey={"name"}
          defaultValue={productSelected}
          placeholder={"Pilih Produk"}
          className={"min-w-[160px]"}
          onSelect={(value) => handleSelectProduct(value.id)}
          isReset={true}
          handleReset={() => handleSelectProduct(null)}
        />
        <Combobox
          datas={productTypes}
          labelKey={"name"}
          valueKey={"name"}
          defaultValue={productTypeSelected}
          placeholder={"Pilih Jenis Jaminan"}
          className={"min-w-[160px]"}
          onSelect={(value) => handleSelectProductType(value.id)}
          isReset={true}
          handleReset={() => handleSelectProductType(null)}
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
    <RoleBasedLayout propsData={pagePropsData}>
      <InvoiceHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
