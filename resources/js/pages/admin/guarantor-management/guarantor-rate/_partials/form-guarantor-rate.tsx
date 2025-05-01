import { Button } from "@/components/_shadcn-ui/button";
import { Input } from "@/components/_shadcn-ui/input";
import Show from "@/components/atoms/show";
import InputCurrency from "@/components/molecules/input/currency-input";
import InputError from "@/components/molecules/input/error-input";
import { FormGuarantorRateUtils } from "@/pages/admin/guarantor-management/guarantor-rate/_partials/form-guarantor-rate.utils";
import { router, useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import React from "react";

interface FormGuarantorRateProps {
  guarantorId: number | string;
  guarantorBranchId?: number | string | null;
  guarantorToProductTypeId: number | string;
  rate?: any;
}

const FormGuarantorRate: React.FC<FormGuarantorRateProps> = ({
  guarantorId,
  guarantorBranchId,
  guarantorToProductTypeId,
  rate,
}) => {
  const { data, setData, post, errors, processing } = useForm<{
    guarantor_id: number | string;
    guarantor_branch_id?: number | string | null;
    guarantor_to_product_type_id: number | string;
    minimum_payment?: string;
    pay_rate?: number;
    payment_administration?: string;
    stamp_duty?: string;
    broken_rate?: string;
    revised_rate?: string;
    commission?: number;
    pph?: number;
  }>({
    guarantor_id: guarantorId,
    guarantor_branch_id: guarantorBranchId ?? undefined,
    guarantor_to_product_type_id: guarantorToProductTypeId,
    minimum_payment: rate?.minimum_payment?.toString() ?? "",
    pay_rate: rate?.pay_rate ?? "",
    payment_administration: rate?.payment_administration?.toString() ?? "",
    stamp_duty: rate?.stamp_duty?.toString() ?? "",
    broken_rate: rate?.broken_rate?.toString() ?? "",
    revised_rate: rate?.revised_rate?.toString() ?? "",
    commission: rate?.commission ?? "",
    pph: rate?.pph ?? "",
  });

  const submit = () => {
    post(route(FormGuarantorRateUtils.create.route), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleBack = () => {
    router.get(
      route(FormGuarantorRateUtils.index.route, {
        guarantor_id: guarantorId,
        guarantor_branch_id: guarantorBranchId ?? undefined,
      }),
    );
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      id="guarantor-rate-form">
      <div className="flex justify-center w-full mx-auto gap-16">
        <Show when={guarantorBranchId == null}>
          <div className="p-0">
            <div className="space-y-2">
              <label htmlFor="minimum_payment" className="block text-sm font-medium text-gray-700">
                Minimum Charge
              </label>

              <div className="flex items-center space-x-4">
                <InputCurrency
                  value={data.minimum_payment?.toString() ?? ""}
                  onChange={(e) => setData({ ...data, minimum_payment: e })}
                />
              </div>

              <InputError message={errors?.minimum_payment} />
            </div>
            <div className="space-y-2">
              <label htmlFor="pay_rate" className="block text-sm font-medium text-gray-700">
                Premi Bayar
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
              <label htmlFor="payment_administration" className="block text-sm font-medium text-gray-700">
                Administrasi Asuransi
              </label>
              <div className="flex items-center space-x-4">
                <InputCurrency
                  value={data.payment_administration?.toString() ?? ""}
                  onChange={(e) => setData({ ...data, payment_administration: e })}
                />
              </div>

              <InputError message={errors?.payment_administration} />
            </div>
          </div>
        </Show>
        <div className="p-0">
          <div className="space-y-2">
            <label htmlFor="stamp_duty" className="block text-sm font-medium text-gray-700">
              Biaya Materai
            </label>
            <div className="flex items-center space-x-4">
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
              <InputCurrency
                value={data.revised_rate?.toString() ?? ""}
                onChange={(e) => setData({ ...data, revised_rate: e })}
              />
            </div>

            <InputError message={errors?.revised_rate} />
          </div>
        </div>
        <div className="p-0">
          <div className="space-y-2">
            <label htmlFor="commission" className="block text-sm font-medium text-gray-700">
              Komisi
            </label>
            <div className="flex items-center space-x-4">
              <Input
                type="number"
                id="commission"
                name="commission"
                value={data.commission}
                step="0.00001"
                min="0"
                onChange={(e) => setData({ ...data, commission: Number(e.currentTarget.value) })}
              />
              <span className="text-gray-900 text-sm">%</span>
            </div>

            <InputError message={errors?.commission} />
          </div>
          <div className="space-y-2">
            <label htmlFor="pph" className="block text-sm font-medium text-gray-700">
              PPH 23
            </label>
            <div className="flex items-center space-x-4">
              <Input
                type="number"
                id="pph"
                name="pph"
                value={data.pph}
                step="0.00001"
                min="0"
                onChange={(e) => setData({ ...data, pph: Number(e.currentTarget.value) })}
              />
              <span className="text-gray-900 text-sm">%</span>
            </div>

            <InputError message={errors?.pph} />
          </div>
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
