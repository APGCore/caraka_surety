import { EmployeeLimitsUtils } from "@/pages/admin/guarantor-management/employee-limit/employee-limits.utils";

export const FormEmployeeLimitsUtils = {
  redirect: EmployeeLimitsUtils.link.index,
  create: {
    route: EmployeeLimitsUtils.link.store,
    title: "Setting Limit",
    sub_title: "Tindakan ini akan mengatur data Limit Pengajuan Karyawan",
    btn_label: "Setting Limit Pengajuan Karyawan",
    class_name: "w-full",
    toast_success: {
      title: "Berhasil",
      description: "Limit Pengajuan Karyawan berhasil di setting",
    },
    toast_failed: {
      title: "Gagal",
      description: "Limit Pengajuan Karyawan gagal di setting",
    },
  },
  edit: {
    route: EmployeeLimitsUtils.link.update,
    title: "Setting Limit",
    sub_title: "Tindakan ini akan mengedit data Limit Pengajuan Karyawan",
    btn_label: "Setting Limit Pengajuan Karyawan",
    class_name: "w-full",
    toast_success: {
      title: "Berhasil",
      description: "Limit Pengajuan Karyawan berhasil diubah",
    },
    toast_failed: {
      title: "Gagal",
      description: "Limit Pengajuan Karyawan gagal diubah",
    },
  },
};
