import { useGetPrincipalDocs } from "@/common/hooks/react-query/principal";
import { Skeleton } from "@/components/_shadcn-ui/skeleton";
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
import React from "react";
import CreateOrUpdatePrincipalDocForm from "./create-or-update-principal-docs-form";

interface PrincipalDocsSectionProps {
    principalId?: number | string;
}

const PrincipalDocsSection: React.FC<PrincipalDocsSectionProps> = ({ principalId }) => {
    const { data: principalDocs, isLoading: isLoadingGetPrinciaplDocs } = useGetPrincipalDocs(Number(principalId));
    const arrayLoading = Array.from({ length: 5 });

    return (
        <Show
            when={!isLoadingGetPrinciaplDocs}
            fallback={
                <div className="flex flex-col space-y-3">
                    <RenderList
                        of={arrayLoading as []}
                        render={() => <Skeleton className="h-[125px] w-full rounded-xl" />}
                    />
                </div>
            }>
            <RenderList
                of={Array.isArray(principalDocs) ? principalDocs : []}
                render={(doc, idx) => (
                    <CreateOrUpdatePrincipalDocForm key={idx + 1} principalId={Number(principalId)} {...doc} />
                )}
            />
        </Show>
    );
};

export default PrincipalDocsSection;
