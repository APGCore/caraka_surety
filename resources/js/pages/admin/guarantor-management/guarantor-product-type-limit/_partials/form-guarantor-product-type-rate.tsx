import InputCurrency from "@/components/common/input-currency";
import InputError from "@/components/common/input-error";
import { Button } from "@/components/ui/button";
import { FormGuarantorProductTypeRateUtils } from "@/pages/admin/guarantor-management/guarantor-product-type-limit/_partials/form-guarantor-product-type-rate.utils";
import { FormGuarantorRateUtils } from "@/pages/admin/guarantor-management/guarantor-rate/_partials/form-guarantor-rate.utils";
import { useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import React from "react";

interface FormGuarantorProductTypeLimitsProps {
  guarantorProductType: any;
  closeForm?: () => void;
}

const FormGuarantorProductTypeRate: React.FC<FormGuarantorProductTypeLimitsProps> = ({
  guarantorProductType,
  closeForm,
}) => {
  const { data, setData, post, put, errors, processing } = useForm<{
    id?: number;
    guarantor_id: number;
    guarantor_to_product_type_id: number;
    limit: string | number | undefined;
    limit_inherit: string | number | undefined;
  }>({
    id: guarantorProductType.limit?.id,
    guarantor_id: guarantorProductType.guarantor_id,
    guarantor_to_product_type_id: guarantorProductType.id,
    limit: guarantorProductType.limit?.limit ?? "",
    limit_inherit: guarantorProductType.limit?.limit_inherit ?? false,
  });

  const submit = () => {
    if (data.id) {
      put(route(FormGuarantorProductTypeRateUtils.update.route, data.id), {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          closeForm && closeForm();
        },
      });
    } else {
      post(route(FormGuarantorProductTypeRateUtils.create.route), {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          closeForm && closeForm();
        },
      });
    }
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
            Limit Nilai Jaminan
          </label>

          <div className="flex items-center space-x-4">
            <span className="text-gray-900 text-sm">Rp. </span>
                      <InputCurrency
                          placeholder="Limit Nilai Jaminan"
              value={data.limit?.toString() ?? ""}
              onChange={(e) => setData({ ...data, limit: e || "" })}
            />
          </div>

          <InputError message={errors?.limit} />
        </div>

        <div className="space-y-2">
          <label htmlFor="limit-inherit" className="block text-sm font-medium text-gray-700">
            Limit Turunan
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-gray-900 text-sm">Rp. </span>
            <InputCurrency
                          value={ data.limit_inherit ?   data.limit_inherit?.toString() : ""}
                          placeholder="Limit Nilai Jaminan Turunan"
              onChange={(e) => setData({ ...data, limit_inherit: e || "" })}
            />
          </div>
          <InputError message={errors?.limit_inherit} />
        </div>
      </div>
      <div className="flex justify-end gap-x-3">
        <Button type="reset" onClick={closeForm}>
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

export default FormGuarantorProductTypeRate;
