import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/_features/_common/components/_shadcn-ui/alert-dialog";
import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import FilterOffice from "@/_features/_common/components/filter-office";
import { getQueryParameter } from "@/common/utils/get-query-parameter";
import Loading from "@/components/atoms/loading";
import { CalendarDateRangePicker } from "@/components/molecules/calendar/daterange-calendar";
import { Combobox } from "@/components/molecules/combobox";
import SelectLengthDatatable from "@/components/molecules/datatable/row-length";
import SearchDatatable from "@/components/molecules/datatable/search";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { InvoiceUtils } from "@/pages/report/invoice/_partials/invoice.utils";
import { router } from "@inertiajs/react";
import { subDays } from "date-fns";
import { pickBy } from "lodash";
import {useMemo, useState} from "react";
import { DateRange } from "react-day-picker";
import InvoiceDatatable from "./_partials/invoice-datatable";
import InvoiceHeader from "./_partials/invoice-header";
import { InvoicePageProps } from "./_partials/invoice.type";

const InvoicePage: InvoicePageProps = ({
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
}) => {
  const [perPage, setPerPage] = useState<string>(() => getQueryParameter("per_page") || "10");
  const [search, setSearch] = useState<string>(() => getQueryParameter("search") || "");
  const [isLoadingSendToFinance, setIsLoadingSendToFinance] = useState(false);
  const [filterDate, setFilterDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [submissionChecked, setSubmissionChecked] = useState<any[]>([]);
  const checkAll = useMemo(() => {
    const checked = submissionChecked.filter((id) => submissionIds.includes(id));
    return checked.length === submissionIds.length;
  }, [submissionChecked, submissionIds]);

  const handleSelectInvoiceLength = (perPage: string) => {
    setPerPage(perPage);
    getData({ per_page: perPage });
  };

  const handleSearchInvoice = () => {
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

  const handleSelectGuarantor = (guarantorId: number) => {
    getData({ guarantor_id: guarantorId });
  };

  const handleSelectProduct = (productId?: number | null) => {
    getData({ product_id: productId });
  };

  const handleSelectProductType = (productTypeId?: number | null) => {
    getData({ product_type_id: productTypeId });
  };

  const handleResetFilterOffice = () => {
    getData({
      office_type: "",
      office_id: 0,
    });
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
      route(InvoiceUtils.link.index),
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
      {
        preserveState: true,
        preserveScroll: true,
      },
    );
  };

  const sendToFinance = () => {
    if (submissionChecked.length === 0) return;

    setIsLoadingSendToFinance(true);
    const data = submissionChecked.filter((id) => submissionIds.includes(id));
    router.post(
      route(InvoiceUtils.link.send_to_finance, { submission_ids: data }),
      {},
      {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => {
          setIsLoadingSendToFinance(false);
        },
      },
    );
  };

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          <SelectLengthDatatable defaultValue={perPage} onChange={handleSelectInvoiceLength} />
          <CalendarDateRangePicker
            value={filterDate}
            onDateChange={(date) => handleChangeDate(date)}
            numberOfMonths={2}
          />
        </div>
        <SearchDatatable
          value={search}
          onChange={setSearch}
          onSubmit={handleSearchInvoice}
          placeholder="Cari Invoice"
        />
      </div>
      <div className="flex gap-x-3 justify-between">
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
        <div className="flex gap-x-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="success"
                disabled={isLoadingSendToFinance || submissionChecked.length === 0}>
                <Loading isLoading={isLoadingSendToFinance} />
                {"Kirim ke Keuangan"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[425px]">
              <AlertDialogHeader>
                <AlertDialogTitle>Peringatan!!!</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah anda yakin ingin mengirim pengajuan ke sistem keuangan?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <AlertDialogCancel asChild>
                  <Button variant="outline" className="w-full" type="button">
                    Batal
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button variant="success" className="w-full" onClick={sendToFinance}>
                    Kirim ke Keuangan
                  </Button>
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <InvoiceDatatable
        submissions={submissions}
        submissionIds={submissionIds}
        checkAll={checkAll}
        submissionChecked={submissionChecked}
        setSubmissionChecked={setSubmissionChecked}
      />
    </main>
  );
};

export default InvoicePage;

InvoicePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <InvoiceHeader title={pagePropsData?.page_settings?.title} url={route(InvoiceUtils.link.index)} />
      {page}
    </RoleBasedLayout>
  );
};
