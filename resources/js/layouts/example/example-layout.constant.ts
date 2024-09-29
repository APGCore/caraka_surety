import { generateUUID } from "@/lib/generate-uuid";
import { Home, Shield, User } from "lucide-react";

export const exampleLinks = [
  {
    title: "Dashboard",
    route: [
      {
        id: generateUUID(),
        name: "Dashboard",
        route_name: "admin.index",
        href: route("admin.index"),
        Icon: Home,
        children: [],
      },
    ],
  },

  {
    title: "Kelola Perusahaan",
    route: [
      {
        id: generateUUID(),
        name: "Daftar Cabang",
        route_name: "cabang",
        href: "cabang",
        Icon: User,
        children: [],
      },
      {
        id: generateUUID(),
        name: "Karyawan",
        route_name: "karyawan.index",
        href: "karyawan",
        Icon: User,
        children: [],
      },
      {
        id: generateUUID(),
        name: "Akses Aplikasi",
        route_name: "manajemen-akses",
        href: "manajemen-akses",
        Icon: Shield,
        children: [],
      },
    ],
  },
];
