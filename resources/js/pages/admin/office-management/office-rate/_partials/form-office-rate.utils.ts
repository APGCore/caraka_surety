import { OfficeRateUtils } from "@/pages/admin/office-management/office-rate/office-rate.utils";

export const FormOfficeRateUtils = {
    index: {
        route: OfficeRateUtils.link.index,
    },
    create: {
        route: OfficeRateUtils.link.store,
        title: "Setting Tarif Unit Bisnis",
        sub_title: "Tindakan ini akan mengatur data Tarif Unit Bisnis",
        btn_label: "Simpan",
        class_name: "w-full",
        toast_success: {
            title: "Berhasil",
            description: "Tarif Unit Bisnis berhasil di setting",
        },
        toast_failed: {
            title: "Gagal",
            description: "Tarif Unit Bisnis gagal di setting",
        },
    },
};
