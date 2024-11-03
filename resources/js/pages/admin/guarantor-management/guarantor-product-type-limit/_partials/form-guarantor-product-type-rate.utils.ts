import { GuarantorProductTypeRateUtils } from "@/pages/admin/guarantor-management/guarantor-product-type-limit/guarantor-product-type-rate.utils";

export const FormGuarantorProductTypeRateUtils = {
  index: {
    route: GuarantorProductTypeRateUtils.link.index,
  },
  create: {
    route: GuarantorProductTypeRateUtils.link.store,
    title: "Setting Tarif Asuransi",
    sub_title: "Tindakan ini akan mengatur data Tarif Asuransi",
    btn_label: "Simpan",
    class_name: "w-full",
    toast_success: {
      title: "Berhasil",
      description: "Tarif Asuransi berhasil di setting",
    },
    toast_failed: {
      title: "Gagal",
      description: "Tarif Asuransi gagal di setting",
    },
  },
  update: {
    route: GuarantorProductTypeRateUtils.link.update,
  },
};
