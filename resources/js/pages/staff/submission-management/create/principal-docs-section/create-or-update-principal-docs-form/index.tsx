import { toast } from "@/common/hooks/general/use-toast";
import { PRINCIPAL_QUERY_KEY, useCreateOrUpdatePrincipalDocs } from "@/common/hooks/react-query/principal";
import { Button } from "@/components/_shadcn-ui/button";
import { Label } from "@/components/_shadcn-ui/label";
import { PreviewFile } from "@/components/molecules/preview-file";
import { queryClient } from "@/components/organisms/provider/react-query-provider";
import axios from "axios";
import { FileIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

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

type UploadStatus = "idle" | "uploading" | "success" | "error";

const validation = ["image/jpeg", "image/png", "application/pdf"];
const limit = 15 * 1024 * 1024;

const toMB = (size: number) => (size / (1024 * 1024)).toFixed(2);

const CreateOrUpdatePrincipalDocForm: React.FC<CreateOrUpdatePrincipalDocFormProps> = ({
  principalId,
  id,
  name,
  principal_document,
  doc,
  file,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [files, setFiles] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (file) {
      if (file instanceof File) {
        setFiles(file);
        setPreview(URL.createObjectURL(file));
      } else if (typeof file === "string") {
        setPreview(file);
      }
    } else if (principal_document?.path) {
      setPreview(principal_document?.path);
    }
  }, [file, principal_document?.path]);

  const onFileChange = async (file: File | null) => {
    if (file) {
      setStatus("uploading");
      setUploadProgress(0);

      try {
        const formData = new FormData();
        formData.append("required_doc_id", id.toString());
        formData.append("file", file);

        const response = await axios.post(
          route("api.principal-management.document.upload", {
            principal: principalId,
          }),
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
              setUploadProgress(progress);
            },
          },
        );

        setStatus("success");
        setUploadProgress(100);

        if (response) {
          toast({
            title: "Data berhasil disimpan!",
            description: `Berhasil Menyimpan dokumen ${name} principal terbaru!`,
          });
          await queryClient.invalidateQueries({
            queryKey: [PRINCIPAL_QUERY_KEY.PRINCIPAL],
            refetchType: "active",
          });
        }
      } catch {
        setStatus("error");
        setUploadProgress(0);
        toast({
          title: "Terjadi kesalahan saat menyimpan data. Silahkan coba lagi!",
          description: `Gagal Menyimpan dokumen ${name} principal terbaru!`,
          variant: "destructive",
        });
      }
    }
  };

  const handleReset = () => {
    if (inputRef?.current) {
      inputRef.current.value = "";
    }
    setFiles(null);
    setPreview(null);
    setStatus("idle");
    setUploadProgress(0);
  };

  return (
    <div className="grid gap-1">
      <Label className="text-md">{name}</Label>
      <div>
        <button
          disabled={status === "uploading"}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            inputRef.current?.click();
          }}
          className="border-2 border-dashed h-[150px] w-full  border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center">
          <FileIcon className="w-10 h-10 flex-shrink-0" />
          {!files ? (
            <>
              <span className="text-sm font-medium text-gray-500">Klik untuk upload file Anda!</span>
              <span className="text-xs text-gray-500">PDF atau Gambar</span>
              {limit && (
                <span className="text-xs text-gray-500">Ukuran file tidak boleh lebih dari {toMB(limit)} MB</span>
              )}
            </>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mt-1">
                Anda mengupload
                <span className="text-black font-bold ml-1">{files?.name?.slice(0, 20)}</span>
              </p>
              <p className="text-xs text-gray-500">Ukuran: {toMB(files.size)} MB</p>
              <p className="text-xs text-gray-500">Tipe: {files.type}</p>
            </div>
          )}
        </button>
        {(status === "uploading" || status === "success") && (
          <div className="space-y-2 mt-2">
            <div className="h-2.5 w-full rounded-full bg-gray-200">
              <div
                className="h-2.5 rounded-full bg-black transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <p className="text-sm text-gray-600">{uploadProgress}% terupload</p>
          </div>
        )}
        {preview && (
          <div className="flex justify-end mt-3 gap-x-3">
            <PreviewFile files={files} preview={preview} />
            <Button variant={"destructive"} onClick={handleReset}>
              Reset
            </Button>
          </div>
        )}

        <input
          ref={inputRef}
          hidden
          type="file"
          accept=".pdf, .jpg, .jpeg, .png"
          onChange={(e) => {
            const file = e?.target?.files ? e.target.files[0] : null;

            if (!file) {
              onFileChange?.(null);
              handleReset();
              return;
            }

            // check if file size is greater than limit
            if (limit) {
              if (file.size > limit) {
                alert("File is too large!");
                return;
              }
            }

            // check if file type is PDF or image
            const acceptedTypes = ["application/pdf", "image/jpeg", "image/png"];
            if (!acceptedTypes.includes(file.type)) {
              alert("Only PDFs and images are supported");
              return;
            }

            setPreview(URL.createObjectURL(file));
            setFiles(file);
            onFileChange?.(file);
          }}
        />
      </div>
    </div>
  );
};

export default CreateOrUpdatePrincipalDocForm;
