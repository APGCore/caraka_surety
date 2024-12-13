import Checkbox from "@/components/common/checkbox";
import { Combobox } from "@/components/common/combobox";
import InputError from "@/components/common/input-error";
import InputLabel from "@/components/common/input-label";
import SecondaryButton from "@/components/common/secondary-button";
import Show from "@/components/common/show";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/general/use-toast";
import { DocumentFormatUtils } from "@/pages/admin/documents/format/document-format.utils";
import { router, useForm } from "@inertiajs/react";
import { Editor } from "@tinymce/tinymce-react";
import { pickBy } from "lodash";
import { LoaderCircle } from "lucide-react";
import React, { useRef, useState } from "react";
import { FormDocumentFormatUtils } from "./form-document-format.utils";

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
  const [byGuarantor, setByGuarantor] = useState<boolean>(() => !!guarantorSelected);
  const [byProduct, setByProduct] = useState<boolean>(() => !!productSelected);
  const [byProductType, setByProductType] = useState<boolean>(() => !!guarantorProductTypeSelected);
  const editorRef = useRef<any>(null);

  const { data, setData, post, put, errors, processing } = useForm<{
    guarantor_id: number | null;
    product_id: number | null;
    guarantor_to_product_type_id: number | null;
    name: string;
    format_document: string;
  }>({
    guarantor_id: guarantorSelected || null,
    product_id: productSelected || null,
    guarantor_to_product_type_id: guarantorProductTypeSelected || null,
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
      setData((previousData) => ({ ...previousData, guarantor_id: null, guarantor_to_product_type_id: null }));
    }
  };

  const checkByProduct = (checked: boolean) => {
    setByProduct(checked);
    if (!checked && productSelected) {
      getData(guarantorSelected);
      setData("product_id", null);
    }
  };

  const checkByProductType = (checked: boolean) => {
    setByGuarantor(byGuarantor || checked);
    setByProduct(byProduct || checked);
    setByProductType(checked);
    if (!checked && guarantorProductTypeSelected) {
      getData(guarantorSelected, productSelected);
      setData("guarantor_to_product_type_id", null);
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
        guarantor_to_product_type_id: guarantorProductTypeId,
      }),
    );
  };

  const cancel = () => {
    router.get(route(DocumentFormatUtils.link.index));
  };

  const submit = () => {
    if (isEdit) {
      put(route(FormDocumentFormatUtils.edit.route, documentFormat.id), {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          toast(FormDocumentFormatUtils.edit.toast_success);
          router.get(route(FormDocumentFormatUtils.redirect));
        },
        onError: () => {
          toast({
            ...FormDocumentFormatUtils.edit.toast_failed,
            variant: "destructive",
          });
        },
      });
    } else {
      post(route(FormDocumentFormatUtils.create.route), {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          toast(FormDocumentFormatUtils.create.toast_success);
          router.get(route(FormDocumentFormatUtils.redirect));
        },
        onError: () => {
          toast({
            ...FormDocumentFormatUtils.create.toast_failed,
            variant: "destructive",
          });
        },
      });
    }
  };

  return (
    <div className="mt-6 space-y-6">
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
      <div className="space-y-2">
        <InputLabel htmlFor="format_document" value="Format Dokumen" />
        <Editor
          apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
          onInit={(evt, editor) => (editorRef.current = editor)}
          init={{
            plugins: [
              // Core editing features
              "anchor",
              "autolink",
              "charmap",
              "codesample",
              "emoticons",
              "image",
              "link",
              "lists",
              "media",
              "searchreplace",
              "table",
              "visualblocks",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
            tinycomments_mode: "embedded",
            tinycomments_author: "Author name",
            mergetags_list: [
              { value: "First.Name", title: "First Name" },
              { value: "Email", title: "Email" },
            ],
          }}
          initialValue={data.format_document}
          onChange={(content: any) => setData("format_document", content.target.getContent())}
        />
        <InputError className="mt-2" message={errors.format_document} />
      </div>
      <div className="flex items-center gap-4 justify-end">
        <SecondaryButton onClick={cancel}>Batal</SecondaryButton>

        <Button onClick={submit} disabled={processing}>
          {processing && <LoaderCircle className="animate-spin mr-1 flex-shrink-0" />}
          Simpan
        </Button>
      </div>
    </div>
  );
};

export default FormDocumentFormat;
