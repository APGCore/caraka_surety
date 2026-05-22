import { useGetPrincipalDocs } from "@/common/hooks/react-query/principal";
import RenderList from "@/components/atoms/render-list";
import React, { useEffect, useMemo } from "react";
import CreateOrUpdatePrincipalDocForm from "./create-or-update-principal-docs-form";

interface PrincipalDoc {
  id: number;
  name: string;
  is_required: boolean;
  isActive: boolean;
  principal_document: {
    id?: number;
    path: string;
  } | null;
}

interface PrincipalDocsSectionProps {
  principalId?: number | string;
  onValidationChange?: (isValid: boolean, missingDocs: string[]) => void;
}

const PrincipalDocsSection: React.FC<PrincipalDocsSectionProps> = ({ principalId, onValidationChange }) => {
  const { data: principalDocs, isLoading: isLoadingGetPrinciaplDocs } = useGetPrincipalDocs(Number(principalId));

  const { isValid, missingDocs } = useMemo(() => {
    if (!Array.isArray(principalDocs)) {
      return { isValid: true, missingDocs: [] };
    }

    const activeDocs = principalDocs.filter((doc: PrincipalDoc) => doc.isActive);
    const requiredDocs = principalDocs.filter((doc: PrincipalDoc) => doc.is_required);
    const missing = requiredDocs
      .filter((doc: PrincipalDoc) => !doc.principal_document?.path)
      .map((doc: PrincipalDoc) => doc.name);

    return {
      isValid: missing.length === 0,
      missingDocs: missing,
    };
  }, [principalDocs]);

  useEffect(() => {
    onValidationChange?.(isValid, missingDocs);
  }, [isValid, missingDocs, onValidationChange]);

  // const { isValid, missingDocs } = useMemo(() => {
  //   if (!Array.isArray(principalDocs)) {
  //     return { isValid: true, missingDocs: [] };
  //   }

  //   const activeDocs = principalDocs.filter((doc: PrincipalDoc) => doc.isActive);

  //   const requiredDocs = activeDocs.filter((doc: PrincipalDoc) => doc.is_required);

  //   const missing = requiredDocs
  //     .filter((doc: PrincipalDoc) => !doc.principal_document?.path)
  //     .map((doc: PrincipalDoc) => doc.name);

  //   return {
  //     isValid: missing.length === 0,
  //     missingDocs: missing,
  //   };
  // }, [principalDocs]);

  return (
    <div className="space-y-4">
      {missingDocs.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Dokumen wajib belum lengkap:</p>
          <ul className="list-disc list-inside mt-1">
            {missingDocs.map((docName, idx) => (
              <li key={idx}>{docName}</li>
            ))}
          </ul>
        </div>
      )}
      <RenderList
        of={Array.isArray(principalDocs) ? principalDocs.filter((doc: PrincipalDoc) => doc.isActive) : []}
        render={(doc, idx) => (
          <CreateOrUpdatePrincipalDocForm key={idx + 1} principalId={Number(principalId)} {...doc} />
        )}
      />
    </div>
  );
};

export default PrincipalDocsSection;
