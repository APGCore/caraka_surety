import Checkbox from "@/components/common/checkbox";
import { Combobox } from "@/components/common/combobox";
import InputError from "@/components/common/input-error";
import InputLabel from "@/components/common/input-label";
import PrimaryButton from "@/components/common/primary-button";
import SecondaryButton from "@/components/common/secondary-button";
import Show from "@/components/common/show";
import { Input } from "@/components/ui/input";
import { DocumentFormatUtils } from "@/pages/admin/documents/format/document-format.utils";
import { router, useForm } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useState } from "react";

interface FormProfileLimitsProps {
  isEdit?: boolean;
  guarantors: any;
  guarantorSelected?: number;
  products: any;
  productSelected?: number;
  guarantorProductTypes?: any;
  guarantorProductTypeSelected?: number;
  documentFormat?: any;
}

const FormDocumentFormat: React.FC<FormProfileLimitsProps> = ({
  isEdit,
  guarantors,
  guarantorSelected,
  products,
  productSelected,
  guarantorProductTypes,
  guarantorProductTypeSelected,
  documentFormat,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [byGuarantor, setByGuarantor] = useState<boolean>(() => !!guarantorSelected);
  const [byProduct, setByProduct] = useState<boolean>(() => !!productSelected);
  const [byProductType, setByProductType] = useState<boolean>(() => !!guarantorProductTypeSelected);

  const { data, setData, post, errors, processing } = useForm<{
    guarantor_id: number;
    product_id: number;
    guarantor_to_product_type_id: number;
    name: string;
    format_document: string;
  }>({
    guarantor_id: guarantorSelected || 0,
    product_id: productSelected || 0,
    guarantor_to_product_type_id: guarantorProductTypeSelected || 0,
    name: documentFormat?.name || "",
    format_document: documentFormat?.format_document || "",
  });

  const checkByGuarantor = (checked: boolean) => {
    setByGuarantor(checked);
    if (!checked) {
      setByProductType(false);
    }
    if (!checked && guarantorSelected) {
      getData();
      setData((previousData) => ({ ...previousData, guarantor_id: 0, guarantor_to_product_type_id: 0 }));
    }
  };

  const checkByProduct = (checked: boolean) => {
    setByProduct(checked);
    if (!checked && productSelected) {
      getData(guarantorSelected);
      setData("product_id", 0);
    }
  };

  const checkByProductType = (checked: boolean) => {
    setByGuarantor(byGuarantor || checked);
    setByProduct(byProduct || checked);
    setByProductType(checked);
    if (!checked && guarantorProductTypeSelected) {
      getData(guarantorSelected, productSelected);
      setData("guarantor_to_product_type_id", 0);
    }
  };

  const handleSelectGuarantor = (guarantorId: number) => {
    const id = guarantorSelected === guarantorId ? undefined : guarantorId;
    getData(id);
  };

  const handleSelectGuarantorProduct = (guarantorProductId: number) => {
    const id = productSelected === guarantorProductId ? undefined : guarantorProductId;
    getData(guarantorSelected, id);
  };
  const handleSelectGuarantorProductType = (guarantorProductTypeId: number) => {
    const id = guarantorProductTypeSelected === guarantorProductTypeId ? undefined : guarantorProductTypeId;
    getData(guarantorSelected, productSelected, id);
  };

  const getData = (guarantorId?: number, guarantorProductId?: number, guarantorProductTypeId?: number) => {
    router.get(
      route(DocumentFormatUtils.link.create),
      pickBy({
        guarantor_id: guarantorId,
        product_id: guarantorProductId,
        guarantor_product_type_id: guarantorProductTypeId,
      }),
    );
  };

  const cancel = () => {
    router.get(route(DocumentFormatUtils.link.index));
  };

  const submit = () => {
    //   setIsLoading(true);
    //
    //   if (isEdit) {
    //     axios
    //       .put(route(FormDocumentFormatUtils.edit.route, profile?.profile_limit?.id), { ...dataForm })
    //       .then(() => {
    //         toast({
    //           ...FormDocumentFormatUtils.edit.toast_success,
    //         });
    //         setErrors(defaultErrors);
    //         setIsOpenForm(false);
    //         router.get(
    //           route(FormDocumentFormatUtils.redirect, {
    //             guarantor_id: guarantorSelectedId,
    //             guarantor_product_id: guarantorProductId,
    //             guarantor_product_type_id: guarantorProductTypeId,
    //           }),
    //         );
    //       })
    //       .catch((error) => {
    //         setErrors(error.response.data.errors);
    //         toast({
    //           ...FormDocumentFormatUtils.edit.toast_failed,
    //           variant: "destructive",
    //         });
    //       })
    //       .finally(() => {
    //         setIsLoading(false);
    //       });
    //   } else {
    //     axios
    //       .post(route(FormDocumentFormatUtils.create.route), { ...dataForm })
    //       .then(() => {
    //         toast({
    //           ...FormDocumentFormatUtils.create.toast_success,
    //         });
    //         setErrors(defaultErrors);
    //         setIsOpenForm(false);
    //         router.get(
    //           route(FormDocumentFormatUtils.redirect, {
    //             guarantor_id: guarantorSelectedId,
    //             guarantor_product_id: guarantorProductId,
    //             guarantor_product_type_id: guarantorProductTypeId,
    //           }),
    //         );
    //       })
    //       .catch((error) => {
    //         setErrors(error.response.data.errors);
    //         toast({
    //           ...FormDocumentFormatUtils.create.toast_failed,
    //           variant: "destructive",
    //         });
    //       })
    //       .finally(() => {
    //         setIsLoading(false);
    //       });
    //   }
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-6">
      <div className="flex items-center justify-around gap-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="byGuarantors" checked={byGuarantor} onChange={(e) => checkByGuarantor(e.target.checked)} />
          <label
            htmlFor="byGuarantors"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Berdasarkan Asuransi
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="byProducts" checked={byProduct} onChange={(e) => checkByProduct(e.target.checked)} />
          <label
            htmlFor="byProducts"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Berdasarkan Produk
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="byProductTypes"
            checked={byProductType}
            onChange={(e) => checkByProductType(e.target.checked)}
          />
          <label
            htmlFor="byProductTypes"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Berdasarkan Jenis Jaminan
          </label>
        </div>
      </div>
      <Show when={byGuarantor}>
        <div className="space-y-2">
          <InputLabel htmlFor="guarantor" value="Asuransi" />
          <Combobox
            datas={guarantors}
            labelKey={"name"}
            valueKey={"name"}
            defaultValue={guarantorSelected}
            placeholder={"Pilih Penjamin"}
            className={"w-min-[210px]"}
            onSelect={(value) => handleSelectGuarantor(value.id)}
          />
          <InputError className="mt-2" message={errors.guarantor_id} />
        </div>
      </Show>
      <Show when={byProduct}>
        <div className="space-y-2">
          <InputLabel htmlFor="guarantor_product" value="Produk" />
          <Combobox
            datas={products}
            labelKey={"name"}
            valueKey={"name"}
            defaultValue={productSelected}
            placeholder={"Pilih Produk"}
            className={"w-min-[210px]"}
            onSelect={(value) => handleSelectGuarantorProduct(value.id)}
          />
          <InputError className="mt-2" message={errors.guarantor_to_product_type_id} />
        </div>
      </Show>
      <Show when={byProductType}>
        <div className="space-y-2">
          <InputLabel htmlFor="guarantor_product_type" value="Jenis Jaminan" />
          <Combobox
            datas={guarantorProductTypes}
            labelKey={"full_name"}
            valueKey={"full_name"}
            defaultValue={guarantorProductTypeSelected}
            placeholder={"Pilih Jenis Jaminan"}
            className={"w-min-[210px]"}
            onSelect={(value) => handleSelectGuarantorProductType(value.id)}
          />
          <InputError className="mt-2" message={errors.guarantor_to_product_type_id} />
        </div>
      </Show>
      <div className="space-y-2">
        <InputLabel htmlFor="name" value="Nama" />
        <Input className={"w-full"} id="name" value={data.name} onChange={(e) => setData("name", e.target.value)} />
        <InputError className="mt-2" message={errors.name} />
      </div>
      <div className="flex items-center gap-4 justify-end">
        <SecondaryButton onClick={cancel}>Batal</SecondaryButton>

        <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
      </div>
    </form>
  );
};

export default FormDocumentFormat;
