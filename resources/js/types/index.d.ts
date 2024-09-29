export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
}

interface FlashMessageProps {
  title: string;
  description: string;
  type: "success" | "error";
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth?: {
    user: User;
  };
  ziggy?: Config & { location: string };
  flash_message?: FlashMessageProps;
};
