import { InvoiceUtils } from "@/pages/report/invoice/_partials/invoice.utils";

export const FormPrincipalSubmissionRateUtils = {
  index: {
    route: InvoiceUtils.link.show,
  },
  create: {
    route: InvoiceUtils.link.store,
    title: "Setting Tarif Perusahaan Di Pengajuan",
    sub_title: "Tindakan ini akan mengatur data Tarif Perusahaan dan Pengajuan",
    btn_label: "Simpan",
    class_name: "w-full",
    toast_success: {
      title: "Berhasil",
      description: "Tarif berhasil di setting",
    },
    toast_failed: {
      title: "Gagal",
      description: "Tarif gagal di setting",
    },
  },
  send_to_finance: {
    route: InvoiceUtils.link.send_to_finance,
  },
};
