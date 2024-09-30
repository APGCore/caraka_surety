import { generateUUID } from "@/lib/generate-uuid";
import { Home, Shield, User } from "lucide-react";

export const exampleLinks = [
  {
    title: "Dashboard",
    route: [
      {
        id: generateUUID(),
        name: "Dashboard",
        route_name: "example.index",
        href: route("example.index"),
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
        route_name: "example.karyawan",
        href: route("example.karyawan"),
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
      {
        id: generateUUID(),
        name: "File",
        route_name: "example.file",
        href: route("example.file"),
        Icon: Shield,
        children: [],
      },
    ],
  },
];
