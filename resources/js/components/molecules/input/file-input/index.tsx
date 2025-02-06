import { cn } from "@/common/utils/cn";
import { Button } from "@/components/_shadcn-ui/button";
import { PreviewFile } from "@/components/molecules/preview-file";
import { FileIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface InputFileProps {
  className?: string;
  limit?: number;
  onFileChange?: (file: File | null) => void;
  validation?: string[];
  reset?: number | boolean;
  previewValue?: string | File | null;
  required?: boolean;
}

const FileInput: React.FC<InputFileProps> = ({
  className,
  limit,
  onFileChange,
  reset,
  validation = ["image/jpeg", "image/png", "application/pdf"],
  previewValue,
  required = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [files, setFiles] = useState<File | null>(null);

  const handleReset = () => {
    if (inputRef?.current) {
      inputRef.current.value = "";
    }
    setFiles(null);
    setPreview(null);
    onFileChange?.(null);
  };

  // Reset when the reset prop changes
  useEffect(() => {
    if (reset) {
      handleReset();
    }
  }, [reset]);

  useEffect(() => {
    if (previewValue instanceof File) {
      setFiles(previewValue);
      setPreview(URL.createObjectURL(previewValue));
    } else if (typeof previewValue === "string") {
      setPreview(previewValue);
    }
  }, [previewValue]);

  return (
    <div className={cn(className)}>
      <button
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
            <span className="text-xs text-gray-500">Ukuran file tidak boleh lebih dari 2 MB</span>
          </>
        ) : (
          <p className="text-sm text-gray-500 mt-1">
            Anda mengupload <span className="text-black font-bold">{files?.name?.slice(0, 10)}</span>
          </p>
        )}
      </button>
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
        required={required && preview === null}
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

          if (validation?.includes(file.type)) {
            setPreview(URL.createObjectURL(file));
          } else {
            alert("Only images and PDFs are supported");
            return;
          }
          setFiles(file);
          onFileChange?.(file);
        }}
      />
    </div>
  );
};

export { FileInput };
