import { toast } from "@/common/hooks/general/use-toast";
import { Button } from "@/components/_shadcn-ui/button";
import { Input } from "@/components/_shadcn-ui/input";
// import Checkbox from "@/components/common/checkbox";
import SecondaryButton from "@/components/atoms/button/secondary-button";
import SubmissionUiPlaceholder from "@/components/documents/submission-ui-placeholder";
import TinyMCEEditor from "@/components/documents/tiny-mce-editor";
import { Combobox } from "@/components/molecules/combobox";
import InputError from "@/components/molecules/input/error-input";
import InputLabel from "@/components/molecules/input/label-input";
import { DocumentFormatUtils } from "@/pages/admin/documents/format/document-format.utils";
import { router, useForm } from "@inertiajs/react";
import { pickBy } from "lodash";
import { LoaderCircle } from "lucide-react";
import React, { useRef } from "react";
import { FormDocumentFormatUtils } from "./form-document-format.utils";

interface FormProfileLimitsProps {
  isEdit?: boolean;
  guarantors: any;
  guarantorSelected?: number;
  products: any;
  productSelected?: any;
  guarantorProductTypes?: any;
  guarantorProductTypeSelected?: any;
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
  const { data, setData, post, put, errors, processing }: any = useForm({
    guarantor_id: guarantorSelected || null,
    product_id: productSelected || null,
    guarantor_to_product_type_id: guarantorProductTypeSelected || null,
    name: documentFormat?.name || "",
    format_document: documentFormat?.format_document || "",
  });

  const handleSelectGuarantor = (guarantorId: number) => {
    const id = guarantorSelected === guarantorId ? undefined : guarantorId;
    setData("guarantor_id", id);
    getData(id);
  };

  const handleSelectGuarantorProduct = (guarantorProductId: number) => {
    const id = productSelected === guarantorProductId ? undefined : guarantorProductId;
    setData("product_id", id);
    getData(guarantorSelected, id);
  };
  const handleSelectGuarantorProductType = (guarantorProductTypeId: number) => {
    const id = guarantorProductTypeSelected === guarantorProductTypeId ? undefined : guarantorProductTypeId;
    setData("guarantor_to_product_type_id", id);
    getData(guarantorSelected, productSelected, id);
  };

  const getData = (guarantorId?: number, guarantorProductId?: number, guarantorProductTypeId?: number) => {
    router.get(
      route(DocumentFormatUtils.link.create),
      pickBy({
        guarantor_id: guarantorId,
        guarantor_product_id: guarantorProductId,
        guarantor_to_product_type_id: guarantorProductTypeId,
      }),
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  const cancel = () => {
    router.get(route(DocumentFormatUtils.link.index));
  };

  console.log("Guarantor Selected:", guarantorSelected);
  console.log("Product Selected:", productSelected);
  console.log("Guarantor Product Type Selected:", guarantorProductTypeSelected);
  console.log("Data:", data);
  const submit = async () => {
    // Ambil konten dari TinyMCE
    const editor = editorRefs.current["format-document"];
    if (!editor) {
      console.error("Editor tidak ditemukan.");
      alert("Editor tidak ditemukan. Silakan coba lagi.");
      return;
    }

    const content = editor.getContent();

    console.log("Content:", content);

    setData("format_document", content);

    let requestData: any = {
      name: data.name,
      guarantor_id: guarantorSelected,
      product_id: productSelected,
      guarantor_to_product_type_id: guarantorProductTypeSelected,
      format_document: content,
    };

    console.log("Request Data:", requestData);

    // Kirim data dengan cara yang sesuai (PUT atau POST)
    if (isEdit) {
      put(route(FormDocumentFormatUtils.edit.route, documentFormat.id), {
        preserveState: true,
        preserveScroll: true,
        data: requestData,
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
        data: requestData,
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
      console.log("Request Data up:", requestData);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault(); // Mencegah reload halaman
    submit(); // Panggil fungsi submit
  };

  const editorRefs = useRef<{ [key: string]: any }>({});

  return (
    <div className="mt-6 space-y-6">
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
      <div className="space-y-2">
        <InputLabel htmlFor="guarantor_product" value="Produk" />
        <Combobox
          datas={products}
          labelKey={"name"}
          valueKey={"name"}
          defaultValue={productSelected}
          placeholder={"Pilih Produk"}
          className={"w-min-[210px]"}
          onSelect={(value) => {
            handleSelectGuarantorProduct(value.id);
          }}
        />
        <InputError className="mt-2" message={errors.guarantor_to_product_type_id} />
      </div>
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
      <div className="space-y-2">
        <InputLabel htmlFor="name" value="Nama" />
        <Input className={"w-full"} id="name" value={data.name} onChange={(e) => setData("name", e.target.value)} />
        <InputError className="mt-2" message={errors.name} />
      </div>
      <div>
        <TinyMCEEditor
          id="format-document"
          initialContent={data.format_document}
          onContentChange={(content: string) => {
            setData("format_document", content);
          }}
          onInit={(evt, editor) => {
            editorRefs.current["format-document"] = editor;
          }}
        />
      </div>

      <SubmissionUiPlaceholder />
      <div className="flex items-center gap-4 justify-end">
        <SecondaryButton onClick={cancel}>Batal</SecondaryButton>

        <Button
          onClick={handleSubmit} // Ganti dengan submit untuk memanggil fungsi submit
          disabled={processing}>
          {processing && <LoaderCircle className="animate-spin mr-1 flex-shrink-0" />}
          Simpan
        </Button>
      </div>
    </div>
  );
};

export default FormDocumentFormat;
