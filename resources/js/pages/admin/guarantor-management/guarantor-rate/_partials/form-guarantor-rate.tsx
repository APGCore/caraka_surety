import InputCurrency from "@/components/common/input-currency";
import InputError from "@/components/common/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormGuarantorRateUtils } from "@/pages/admin/guarantor-management/guarantor-rate/_partials/form-guarantor-rate.utils";
import { router, useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import React from "react";

interface FormEmployeeLimitsProps {
  rate?: any;
}

const FormGuarantorRate: React.FC<FormEmployeeLimitsProps> = ({ rate }) => {
  const { data, setData, post, errors, processing } = useForm<{
    minimum_bill?: string;
    minimum_payment?: string;
    selling_rate?: number;
    pay_rate?: number;
    sales_administration?: string;
    payment_administration?: string;
    management_fee?: number;
    minimum_management_fee?: string;
    stamp_duty?: string;
    broken_rate?: string;
    revised_rate?: string;
  }>({
    minimum_bill: rate?.minimum_bill?.toString() ?? "",
    minimum_payment: rate?.minimum_payment?.toString() ?? "",
    selling_rate: rate?.selling_rate ?? "",
    pay_rate: rate?.pay_rate ?? "",
    sales_administration: rate?.sales_administration?.toString() ?? "",
    payment_administration: rate?.payment_administration?.toString() ?? "",
    management_fee: rate?.management_fee ?? "",
    minimum_management_fee: rate?.minimum_management_fee?.toString() ?? "",
    stamp_duty: rate?.stamp_duty?.toString() ?? "",
    broken_rate: rate?.broken_rate?.toString() ?? "",
    revised_rate: rate?.revised_rate?.toString() ?? "",
  });

  const submit = () => {
    if (rate) {
      post(route(FormGuarantorRateUtils.create.route, rate.id), {
        preserveState: true,
        preserveScroll: true,
      });
    }
  };

  const handleBack = () => {
    router.get(
      route(FormGuarantorRateUtils.index.route, {
        guarantor_id: rate?.guarantor_id,
        product_id: rate?.product_id,
      }),
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      id="guarantor-rate-form"
      className="grid gap-6">
      <div className="w-[400px] mx-auto space-y-4">
        <div className="space-y-2">
          <label htmlFor="minimum_bill" className="block text-sm font-medium text-gray-700">
            Minimum Tagihan
          </label>

          <div className="flex items-center space-x-4">
            <span className="text-gray-900 text-sm">Rp. </span>
            <InputCurrency
              value={data.minimum_bill?.toString() ?? ""}
              onChange={(e) => setData({ ...data, minimum_bill: e })}
            />
          </div>

          <InputError message={errors?.minimum_bill} />
        </div>
        <div className="space-y-2">
          <label htmlFor="minimum_payment" className="block text-sm font-medium text-gray-700">
            Minimum Pembayaran
          </label>

          <div className="flex items-center space-x-4">
            <span className="text-gray-900 text-sm">Rp. </span>
            <InputCurrency
              value={data.minimum_payment?.toString() ?? ""}
              onChange={(e) => setData({ ...data, minimum_payment: e })}
            />
          </div>

          <InputError message={errors?.minimum_payment} />
        </div>
        <div className="space-y-2">
          <label htmlFor="selling_rate" className="block text-sm font-medium text-gray-700">
            Tarif Jual
          </label>
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              id="selling_rate"
              name="selling_rate"
              value={data.selling_rate}
              step="0.00001"
              min="0"
              onChange={(e) => setData({ ...data, selling_rate: Number(e.currentTarget.value) })}
            />
            <span className="text-gray-900 text-sm">%</span>
          </div>

          <InputError message={errors?.selling_rate} />
        </div>
        <div className="space-y-2">
          <label htmlFor="pay_rate" className="block text-sm font-medium text-gray-700">
            Tarif Bayar
          </label>
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              id="pay_rate"
              name="pay_rate"
              value={data.pay_rate}
              step="0.00001"
              min="0"
              onChange={(e) => setData({ ...data, pay_rate: Number(e.currentTarget.value) })}
            />
            <span className="text-gray-900 text-sm">%</span>
          </div>

          <InputError message={errors?.pay_rate} />
        </div>
        <div className="space-y-2">
          <label htmlFor="sales_administration" className="block text-sm font-medium text-gray-700">
            Administrasi Penjualan
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-gray-900 text-sm">Rp. </span>
            <InputCurrency
              value={data.sales_administration?.toString() ?? ""}
              onChange={(e) => setData({ ...data, sales_administration: e })}
            />
          </div>

          <InputError message={errors?.sales_administration} />
        </div>
        <div className="space-y-2">
          <label htmlFor="payment_administration" className="block text-sm font-medium text-gray-700">
            Administrasi Bayar
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-gray-900 text-sm">Rp. </span>
            <InputCurrency
              value={data.payment_administration?.toString() ?? ""}
              onChange={(e) => setData({ ...data, payment_administration: e })}
            />
          </div>

          <InputError message={errors?.payment_administration} />
        </div>
        <div className="space-y-2">
          <label htmlFor="management_fee" className="block text-sm font-medium text-gray-700">
            Management Fee
          </label>
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              id="management_fee"
              name="management_fee"
              value={data.management_fee}
              step="0.00001"
              min="0"
              onChange={(e) => setData({ ...data, management_fee: Number(e.currentTarget.value) })}
            />
            <span className="text-gray-900 text-sm">%</span>
          </div>

          <InputError message={errors?.management_fee} />
        </div>
        <div className="space-y-2">
          <label htmlFor="minimum_management_fee" className="block text-sm font-medium text-gray-700">
            Minimum Management Fee
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-gray-900 text-sm">Rp. </span>
            <InputCurrency
              value={data.minimum_management_fee?.toString() ?? ""}
              onChange={(e) => setData({ ...data, minimum_management_fee: e })}
            />
          </div>

          <InputError message={errors?.minimum_management_fee} />
        </div>
        <div className="space-y-2">
          <label htmlFor="stamp_duty" className="block text-sm font-medium text-gray-700">
            Biaya Materai
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-gray-900 text-sm">Rp. </span>
            <InputCurrency
              value={data.stamp_duty?.toString() ?? ""}
              onChange={(e) => setData({ ...data, stamp_duty: e })}
            />
          </div>

          <InputError message={errors?.stamp_duty} />
        </div>
        <div className="space-y-2">
          <label htmlFor="broken_rate" className="block text-sm font-medium text-gray-700">
            Tarif Blangko Rusak
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-gray-900 text-sm">Rp. </span>
            <InputCurrency
              value={data.broken_rate?.toString() ?? ""}
              onChange={(e) => setData({ ...data, broken_rate: e })}
            />
          </div>

          <InputError message={errors?.broken_rate} />
        </div>
        <div className="space-y-2">
          <label htmlFor="revised_rate" className="block text-sm font-medium text-gray-700">
            Tarif blangko Revisi
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-gray-900 text-sm">Rp. </span>
            <InputCurrency
              value={data.revised_rate?.toString() ?? ""}
              onChange={(e) => setData({ ...data, revised_rate: e })}
            />
          </div>

          <InputError message={errors?.revised_rate} />
        </div>
      </div>
      <div className="flex justify-end gap-x-3">
        <Button type="reset" onClick={handleBack}>
          Batal
        </Button>
        <Button
          type="submit"
          form="guarantor-rate-form"
          className="w-max bg-green-600 hover:bg-green-500"
          disabled={processing}>
          {processing && <LoaderCircle className="animate-spin mr-1 flex-shrink-0" />}
          {FormGuarantorRateUtils.create.btn_label}
        </Button>
      </div>
    </form>
  );
};

export default FormGuarantorRate;
