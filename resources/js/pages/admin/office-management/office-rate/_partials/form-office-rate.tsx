import { textCurrency } from "@/common/utils/text-currency";
import { Button } from "@/components/_shadcn-ui/button";
import { Input } from "@/components/_shadcn-ui/input";
import Show from "@/components/atoms/show";
import InputCurrency from "@/components/molecules/input/currency-input";
import InputError from "@/components/molecules/input/error-input";
import { FormOfficeRateUtils } from "@/pages/admin/office-management/office-rate/_partials/form-office-rate.utils";
import { router, useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import React from "react";

interface FormOfficeRateProps {
    profileId: number | string;
    guarantorId: number | string;
    guarantorBranchId?: number | string | null;
    guarantorToProductTypeId: number | string;
    rate?: any;
}

const FormOfficeRate: React.FC<FormOfficeRateProps> = ({
    profileId,
    guarantorId,
    guarantorBranchId,
    guarantorToProductTypeId,
    rate,
}) => {
    const { data, setData, post, errors, processing } = useForm<{
        profile_id: number | string;
        guarantor_id: number | string;
        guarantor_branch_id?: number | string | null;
        guarantor_to_product_type_id: number | string;
        minimum_bill?: string;
        selling_rate?: number;
        sales_administration?: string;
        management_fee?: number;
        minimum_management_fee?: string;
    }>({
        profile_id: profileId,
        guarantor_id: guarantorId,
        guarantor_branch_id: guarantorBranchId ?? undefined,
        guarantor_to_product_type_id: guarantorToProductTypeId,
        minimum_bill: textCurrency(rate?.minimum_bill),
        selling_rate: rate?.selling_rate,
        sales_administration: textCurrency(rate?.sales_administration),
        management_fee: rate?.management_fee,
        minimum_management_fee: textCurrency(rate?.minimum_management_fee),
    });

    const submit = () => {
        post(route(FormOfficeRateUtils.create.route), {
            preserveState: true,
            preserveScroll: true,
            onError: (params) => {
                console.log(params);
            },
        });
    };

    const handleBack = () => {
        router.get(
            route(FormOfficeRateUtils.index.route, {
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
                            <InputCurrency
                                value={data.minimum_management_fee?.toString() ?? ""}
                                onChange={(e) => setData({ ...data, minimum_management_fee: e })}
                            />
                        </div>

                        <InputError message={errors?.minimum_management_fee} />
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
                    {FormOfficeRateUtils.create.btn_label}
                </Button>
            </div>
        </form>
    );
};

export default FormOfficeRate;
