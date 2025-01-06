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
import mammoth from "mammoth";
import React, { useEffect, useRef, useState } from "react";
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      toast({
        title: "File tidak valid",
        description: "Hanya file Word (.docx) yang didukung.",
        variant: "destructive",
      });
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setData((prev) => ({ ...prev, format_document: result.value }));
    } catch (error) {
      toast({
        title: "Gagal memproses file",
        description: "Terjadi kesalahan saat mengonversi file Word.",
        variant: "destructive",
      });
    }
  };

  const cancel = () => {
    router.get(route(DocumentFormatUtils.link.index));
  };

  const submit = async () => {
    // Ambil konten dari TinyMCE
    const editor = editorRefs.current["format-document"]; // Sesuaikan dengan ID yang digunakan
    if (!editor) {
      console.error("Editor tidak ditemukan.");
      alert("Editor tidak ditemukan. Silakan coba lagi.");
      return;
    }

    const content = editor.getContent();

    console.log("Content:", content);

    // Set data ke format_document di state
    setData("format_document", content);

    // Validasi konten
    if (!content || content.trim() === "") {
      alert("Format dokumen tidak boleh kosong.");
      return;
    }

    if (!data.name || data.name.trim() === "") {
      alert("Nama tidak boleh kosong.");
      return;
    }

    // Tentukan data yang dikirim berdasarkan pemilihan
    let requestData: any = {
      name: data.name,
      format_document: content,
    };

    // Tentukan ID yang digunakan (guarantor_id, product_id, atau guarantor_to_product_type_id)
    if (byGuarantor && guarantorSelected) {
      requestData.guarantor_id = guarantorSelected; // Jika memilih berdasarkan Guarantor
    } else if (byProduct && productSelected) {
      requestData.product_id = productSelected; // Jika memilih berdasarkan Product
    } else if (byProductType && guarantorProductTypeSelected) {
      requestData.guarantor_to_product_type_id = guarantorProductTypeSelected; // Jika memilih berdasarkan Product Type
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
        data: requestData, // Kirim data beserta konten editor
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
      {/* <div>
        <TinyMCEEditor
          id="format-document"
          initialContent={""}
          onContentChange={(content: string) => {
            setData("format_document", content);
          }}
          onInit={(evt, editor) => {
            editorRefs.current["format-document"] = editor;
          }}
        />
      </div> */}
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
