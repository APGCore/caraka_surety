import FilterOffice from "@/_features/_common/components/filter-office";
import { getQueryParameter } from "@/common/utils/get-query-parameter";
import { CalendarDateRangePicker } from "@/components/molecules/calendar/daterange-calendar";
import { Combobox } from "@/components/molecules/combobox";
import ExportDocsButtonDatatable from "@/components/molecules/datatable/export";
import SelectLengthDatatable from "@/components/molecules/datatable/row-length";
import SearchDatatable from "@/components/molecules/datatable/search";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { router } from "@inertiajs/react";
import { subDays } from "date-fns";
import { pickBy } from "lodash";
import React, { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import SubmissionDatatable from "./_partials/submission-datatable";
import SubmissionHeader from "./_partials/submission-header";
import { SubmissionPageProps } from "./_partials/submission.type";
import { SubmissionUtils } from "./_partials/submission.utils";

const SubmissionPage: SubmissionPageProps = ({
  submissions,
  submissionIds,
  offices,
  officeTypes,
  officeSelected,
  officeTypeSelected,
  guarantors,
  guarantorSelected,
  products,
  productSelected,
  productTypes,
  productTypeSelected,
  finalReports,
  allReports,
  mergedReports,
}) => {
  console.log("finalReports", finalReports);
  console.log("allReports", allReports);
  console.log("mergedReports", mergedReports);
  console.log("submissions", submissions);
  const finalReportMapped = useMemo(() => {
    return allReports.flatMap((item: any) => item.groups);
  }, [allReports]);
  console.log({
    finalReportMapped,
    submissions,
  });
  const [perPage, setPerPage] = useState<string>(() => getQueryParameter("per_page") || "10");
  const [search, setSearch] = useState<string>(() => getQueryParameter("search") || "");
  const paramDateFrom = getQueryParameter("date[from]");
  const paramDateTo = getQueryParameter("date[to]");
  const [filterDate, setFilterDate] = useState<DateRange | undefined>({
    from: paramDateFrom ? new Date(paramDateFrom) : subDays(new Date(), 7),
    to: paramDateTo ? new Date(paramDateTo) : new Date(),
  });
  console.log("filterDate", filterDate);

  const handleSelectSubmissionLength = (perPage: string) => {
    setPerPage(perPage);
    getData({ per_page: perPage });
  };

  const handleSearchSubmission = () => {
    getData({ searchValue: search });
  };

  const convertDate = (date: DateRange | undefined) => {
    if (date?.from && date?.to) {
      return {
        from: date.from.toLocaleDateString("en-CA") + " 00:00:00",
        to: date.to.toLocaleDateString("en-CA") + " 23:59:59",
      };
    }
    return undefined;
  };

  const handleChangeDate = (dateRange: DateRange | undefined) => {
    setFilterDate(dateRange);
    if (dateRange?.from && dateRange?.to) {
      const dates = convertDate(dateRange);
      getData({ date: dates });
    }
  };

  const handleSelectOfficeType = (officeType: string) => {
    getData({ office_type: officeType, office_id: 0 });
  };

  const handleSelectOffice = (officeId: number) => {
    getData({ office_id: officeId });
  };

  const handleResetFilterOffice = () => {
    getData({
      office_type: "",
      office_id: 0,
    });
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

  const exportExcel = () => {
    const dates = convertDate(filterDate);
    window.location.href =
      route(SubmissionUtils.link.export.excel) +
      "?" +
      new URLSearchParams(
        pickBy({
          submission_ids: submissionIds,
          start_date: dates?.from || "",
          end_date: dates?.to || "",
          office_id: officeSelected ? String(officeSelected) : "",
        }) as unknown as Record<string, string>,
      ).toString();
  };

  const getData = ({
    per_page = perPage,
    searchValue = search,
    date = convertDate(filterDate),
    office_type = officeTypeSelected,
    office_id = officeSelected,
    guarantor_id = guarantorSelected,
    product_id = productSelected,
    product_type_id = productTypeSelected,
  }: {
    per_page?: string;
    searchValue?: string;
    date?: { from: string; to: string } | undefined;
    office_type?: string;
    office_id?: number;
    guarantor_id?: number;
    product_id?: number | null;
    product_type_id?: number | null;
  }) => {
    router.get(
      route(SubmissionUtils.link.index),
      pickBy({
        per_page,
        search: searchValue,
        date,
        office_type,
        office_id,
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
          <ExportDocsButtonDatatable onClick={exportExcel} />
          <SelectLengthDatatable defaultValue={perPage} onChange={handleSelectSubmissionLength} />
          <CalendarDateRangePicker value={filterDate} onDateChange={(date) => handleChangeDate(date)} />
        </div>
        <SearchDatatable
          value={search}
          onChange={setSearch}
          onSubmit={handleSearchSubmission}
          placeholder="Cari Pengajuan"
        />
      </div>
      <div className="flex gap-x-3 w-auto">
        <div className="flex gap-x-3">
          <FilterOffice
            offices={offices}
            officeTypes={officeTypes}
            officeTypeSelected={officeTypeSelected}
            officeSelected={officeSelected}
            handleSelectOfficeType={handleSelectOfficeType}
            handleSelectOffice={handleSelectOffice}
            handleReset={handleResetFilterOffice}
          />
        </div>
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
      <SubmissionDatatable submissions={submissions} />
    </main>
  );
};

export default SubmissionPage;

SubmissionPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <SubmissionHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
