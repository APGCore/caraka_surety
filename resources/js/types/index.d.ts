import { OfficeData } from "@/_features/office/services/office-query";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  email_verified_at?: string;
  picture?: string;
  profile_id?: number;
  role_id?: number;
  phone?: number;
  office: OfficeData;
  role: any;
}

interface FlashMessageProps {
  title: string;
  description: string;
  type: "success" | "error";
  messages?: [
    {
      title: string;
      description: string;
      type: "success" | "error" | "warning" | "info";
    },
  ];
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth?: {
    user: User;
  };
  page_settings: {
    title: string;
    breadcrumb: { title: string; link: string }[];
  };
  ziggy?: Config & { location: string };
  flash_message?: FlashMessageProps;
};
