import { GuarantorRateUtils } from "@/pages/admin/guarantor-management/guarantor-rate/guarantor-rate.utils";

export const FormGuarantorRateUtils = {
    index: {
        route: GuarantorRateUtils.link.index,
    },
    create: {
        route: GuarantorRateUtils.link.store,
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
};
