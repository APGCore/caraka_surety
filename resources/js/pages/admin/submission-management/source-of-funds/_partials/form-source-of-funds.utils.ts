import { SourceOfFundsUtils } from "@/pages/admin/submission-management/source-of-funds/source-of-funds.utils";

export const FormSourceOfFundsUtils = {
    index: {
        route: SourceOfFundsUtils.link.index,
    },
    create: {
        route: SourceOfFundsUtils.link.store,
        title: "Tambah Sumber Dana",
        sub_title: "Tindakan ini akan menambah data Sumber Dana",
        btn_label: "Tambah Sumber Dana",
        toast_success: {
            title: "Berhasil",
            description: "Sumber Dana berhasil ditambahkan",
        },
        toast_failed: {
            title: "Gagal",
            description: "Sumber Dana gagal ditambahkan",
        },
    },
    edit: {
        route: SourceOfFundsUtils.link.update,
        title: "Edit Sumber Dana",
        sub_title: "Tindakan ini akan mengedit data Sumber Dana",
        btn_label: "Edit",
        toast_success: {
            title: "Berhasil",
            description: "Sumber Dana berhasil diedit",
        },
        toast_failed: {
            title: "Gagal",
            description: "Sumber Dana gagal diedit",
        },
    },
};
