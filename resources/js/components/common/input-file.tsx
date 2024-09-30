import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { FileIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface InputFileProps {
  className?: string;
  limit?: number;
  onFileChange?: (file: File | null) => void;
  reset?: number | boolean;
}

const FileInput: React.FC<InputFileProps> = ({ className, limit, onFileChange, reset }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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

  return (
    <div className={cn(className)}>
      <button
        onClick={() => {
          inputRef.current?.click();
        }}
        className="border-2 border-dashed h-[164px] w-full border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center">
        <FileIcon className="w-12 h-12 flex-shrink-0" />
        {!files ? (
          <>
            <span className="text-sm font-medium text-gray-500">Klik untuk upload file Anda!</span>
            <span className="text-xs text-gray-500">PDF atau Gambar</span>
            <span className="text-xs text-gray-500">Ukuran file tidak boleh lebih dari 10 MB</span>
          </>
        ) : (
          <p className="text-sm text-gray-500 mt-1">
            Anda mengupload <span className="text-black font-bold">{files?.name?.slice(0, 10)}</span>
          </p>
        )}
      </button>
      {preview && (
        <div className="flex justify-end mt-3 gap-x-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Preview</Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              aria-describedby="test"
              className="w-[500px]  h-[calc(100vh_-_30px)] py-4  rounded-[2px] overflow-hidden">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-black font-semibold text-xl">Preview {files?.name}</AlertDialogTitle>
              </AlertDialogHeader>
              {files?.type === "application/pdf" ? (
                <embed src={preview} className="w-full h-[500px]" type="application/pdf" />
              ) : (
                <img src={preview} alt="preview" className="w-full object-contain max-h-[500px] " />
              )}
              <AlertDialogFooter>
                <AlertDialogCancel
                  className={cn(
                    "text-white hover:text-white",
                    buttonVariants({
                      variant: "default",
                    }),
                  )}>
                  Tutup
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant={"destructive"} onClick={handleReset}>
            Reset
          </Button>
        </div>
      )}

      <input
        ref={inputRef}
        hidden
        type="file"
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

          if (file.type === "image/jpeg" || file.type === "image/png") {
            setPreview(URL.createObjectURL(file));
          } else if (file.type === "application/pdf") {
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
