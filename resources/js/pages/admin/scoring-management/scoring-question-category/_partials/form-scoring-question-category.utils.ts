export const FormSkoringQuestionCategoryUtils = {
    fallback: {
        route: {
            index: "scoring-question-category.index",
        },
    },
    create: {
        route: "scoring-question-category.store",
        title: "Tambah Kategori Pertanyaan Skoring",
        sub_title: "Tindakan ini akan menambah data Kategori Pertanyaan Skoring",
        btn_label: "Tambah",
        toast_success: {
            title: "Berhasil",
            description: "Kategori Pertanyaan Skoring berhasil ditambahkan",
        },
        toast_failed: {
            title: "Gagal",
            description: "Kategori Pertanyaan Skoring gagal ditambahkan",
        },
    },
    edit: {
        route: "scoring-question-category.update",
        title: "Edit Kategori Pertanyaan Skoring",
        sub_title: "Tindakan ini akan mengedit data Kategori Pertanyaan Skoring",
        btn_label: "Edit",
        toast_success: {
            title: "Berhasil",
            description: "Kategori Pertanyaan Skoring berhasil diedit",
        },
        toast_failed: {
            title: "Gagal",
            description: "Kategori Pertanyaan Skoring gagal diedit",
        },
    },
};
