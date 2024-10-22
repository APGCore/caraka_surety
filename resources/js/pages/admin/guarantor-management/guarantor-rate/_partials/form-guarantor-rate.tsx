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
    broken_rate: rate?.broken_rate?.toString() ?? "",
    revised_rate: rate?.revised_rate?.toString() ?? "",
  });

  const submit = () => {
    if (rate) {
      post(route(FormGuarantorRateUtils.create.route, rate.id), {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          handleBack();
        },
      });
    }
  };

  const handleBack = () => {
    router.get(route(FormGuarantorRateUtils.index.route));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      id="guarantor-rate-form"
      className="grid gap-6">
      <div className="space-y-2">
        <label htmlFor="minimum_bill" className="block text-sm font-medium text-gray-700">
          Minimum Tagihan
        </label>

        <InputCurrency
          id="minimum_bill"
          name="minimum_bill"
          value={data.minimum_bill?.toString() ?? ""}
          onChange={(e) => setData({ ...data, minimum_bill: e })}
        />

        <InputError message={errors?.minimum_bill} />
      </div>
      <div className="space-y-2">
        <label htmlFor="minimum_payment" className="block text-sm font-medium text-gray-700">
          Minimum Pembayaran
        </label>
        <InputCurrency
          id="minimum_payment"
          name="minimum_payment"
          value={data.minimum_payment?.toString() ?? ""}
          onChange={(e) => setData({ ...data, minimum_payment: e })}
        />

        <InputError message={errors?.minimum_payment} />
      </div>
      <div className="space-y-2">
        <label htmlFor="selling_rate" className="block text-sm font-medium text-gray-700">
          Tarif Jual
        </label>
        <Input
          type="number"
          id="selling_rate"
          name="selling_rate"
          value={data.selling_rate}
          step="0.00001"
          min="0"
          onChange={(e) => setData({ ...data, selling_rate: Number(e.currentTarget.value) })}
        />

        <InputError message={errors?.selling_rate} />
      </div>
      <div className="space-y-2">
        <label htmlFor="pay_rate" className="block text-sm font-medium text-gray-700">
          Tarif Bayar
        </label>
        <Input
          type="number"
          id="pay_rate"
          name="pay_rate"
          value={data.pay_rate}
          step="0.00001"
          min="0"
          onChange={(e) => setData({ ...data, pay_rate: Number(e.currentTarget.value) })}
        />

        <InputError message={errors?.pay_rate} />
      </div>
      <div className="space-y-2">
        <label htmlFor="sales_administration" className="block text-sm font-medium text-gray-700">
          Administrasi Penjualan
        </label>
        <InputCurrency
          id="sales_administration"
          name="sales_administration"
          value={data.sales_administration?.toString() ?? ""}
          onChange={(e) => setData({ ...data, sales_administration: e })}
        />

        <InputError message={errors?.sales_administration} />
      </div>
      <div className="space-y-2">
        <label htmlFor="payment_administration" className="block text-sm font-medium text-gray-700">
          Administrasi Bayar
        </label>
        <InputCurrency
          id="payment_administration"
          name="payment_administration"
          value={data.payment_administration?.toString() ?? ""}
          onChange={(e) => setData({ ...data, payment_administration: e })}
        />

        <InputError message={errors?.payment_administration} />
      </div>
      <div className="space-y-2">
        <label htmlFor="management_fee" className="block text-sm font-medium text-gray-700">
          Management Fee
        </label>
        <Input
          type="number"
          id="management_fee"
          name="management_fee"
          value={data.management_fee}
          step="0.00001"
          min="0"
          onChange={(e) => setData({ ...data, management_fee: Number(e.currentTarget.value) })}
        />

        <InputError message={errors?.management_fee} />
      </div>
      <div className="space-y-2">
        <label htmlFor="minimum_management_fee" className="block text-sm font-medium text-gray-700">
          Minimum Management Fee
        </label>
        <InputCurrency
          id="minimum_management_fee"
          name="minimum_management_fee"
          value={data.minimum_management_fee?.toString() ?? ""}
          onChange={(e) => setData({ ...data, minimum_management_fee: e })}
        />

        <InputError message={errors?.minimum_management_fee} />
      </div>
      <div className="space-y-2">
        <label htmlFor="broken_rate" className="block text-sm font-medium text-gray-700">
          Tarif Rusak
        </label>
        <InputCurrency
          id="broken_rate"
          name="broken_rate"
          value={data.broken_rate?.toString() ?? ""}
          onChange={(e) => setData({ ...data, broken_rate: e })}
        />

        <InputError message={errors?.broken_rate} />
      </div>
      <div className="space-y-2">
        <label htmlFor="revised_rate" className="block text-sm font-medium text-gray-700">
          Tarif Revisi
        </label>
        <InputCurrency
          id="revised_rate"
          name="revised_rate"
          value={data.revised_rate?.toString() ?? ""}
          onChange={(e) => setData({ ...data, revised_rate: e })}
        />

        <InputError message={errors?.revised_rate} />
      </div>
      <div className="flex justify-end gap-x-3">
        <Button type="reset" onClick={handleBack}>
          Batal
        </Button>
        <Button type="submit" form="guarantor-rate-form" className="w-max" disabled={processing}>
          {processing && <LoaderCircle className="animate-spin mr-1 flex-shrink-0" />}
          {FormGuarantorRateUtils.create.btn_label}
        </Button>
      </div>
    </form>
  );
};

export default FormGuarantorRate;
