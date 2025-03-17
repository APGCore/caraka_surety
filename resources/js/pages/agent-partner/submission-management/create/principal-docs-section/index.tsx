import { useGetPrincipalDocs } from "@/common/hooks/react-query/principal";
import RenderList from "@/components/atoms/render-list";
import React from "react";
import CreateOrUpdatePrincipalDocForm from "./create-or-update-principal-docs-form";

interface PrincipalDocsSectionProps {
  principalId?: number | string;
}

const PrincipalDocsSection: React.FC<PrincipalDocsSectionProps> = ({ principalId }) => {
  const { data: principalDocs, isLoading: isLoadingGetPrinciaplDocs } = useGetPrincipalDocs(Number(principalId));

  return (
    <RenderList
      of={Array.isArray(principalDocs) ? principalDocs : []}
      render={(doc, idx) => <CreateOrUpdatePrincipalDocForm key={idx + 1} principalId={principalId} {...doc} />}
    />
  );
};

export default PrincipalDocsSection;
