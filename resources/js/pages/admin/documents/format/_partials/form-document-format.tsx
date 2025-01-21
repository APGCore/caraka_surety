import Checkbox from "@/components/common/checkbox";
import { Combobox } from "@/components/common/combobox";
import InputError from "@/components/common/input-error";
import InputLabel from "@/components/common/input-label";
import SecondaryButton from "@/components/common/secondary-button";
import Show from "@/components/common/show";
import TinyMCEEditor from "@/components/documents/TinyMCEEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/general/use-toast";
import { DocumentFormatUtils } from "@/pages/admin/documents/format/document-format.utils";
import { router, useForm } from "@inertiajs/react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { debounce, pickBy } from "lodash";
import { LoaderCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
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
    if (checked) {
      setByGuarantor(true);
      setByProductType(false);
    } else if (productSelected) {
      getData(guarantorSelected);
      setData("product_id", null);
    }
  };

  const checkByProductType = (checked: boolean) => {
    setByProductType(checked);
    if (checked) {
      setByGuarantor(true);
      setByProduct(true);
    } else if (guarantorProductTypeSelected) {
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
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  console.log("Data:", documentFormat);

  const cancel = () => {
    router.get(route(DocumentFormatUtils.link.index));
  };

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
      guarantor_id: data.guarantor_id,
      product_id: data.product_id,
      guarantor_to_product_type_id: data.guarantor_to_product_type_id,
      format_document: content,
    };

    console.log("Request Data:", requestData);
    if (byGuarantor && guarantorSelected) {
      requestData.guarantor_id = guarantorSelected;
    } else if (byProduct && productSelected) {
      requestData.product_id = productSelected;
    } else if (byProductType && guarantorProductTypeSelected) {
      requestData.guarantor_to_product_type_id = guarantorProductTypeSelected;
    }

    // Validasi tambahan untuk ID
    if (!requestData.guarantor_id && !requestData.product_id && !requestData.guarantor_to_product_type_id) {
      alert("Pilih ID yang valid untuk menyimpan.");
      return;
    }

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
        data: requestData, // Kirim data beserta konten editor
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
      console.log("Request Data:", requestData);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault(); // Mencegah reload halaman
    submit(); // Panggil fungsi submit
  };

  const editorRefs = useRef<{ [key: string]: any }>({});

  const handleSave = async (editorId: string) => {
    const editor = editorRefs.current[editorId];
    let submissionId;

    // Tentukan ID yang digunakan (guarantor_id, product_id, atau guarantor_product_type_id)
    if (byGuarantor && guarantorSelected) {
      submissionId = guarantorSelected; // Jika memilih berdasarkan Guarantor
    } else if (byProduct && productSelected) {
      submissionId = productSelected; // Jika memilih berdasarkan Product
    } else if (byProductType && guarantorProductTypeSelected) {
      submissionId = guarantorProductTypeSelected; // Jika memilih berdasarkan Product Type
    }

    if (!submissionId) {
      alert("Pilih ID yang valid untuk menyimpan.");
      return;
    }

    // Pastikan editor ditemukan dan mengambil konten
    if (editor) {
      const content = editor.getContent();

      try {
        const response = await axios.post("/staff/submission-management/save-content", {
          submission_id: submissionId,
          name: editorId,
          format_document: content,
        });

        alert(`Data dari editor "${editorId}" untuk ID ${submissionId} berhasil disimpan!`);
        console.log("Response Data:", response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error("Error Response:", error.response.data);
            alert("Gagal menyimpan data. Silakan coba lagi.");
          } else if (error.request) {
            console.error("No Response:", error.request);
            alert("Terjadi kesalahan jaringan. Silakan coba lagi.");
          } else {
            console.error("Axios Error:", error.message);
          }
        } else {
          console.error("Unexpected Error:", error);
          alert("Terjadi kesalahan tak terduga. Silakan coba lagi.");
        }
      }
    } else {
      console.error(`Editor dengan ID "${editorId}" tidak ditemukan.`);
    }
  };

  const formatDocumentRef = useRef(""); // Tempat menyimpan konten editor

  const handleContentChange = (content: string) => {
    formatDocumentRef.current = content;
    setData("format_document", content);
  };

  console.log("Content formatref:", formatDocumentRef.current);

  //   const handleEditorInit = (evt, editor) => {
  //     editorRefs.current["format-document"] = editor;

  //     // Inisialisasi konten pertama kali
  //     editor.setContent("Konten awal di sini!");
  //   };

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
            labelKey={"name"}
            valueKey={"name"}
            defaultValue={guarantorProductTypeSelected}
            placeholder={"Pilih Jenis Jaminan"}
            className={"w-min-[210px]"}
            onSelect={(value) => handleSelectGuarantorProductType(value.id)}
          />
          <InputError className="mt-2" message={errors.guarantor_to_product_type_id} />
        </div>
      </Show>
      {/* <div className="space-y-2">
        <InputLabel htmlFor="name" value="Nama" />
        <Input className={"w-full"} id="name" value={data.name} onChange={(e) => setData("name", e.target.value)} />
        <InputError className="mt-2" message={errors.name} />
      </div> */}
      <div className="space-y-2">
        <InputLabel htmlFor="name" value="Nama" />

        <Combobox
          datas={[{ name: "SPKMGR" }, { name: "ADMIN" }, { name: "USER" }]}
          labelKey="name"
          valueKey="name"
          defaultValue={data.name}
          placeholder="Pilih Nama"
          className="w-full min-w-[210px]" // Menyesuaikan ukuran combobox
          onSelect={(value) => setData("name", value.name)} // Mengupdate data saat memilih "spkmgr"
        />

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
