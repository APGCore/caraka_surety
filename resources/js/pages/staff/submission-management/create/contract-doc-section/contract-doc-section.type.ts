import { SupportDocument } from "@/pages/staff/submission-management/create/submission-create-page.type";

export interface ContractDocSectionType {
  supportDocs: SupportDocument[];
  errors?: Record<string, string>;
  onChange: (value: SupportDocument[]) => void;
}
