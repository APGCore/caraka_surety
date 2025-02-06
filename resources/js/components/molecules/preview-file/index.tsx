import { Button } from "@/components/_shadcn-ui/button";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../_shadcn-ui/dialog";

interface PreviewFileProps {
  preview?: string;
  files?: File | null;
}

const PreviewFile: React.FC<PreviewFileProps> = ({ preview, files }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Preview</Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby="test"
        className="w-full h-[calc(100vh_-_10%)] flex flex-col py-4 rounded-[2px] overflow-hidden z-[100]">
        <DialogHeader>
          <DialogTitle className="text-black font-semibold text-xl">Preview {files?.name}</DialogTitle>
        </DialogHeader>
        <div className="flex-1">
          {files?.type === "application/pdf" || preview?.includes(".pdf") ? (
            <embed src={preview} className="w-full h-full" type="application/pdf" />
          ) : (
            <img src={preview} alt="preview" className="w-full object-contain h-full" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { PreviewFile };
