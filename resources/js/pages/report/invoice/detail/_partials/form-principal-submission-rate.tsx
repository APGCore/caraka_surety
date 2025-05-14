import { Button } from "@/components/_shadcn-ui/button";
import { Input } from "@/components/_shadcn-ui/input";
import Show from "@/components/atoms/show";
import InputCurrency from "@/components/molecules/input/currency-input";
import InputError from "@/components/molecules/input/error-input";
import { FormPrincipalSubmissionRateUtils } from "@/pages/report/invoice/detail/_partials/form-principal-submission-rate.utils";
import { router, useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import React from "react";

interface FormPrincipalSubmissionRateProps {
  profileId: number | string;
  guarantorId: number | string;
  guarantorBranchId?: number | string | null;
  guarantorToProductTypeId: number | string;
  submissionId?: number | string | null;
  rate?: any;
}

const FormPrincipalSubmissionRate: React.FC<FormPrincipalSubmissionRateProps> = ({
  profileId,
  guarantorId,
  guarantorBranchId,
  guarantorToProductTypeId,
  submissionId,
  rate,
}) => {
  const { data, setData, post, errors, processing } = useForm<{
    profile_id: number | string;
    guarantor_id: number | string;
    guarantor_branch_id?: number | string | null;
    guarantor_to_product_type_id: number | string;
    submission_id?: number | string | null;
    minimum_bill?: string;
    selling_rate?: number;
    sales_administration?: string;
    management_fee?: number;
    minimum_management_fee?: string;
    broken_rate?: string;
    revised_rate?: string;
  }>({
    profile_id: profileId,
    guarantor_id: guarantorId,
    guarantor_branch_id: guarantorBranchId ?? undefined,
    guarantor_to_product_type_id: guarantorToProductTypeId,
    submission_id: submissionId ?? undefined,
    minimum_bill: rate?.minimum_bill?.toString() ?? "",
    selling_rate: rate?.selling_rate,
    sales_administration: rate?.sales_administration?.toString() ?? "",
    management_fee: rate?.management_fee,
    minimum_management_fee: rate?.minimum_management_fee?.toString() ?? "",
    broken_rate: rate?.broken_rate?.toString() ?? "",
    revised_rate: rate?.revised_rate?.toString() ?? "",
  });

  const submit = () => {
    post(route(FormPrincipalSubmissionRateUtils.create.route), {
      preserveState: true,
      preserveScroll: true,
      onError: (params) => {
        console.log(params);
      },
    });
  };

  const handleBack = () => {
    router.get(
      route(FormPrincipalSubmissionRateUtils.index.route, {
        profile_id: profileId,
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
              <label htmlFor="minimum_bill" className="block text-sm font-medium text-gray-700">
                Minimum Tagihan
              </label>

              <div className="flex items-center space-x-4">
                <InputCurrency
                  value={data.minimum_bill?.toString() ?? ""}
                  onChange={(e) => setData({ ...data, minimum_bill: e })}
                />
              </div>

              <InputError message={errors?.minimum_bill} />
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
              <label htmlFor="sales_administration" className="block text-sm font-medium text-gray-700">
                Administrasi Penjualan
              </label>
              <div className="flex items-center space-x-4">
                <InputCurrency
                  value={data.sales_administration?.toString() ?? ""}
                  onChange={(e) => setData({ ...data, sales_administration: e })}
                />
              </div>

              <InputError message={errors?.sales_administration} />
            </div>
          </div>
        </Show>
        <div className="p-0">
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
          {FormPrincipalSubmissionRateUtils.create.btn_label}
        </Button>
      </div>
    </form>
  );
};

export default FormPrincipalSubmissionRate;
