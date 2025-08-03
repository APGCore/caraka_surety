import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/_features/_common/components/_shadcn-ui/card";
import Loading from "@/_features/_common/components/loading";
import { formatCurrency } from "@/common/utils/format-currency";
import { Alert, AlertDescription, AlertTitle } from "@/components/_shadcn-ui/alert";
// import { Input } from "@/components/_shadcn-ui/input";
import Show from "@/components/atoms/show";
// import InputCurrency from "@/components/molecules/input/currency-input";
// import InputError from "@/components/molecules/input/error-input";
import RoleBasedLayout from "@/layouts/role-based-layout";
import InvoiceGuarantor from "@/pages/report/invoice/_partials/invoice-guarantor";
import InvoiceOffice from "@/pages/report/invoice/_partials/invoice-office";
import { InvoiceUtils } from "@/pages/report/invoice/_partials/invoice.utils";
// import { FormPrincipalSubmissionRateUtils } from "@/pages/report/invoice/detail/_partials/form-principal-submission-rate.utils";
import { InvoiceDetailPageProps } from "@/pages/report/invoice/detail/invoice-detail.type";
import { SubmissionStatus } from "@/types/submission-status";
import { router } from "@inertiajs/react";
import { AlertCircle } from "lucide-react";
import React, { useState } from "react";
import InvoiceHeader from "../_partials/invoice-header";

