import { EmployeeLimitsUtils } from "@/pages/admin/guarantor-management/employee-limit/employee-limits.utils";

export const FormEmployeeLimitsUtils = {
  redirect: EmployeeLimitsUtils.link.index,
  create: {
    route: EmployeeLimitsUtils.link.store,
    title: "Setting Limit",
    sub_title: "Tindakan ini akan mengatur data Batas Kewenangan Nilai Jaminan Pengguna",
    btn_label: "Setting Batas",
    class_name: "w-full",
    toast_success: {
      title: "Berhasil",
      description: "Batas Kewenangan Nilai Jaminan Pengguna berhasil di setting",
    },
    toast_failed: {
      title: "Gagal",
      description: "Batas Kewenangan Nilai Jaminan Pengguna gagal di setting",
    },
  },
  edit: {
    route: EmployeeLimitsUtils.link.update,
    title: "Setting Limit",
    sub_title: "Tindakan ini akan mengedit data Batas Kewenangan Nilai Jaminan Pengguna",
    btn_label: "Setting Batas",
    class_name: "w-full",
    toast_success: {
      title: "Berhasil",
      description: "Batas Kewenangan Nilai Jaminan Pengguna berhasil diubah",
    },
    toast_failed: {
      title: "Gagal",
      description: "Batas Kewenangan Nilai Jaminan Pengguna gagal diubah",
    },
  },
};
