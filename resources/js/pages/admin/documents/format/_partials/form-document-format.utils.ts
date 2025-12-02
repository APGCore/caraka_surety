import { DocumentFormatUtils } from "@/pages/admin/documents/format/document-format.utils";

export const FormDocumentFormatUtils = {
  redirect: DocumentFormatUtils.link.index,
  create: {
    route: DocumentFormatUtils.link.store,
    title: "Setting Limit",
    sub_title: "Tindakan ini akan membuat Dokumen Luaran",
    btn_label: "Membuat Dokumen Luaran",
    class_name: "w-full",
    toast_success: {
      title: "Berhasil",
      description: "Dokumen Luaran berhasil dibuat",
    },
    toast_failed: {
      title: "Gagal",
      description: "Dokumen Luaran gagal dibuat",
    },
  },
  edit: {
    route: DocumentFormatUtils.link.update,
    title: "Setting Limit",
    sub_title: "Tindakan ini akan mengubah Dokumen Luaran",
    btn_label: "Mengubah Dokumen Luaran",
    class_name: "w-full",
    toast_success: {
      title: "Berhasil",
      description: "Dokumen Luaran berhasil diubah",
    },
    toast_failed: {
      title: "Gagal",
      description: "Dokumen Luaran gagal diubah",
    },
  },
};
