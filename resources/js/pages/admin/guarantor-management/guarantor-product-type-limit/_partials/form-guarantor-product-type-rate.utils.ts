import { GuarantorProductTypeRateUtils } from "@/pages/admin/guarantor-management/guarantor-product-type-limit/guarantor-product-type-rate.utils";

export const FormGuarantorProductTypeRateUtils = {
  index: {
    route: GuarantorProductTypeRateUtils.link.index,
  },
  create: {
    route: GuarantorProductTypeRateUtils.link.store,
    title: "Setting Batas Kewenangan",
    sub_title: "Tindakan ini akan mengatur data Batas Kewenangan Nilai Jaminan Produk Asuransi",
    btn_label: "Simpan",
    class_name: "w-full",
    toast_success: {
      title: "Berhasil",
      description: "Batas Kewenangan Nilai Jaminan Produk Asuransi berhasil di setting",
    },
    toast_failed: {
      title: "Gagal",
      description: "Batas Kewenangan Nilai Jaminan Produk Asuransi gagal di setting",
    },
  },
  update: {
    route: GuarantorProductTypeRateUtils.link.update,
    title: "Setting Batas Kewenangan",
    sub_title: "Tindakan ini akan mengatur data Batas Kewenangan Nilai Jaminan Produk Asuransi",
    btn_label: "Ubah",
    class_name: "w-full",
    toast_success: {
      title: "Berhasil",
      description: "Batas Kewenangan Nilai Jaminan Produk Asuransi berhasil di setting",
    },
    toast_failed: {
      title: "Gagal",
      description: "Batas Kewenangan Nilai Jaminan Produk Asuransi gagal di setting",
    },
  },
};
