import { Button } from "@/components/_shadcn-ui/button";
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
import { useState } from "react";

const ShowDocumentFormat = ({ submission }: { submission: any }) => {
  const documents = submission.has_send_to_guarantor ? submission.submission_docs : submission.document_formats;
  const [isLoadingDocumentFormat, setIsLoadingDocumentFormat] = useState<any[]>(() =>
    (documents as Array<any>).map((document) => {
      return {
        id: document.id,
        isLoading: true,
      };
    }),
  );
  return (
    <>
      <RenderList
        of={documents}
        render={(format: any) => {
          const params: any = {
            submission_id: submission.id,
          };
          if (!submission.has_send_to_guarantor) {
            params.document_format_id = format.id;
          } else {
            params.submission_doc_id = format.id;
          }
          return (
            <div className="space-y-4">
              <div key={format.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{format.name}</p>

                  <div className="flex items-center gap-2">
                    <a href={route("report.export.submission.pdf.preview", params)} target="_blank">
                      <Button variant="outline" size="sm">
                        Lihat PDF
                      </Button>
                    </a>

                    <a href={route("report.export.submission.word.preview", params)} target="_blank">
                      <Button variant="outline" size="sm">
                        Export Word
                      </Button>
                    </a>
                  </div>
                </div>

                {/* FRAME */}
                <div className="relative w-full h-[300px] border rounded overflow-hidden bg-white">
                  {/* LOADING OVERLAY */}
                  {isLoadingDocumentFormat.find((document) => document?.id === format.id)?.isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10">
                      <div className="w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-600 text-sm mt-2 animate-pulse">Sedang memuat dokumen...</p>
                    </div>
                  )}

                  {/* IFRAME */}
                  <iframe
                    src={route("report.export.submission.pdf.preview", params)}
                    className="w-full h-full rounded"
                    onLoad={() =>
                      setIsLoadingDocumentFormat((prev: any[]) =>
                        prev.map((document) => {
                          if (document?.id === format.id) {
                            return {
                              ...document,
                              isLoading: false,
                            };
                          }
                          return document;
                        }),
                      )
                    }
                  />
                </div>
              </div>
            </div>
          );
        }}
        renderFallback={() => <p className="text-gray-500">Tidak ada dokumen yang tersedia untuk ditampilkan.</p>}
      />
    </>
  );
};

export default ShowDocumentFormat;