const InvoiceDetailPage: InvoiceDetailPageProps = ({
  submission,
  guarantor_rate,
  office_rate,
  capital_rate,
  selling_rate,
  is_set,
}) => {
  const [isLoadingSendToFinance, setIsLoadingSendToFinance] = useState(false);
  // const minimum = String(selling_rate.minimum || principal_rate.minimum || office_rate.minimum || 0);
  // const rate = String(selling_rate.rate || principal_rate.rate || office_rate.rate || 0);
  // const adm = String(selling_rate.adm || principal_rate.adm || office_rate.adm || 0);
  // const brokenRate = String(selling_rate.broken_rate || principal_rate.broken_rate || office_rate.broken_rate || 0);
  // const revisedRate = String(selling_rate.revised_rate || principal_rate.revised_rate || office_rate.revised_rate || 0);

  // const { data, setData, post, errors, processing } = useForm<{
  //   submission_id: number | string;
  //   minimum_bill?: string;
  //   selling_rate?: string;
  //   sales_administration?: string;
  //   broken_rate?: string;
  //   revised_rate?: string;
  // }>({
  //   submission_id: submission.id,
  //   minimum_bill: minimum,
  //   selling_rate: rate,
  //   sales_administration: adm,
  //   broken_rate: brokenRate,
  //   revised_rate: revisedRate,
  // });

  // const submit = () => {
  //   post(route(FormPrincipalSubmissionRateUtils.create.route), {
  //     preserveState: true,
  //     preserveScroll: true,
  //     onError: (params) => {
  //       console.log(params);
  //     },
  //   });
  // };

  const sendToFinance = () => {
    setIsLoadingSendToFinance(true);
    router.post(
      route(InvoiceUtils.link.send_to_finance, { submission_ids: [submission.id] }),
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
      <Show when={submission.submission_before_id}>
        <Alert variant="info">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Informasi</AlertTitle>
          <AlertDescription>
            Pengajuan ini merupakan revisi dari pengajuan sebelumnya dengan nomor blangko{" "}
            {submission.submission_before?.blank?.number}.
          </AlertDescription>
        </Alert>
      </Show>
      <Show when={submission.status === SubmissionStatus.REVISED}>
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Informasi</AlertTitle>
          <AlertDescription>Pengajuan ini merupakan revisi</AlertDescription>
        </Alert>
      </Show>
      <Show when={submission.has_send_to_finance}>
        <Alert variant="success">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Informasi</AlertTitle>
          <AlertDescription>Pengajuan ini sudah dikirim ke keuangan.</AlertDescription>
        </Alert>
      </Show>
      <Card>
        <CardHeader>
          <CardTitle>Pengajuan {submission.principal.name}</CardTitle>
          <CardDescription className={"text-bold"}>
            Pengajuan {submission.product.name}: {submission.guarantor_to_product_type.full_name} dengan No Jaminan{" "}
            {submission.no_guarantee} di Unit Bisnis {submission.office.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Tarif Modal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <p className="text-sm font-semibold">Tarif</p>
                      <p>{guarantor_rate.rate} %</p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-sm font-semibold">Minimum</p>
                      <p>{formatCurrency(guarantor_rate.minimum)}</p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-sm font-semibold">Biaya Administrasi</p>
                      <p>{formatCurrency(guarantor_rate.adm)}</p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-sm font-semibold">Tarif Blangko Rusak</p>
                      <p>{formatCurrency(guarantor_rate.broken_rate)}</p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-sm font-semibold">Tarif Blangko Revisi</p>
                      <p>{formatCurrency(guarantor_rate.revised_rate)}</p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-sm font-semibold">Komisi</p>
                      <p>{guarantor_rate.percent_commission} %</p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-sm font-semibold">PPH 23</p>
                      <p>{guarantor_rate.percent_pph} %</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Tarif Jual Standar Unit Bisnis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <p className="text-sm font-semibold">Tarif</p>
                      <p>{office_rate.rate} %</p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-sm font-semibold">Minimum</p>
                      <p>{formatCurrency(office_rate.minimum)}</p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-sm font-semibold">Biaya Administrasi</p>
                      <p>{formatCurrency(office_rate.adm)}</p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-sm font-semibold">Tarif Blangko Rusak</p>
                      <p>{formatCurrency(office_rate.broken_rate)}</p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-sm font-semibold">Tarif Blangko Revisi</p>
                      <p>{formatCurrency(office_rate.revised_rate)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/*<div className="col-span-1">*/}
            {/*  <Card>*/}
            {/*    <CardHeader>*/}
            {/*      <CardTitle>Tarif Jual Per Principal</CardTitle>*/}
            {/*    </CardHeader>*/}
            {/*    <CardContent>*/}
            {/*      <div className="grid grid-cols-2 gap-4">*/}
            {/*        <div className="col-span-1">*/}
            {/*          <p className="text-sm font-semibold">Tarif</p>*/}
            {/*          <p>{principal_rate.rate} %</p>*/}
            {/*        </div>*/}
            {/*        <div className="col-span-1">*/}
            {/*          <p className="text-sm font-semibold">Minimum</p>*/}
            {/*          <p>{formatCurrency(principal_rate.minimum)}</p>*/}
            {/*        </div>*/}
            {/*        <div className="col-span-1">*/}
            {/*          <p className="text-sm font-semibold">Biaya Administrasi</p>*/}
            {/*          <p>{formatCurrency(principal_rate.adm)}</p>*/}
            {/*        </div>*/}
            {/*        <div className="col-span-1">*/}
            {/*          <p className="text-sm font-semibold">Tarif Blangko Rusak</p>*/}
            {/*          <p>{formatCurrency(principal_rate.broken_rate)}</p>*/}
            {/*        </div>*/}
            {/*        <div className="col-span-1">*/}
            {/*          <p className="text-sm font-semibold">Tarif Blangko Revisi</p>*/}
            {/*          <p>{formatCurrency(principal_rate.revised_rate)}</p>*/}
            {/*        </div>*/}
            {/*      </div>*/}
            {/*    </CardContent>*/}
            {/*  </Card>*/}
            {/*</div>*/}
          </div>
        </CardContent>
      </Card>
      {/*<Card>*/}
      {/*  <CardHeader>*/}
      {/*    <CardTitle>{FormPrincipalSubmissionRateUtils.create.title}</CardTitle>*/}
      {/*    <CardDescription>{FormPrincipalSubmissionRateUtils.create.sub_title}</CardDescription>*/}
      {/*  </CardHeader>*/}
      {/*  <CardContent>*/}
      {/*    <div className="grid grid-cols-2 gap-2">*/}
      {/*      <div className="cols-span-1 space-y-2">*/}
      {/*        <label htmlFor="minimum_bill" className="block text-sm font-medium text-gray-700">*/}
      {/*          Minimum Penjualan*/}
      {/*        </label>*/}

      {/*        <div className="flex items-center space-x-4">*/}
      {/*          <InputCurrency*/}
      {/*            value={data.minimum_bill?.toString() ?? ""}*/}
      {/*            onChange={(e) => setData({ ...data, minimum_bill: e })}*/}
      {/*          />*/}
      {/*        </div>*/}

      {/*        <InputError message={errors?.minimum_bill} />*/}
      {/*      </div>*/}
      {/*      <div className="cols-span-1 space-y-2">*/}
      {/*        <label htmlFor="selling_rate" className="block text-sm font-medium text-gray-700">*/}
      {/*          Tarif Penjualan*/}
      {/*        </label>*/}
      {/*        <div className="flex items-center space-x-4">*/}
      {/*          <Input*/}
      {/*            type="number"*/}
      {/*            id="selling_rate"*/}
      {/*            name="selling_rate"*/}
      {/*            value={data.selling_rate}*/}
      {/*            step="0.00001"*/}
      {/*            min="0"*/}
      {/*            onChange={(e) => setData({ ...data, selling_rate: e.currentTarget.value })}*/}
      {/*          />*/}
      {/*          <span className="text-gray-900 text-sm">%</span>*/}
      {/*        </div>*/}

      {/*        <InputError message={errors?.selling_rate} />*/}
      {/*      </div>*/}
      {/*      <div className="cols-span-1 space-y-2">*/}
      {/*        <label htmlFor="sales_administration" className="block text-sm font-medium text-gray-700">*/}
      {/*          Administrasi Penjualan*/}
      {/*        </label>*/}
      {/*        <div className="flex items-center space-x-4">*/}
      {/*          <InputCurrency*/}
      {/*            value={data.sales_administration?.toString() ?? ""}*/}
      {/*            onChange={(e) => setData({ ...data, sales_administration: e })}*/}
      {/*          />*/}
      {/*        </div>*/}

      {/*        <InputError message={errors?.sales_administration} />*/}
      {/*      </div>*/}
      {/*      <div className="cols-span-1 space-y-2">*/}
      {/*        <label htmlFor="broken_rate" className="block text-sm font-medium text-gray-700">*/}
      {/*          Tarif Blangko Rusak*/}
      {/*        </label>*/}
      {/*        <div className="flex items-center space-x-4">*/}
      {/*          <InputCurrency*/}
      {/*            value={data.broken_rate?.toString() ?? ""}*/}
      {/*            onChange={(e) => setData({ ...data, broken_rate: e })}*/}
      {/*          />*/}
      {/*        </div>*/}

      {/*        <InputError message={errors?.broken_rate} />*/}
      {/*      </div>*/}
      {/*      <div className="cols-span-1 space-y-2">*/}
      {/*        <label htmlFor="revised_rate" className="block text-sm font-medium text-gray-700">*/}
      {/*          Tarif blangko Revisi*/}
      {/*        </label>*/}
      {/*        <div className="flex items-center space-x-4">*/}
      {/*          <InputCurrency*/}
      {/*            value={data.revised_rate?.toString() ?? ""}*/}
      {/*            onChange={(e) => setData({ ...data, revised_rate: e })}*/}
      {/*          />*/}
      {/*        </div>*/}

      {/*        <InputError message={errors?.revised_rate} />*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </CardContent>*/}
      {/*  <CardFooter>*/}
      {/*    <div className="w-full text-right">*/}
      {/*      <Button type="button" onClick={submit}>*/}
      {/*        <Loading isLoading={processing} />*/}
      {/*        Simpan*/}
      {/*      </Button>*/}
      {/*    </div>*/}
      {/*  </CardFooter>*/}
      {/*</Card>*/}
      <Card>
        <CardHeader>
          <CardTitle>Hasil Tarif</CardTitle>
          <CardDescription>Hasil tarif yang sudah di setting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Tarif Modal</CardTitle>
                </CardHeader>
                <CardContent>
                  <InvoiceGuarantor guarantorName={submission.guarantor.name} guarantorRate={capital_rate} />
                </CardContent>
              </Card>
            </div>
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Tarif Jual</CardTitle>
                </CardHeader>
                <CardContent>
                  <InvoiceOffice officeRate={selling_rate} />
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
        {is_set && (
          <CardFooter>
            <div className="w-full text-right">
              <Button type="button" variant="success" onClick={sendToFinance}>
                <Loading isLoading={isLoadingSendToFinance} />
                {!submission.has_send_to_finance ? "Kirim ke Keuangan" : "update ke Keuangan"}
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </main>
  );
};

export default InvoiceDetailPage;

InvoiceDetailPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <InvoiceHeader
        title={pagePropsData?.page_settings?.title}
        url={route(InvoiceUtils.link.show, { submission: pagePropsData.submission.id })}
      />
      {page}
    </RoleBasedLayout>
  );
};
