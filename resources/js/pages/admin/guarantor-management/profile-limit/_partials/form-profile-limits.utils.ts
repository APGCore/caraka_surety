import { ProfileLimitsUtils } from "@/pages/admin/guarantor-management/profile-limit/profile-limits.utils";

export const FormProfileLimitsUtils = {
    redirect: ProfileLimitsUtils.link.index,
    create: {
        route: ProfileLimitsUtils.link.store,
        title: "Setting Limit",
        sub_title: "Tindakan ini akan mengatur data Batas Kewenangan Nilai Jaminan Kantor",
        btn_label: "Setting Limit",
        class_name: "w-full",
        toast_success: {
            title: "Berhasil",
            description: "Batas Kewenangan Nilai Jaminan Kantor berhasil di setting",
        },
        toast_failed: {
            title: "Gagal",
            description: "Batas Kewenangan Nilai Jaminan Kantor gagal di setting",
        },
    },
    edit: {
        route: ProfileLimitsUtils.link.update,
        title: "Setting Limit",
        sub_title: "Tindakan ini akan mengedit data Batas Kewenangan Nilai Jaminan Kantor",
        btn_label: "Setting Limit",
        class_name: "w-full",
        toast_success: {
            title: "Berhasil",
            description: "Batas Kewenangan Nilai Jaminan Kantor berhasil diubah",
        },
        toast_failed: {
            title: "Gagal",
            description: "Batas Kewenangan Nilai Jaminan Kantor gagal diubah",
        },
    },
};
