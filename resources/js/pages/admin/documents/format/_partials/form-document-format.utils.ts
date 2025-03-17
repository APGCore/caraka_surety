import { DocumentFormatUtils } from "@/pages/admin/documents/format/document-format.utils";

export const FormDocumentFormatUtils = {
    redirect: DocumentFormatUtils.link.index,
    create: {
        route: DocumentFormatUtils.link.store,
        title: "Setting Limit",
        sub_title: "Tindakan ini akan membuat format dokumen",
        btn_label: "Membuat Format Dokumen",
        class_name: "w-full",
        toast_success: {
            title: "Berhasil",
            description: "Format Dokumen berhasil dibuat",
        },
        toast_failed: {
            title: "Gagal",
            description: "Format Dokumen gagal dibuat",
        },
    },
    edit: {
        route: DocumentFormatUtils.link.update,
        title: "Setting Limit",
        sub_title: "Tindakan ini akan mengubah format dokumen",
        btn_label: "Mengubah Format Dokumen",
        class_name: "w-full",
        toast_success: {
            title: "Berhasil",
            description: "Format Dokumen berhasil diubah",
        },
        toast_failed: {
            title: "Gagal",
            description: "Format Dokumen gagal diubah",
        },
    },
};
