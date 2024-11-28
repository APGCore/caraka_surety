import { DocumentFormatUtils } from "@/pages/admin/documents/format/document-format.utils";

export const FormDocumentFormatUtils = {
  redirect: DocumentFormatUtils.link.index,
  create: {
    route: DocumentFormatUtils.link.store,
    title: "Setting Limit",
    sub_title: "Tindakan ini akan mengatur data Limit Pengajuan Kantor",
    btn_label: "Setting Limit Pengajuan Kantor",
    class_name: "w-full",
    toast_success: {
      title: "Berhasil",
      description: "Limit Pengajuan Kantor berhasil di setting",
    },
    toast_failed: {
      title: "Gagal",
      description: "Limit Pengajuan Kantor gagal di setting",
    },
  },
  edit: {
    route: DocumentFormatUtils.link.update,
    title: "Setting Limit",
    sub_title: "Tindakan ini akan mengedit data Limit Pengajuan Kantor",
    btn_label: "Setting Limit Pengajuan Kantor",
    class_name: "w-full",
    toast_success: {
      title: "Berhasil",
      description: "Limit Pengajuan Kantor berhasil diubah",
    },
    toast_failed: {
      title: "Gagal",
      description: "Limit Pengajuan Kantor gagal diubah",
    },
  },
};
