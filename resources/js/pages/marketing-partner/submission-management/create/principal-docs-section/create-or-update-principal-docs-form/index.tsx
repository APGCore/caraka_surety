import { toast } from "@/common/hooks/general/use-toast";
import { PRINCIPAL_QUERY_KEY, useCreateOrUpdatePrincipalDocs } from "@/common/hooks/react-query/principal";
import { Label } from "@/components/_shadcn-ui/label";
import { FileInput } from "@/components/molecules/input/file-input";
import { queryClient } from "@/components/organisms/provider/react-query-provider";
import React from "react";

interface CreateOrUpdatePrincipalDocFormProps {
    principalId: number;
    id: number;
    name: string;
    principal_document: {
        path: string;
    } | null;
    doc: string;
    file: File;
}

const CreateOrUpdatePrincipalDocForm: React.FC<CreateOrUpdatePrincipalDocFormProps> = ({
    principalId,
    id,
    name,
    principal_document,
    doc,
    file,
}) => {
    const { mutate, isPending } = useCreateOrUpdatePrincipalDocs({
        onSuccess: async (data: any) => {
            toast({
                title: `Berhasil Menyimpan dokumen ${name} principal terbaru!`,
                description: "Data berhasil disimpan",
            });
            await queryClient.invalidateQueries({
                queryKey: [PRINCIPAL_QUERY_KEY.PRINCIPAL],
                refetchType: "active",
            });
        },
        onError: (error) => {
            console.log(error);
            toast({
                title: `Gagal Menyimpan dokumen ${name} principal terbaru!`,
                description: "Terjadi kesalahan saat menyimpan data. Silahkan coba lagi",
                variant: "destructive",
            });
        },
    });

    const changePrincipalDoc = (file: File | null) => {
        if (file) {
            mutate({
                principal_id: principalId,
                required_doc_id: id,
                file: file,
            });
        }
    };

    return (
        <div className="grid gap-1">
            <Label className="text-md">{name}</Label>
            <FileInput
                isLoading={isPending}
                onFileChange={(file: File | null) => changePrincipalDoc(file)}
                previewValue={file ? file : principal_document?.path}
            />
        </div>
    );
};

export default CreateOrUpdatePrincipalDocForm;
