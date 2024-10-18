import { ProfileLimitsUtils } from "@/pages/admin/guarantor-management/profile-limit/profile-limits.utils";

export const FormProfileLimitsUtils = {
  redirect: ProfileLimitsUtils.link.index,
  create: {
    route: ProfileLimitsUtils.link.store,
    title: "Setting Limit",
    sub_title: "Tindakan ini akan mengatur data Limit Pengajuan Kantor",
    btn_label: "Setting Limit Pengajuan Kantor",
    class_name: "w-full",
    toast_success: {
      title: "Berhasil",
      description: "Limit Pengajuan Kantor berhasil di setting",
    },
    toast_failed: {
      title: "Gagal",
      description: "Limit Pengajuan Kantor gagal di setting",
    },
  },
  edit: {
    route: ProfileLimitsUtils.link.update,
    title: "Setting Limit",
    sub_title: "Tindakan ini akan mengedit data Limit Pengajuan Kantor",
    btn_label: "Setting Limit Pengajuan Kantor",
    class_name: "w-full",
    toast_success: {
      title: "Berhasil",
      description: "Limit Pengajuan Kantor berhasil diubah",
    },
    toast_failed: {
      title: "Gagal",
      description: "Limit Pengajuan Kantor gagal diubah",
    },
  },
};
