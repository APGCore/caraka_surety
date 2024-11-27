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
import React from "react";

interface PreviewFileProps {
  preview?: string;
  files?: File | null;
}

const PreviewFile: React.FC<PreviewFileProps> = ({ preview, files }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Preview</Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        aria-describedby="test"
        className="w-full h-[calc(90vh_-_30px)] py-4 rounded-[2px] overflow-hidden">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black font-semibold text-xl">Preview {files?.name}</AlertDialogTitle>
        </AlertDialogHeader>
        {files?.type === "application/pdf" || preview?.includes(".pdf") ? (
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
  );
};

export { PreviewFile };
