import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import { Card, CardContent, CardHeader } from "@/_features/_common/components/_shadcn-ui/card";
import { Input } from "@/_features/_common/components/_shadcn-ui/input";
import { Label } from "@/_features/_common/components/_shadcn-ui/label";
import { Separator } from "@/_features/_common/components/_shadcn-ui/separator";
import RenderList from "@/_features/_common/components/render-list";
import Show from "@/_features/_common/components/show";
import { CalendarPicker } from "@/components/molecules/calendar/single-calendar";
import { PreviewFile } from "@/components/molecules/preview-file";
import { ContractDocSectionType } from "@/pages/staff/submission-management/create/contract-doc-section/contract-doc-section.type";
import { SupportDocument } from "@/pages/staff/submission-management/create/submission-create-page.type";
import { subDays } from "date-fns";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

const ContractDocSection: React.FC<ContractDocSectionType> = ({ supportDocs, errors, onChange }) => {
  const [preview, setPreview] = useState<string[]>(() => {
    return supportDocs.map((doc) => {
      return doc.url ?? "";
    });
  });

  useEffect(() => {
    if (supportDocs.length === 0) {
      onChange([
        {
          name: "",
          number: "",
          date: new Date(),
        },
      ]);
    }
  }, [supportDocs]);

  const handleReset = (index: number) => {
    const data = supportDocs.map((doc, i) => ({
      ...doc,
      file: i === index ? undefined : doc.file,
    }));
    onChange(data);
    setPreview((prev: string[]) => {
      const newPreview = [...prev];
      newPreview[index] = "";
      return newPreview;
    });
  };

  return (
    <>
      <Card className={"w-full"}>
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <Label className="text-md">Dasar Dokumen</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => {
                  const data = [...supportDocs, { name: "", number: "", date: new Date() }];
                  onChange(data);
                }}>
                Tambah
              </Button>
            </div>
          </div>
          {errors?.contract_docs && <p className="text-red-500 text-sm">{errors.contract_docs}</p>}
        </CardHeader>
        <CardContent>
          <RenderList
            of={supportDocs}
            render={(supportDocument: SupportDocument, index) => (
              <>
                <Separator />
                <div className="grid grid-cols-12 gap-2 my-2">
                  <div className="space-y-2 col-span-4  w-full">
                    <Label className="text-md">Nama Dasar Dokumen</Label>
                    <Input
                      className="text-md"
                      placeholder="Nama dasar dokumen"
                      value={supportDocument.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        const data = supportDocs.map((doc, i) => ({
                          ...doc,
                          name: i === index ? name : doc.name,
                        }));
                        onChange(data);
                      }}
                    />
                  </div>
                  <div className="space-y-2 col-span-4 w-full">
                    <Label className="text-md">Nomor Dasar Dokumen</Label>
                    <Input
                      className="text-md"
                      placeholder="Nomor dasar dokumen"
                      value={supportDocument.number}
                      onChange={(e) => {
                        const number = e.target.value;
                        const data = supportDocs.map((doc, i) => ({
                          ...doc,
                          number: i === index ? number : doc.number,
                        }));
                        onChange(data);
                      }}
                    />
                  </div>
                  <div className="space-y-2 col-span-4 w-full">
                    <Label className="text-md">Tanggal Dasar Dokumen</Label>
                    <CalendarPicker
                      dateFormat="YYYY-MM-DD"
                      disabled={{
                        before: subDays(new Date(), 90),
                      }}
                      initialDate={supportDocument.date ? dayjs(supportDocument.date).toDate() : dayjs().toDate()}
                      onPickDate={(d) => {
                        const date = dayjs(d).format("YYYY-MM-DD");
                        const data = supportDocs.map((doc, i) => ({
                          ...doc,
                          date: i === index ? date : doc.date,
                        }));
                        onChange(data);
                      }}
                    />
                  </div>
                  <div className="space-y-2 col-span-10 w-full">
                    <Label className="text-md">Upload Dokumen</Label>
                    <Show when={preview[index]}>
                      <div className="flex gap-x-3">
                        <Show when={supportDocument.file}>
                          <div className="w-[60%]">
                            <p className="whitespace-normal break-words">{supportDocument.file?.name}</p>
                          </div>
                        </Show>
                        <PreviewFile files={supportDocument.file} preview={preview[index]} />
                        <Button
                          variant={"destructive"}
                          onClick={() => {
                            handleReset(index);
                          }}>
                          Reset
                        </Button>
                      </div>
                    </Show>
                    <Show when={!preview[index]}>
                      <Input
                        id={"support-doc-" + index}
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                          const file = e.currentTarget.files?.[0];
                          const data = supportDocs.map((doc, i) => ({
                            ...doc,
                            file: i === index ? file : doc.file,
                          }));
                          onChange(data);
                          setPreview((prev: string[]) => {
                            const newPreview = [...prev];
                            newPreview[index] = URL.createObjectURL(file!);
                            return newPreview;
                          });
                        }}
                      />
                    </Show>
                  </div>
                  <Show when={index !== 0}>
                    <div className="space-y-2 col-span-2 w-full">
                      {/*  delete */}
                      <div className="w-full mt-7 text-center">
                        <Button
                          type="button"
                          variant={"destructive"}
                          onClick={() => {
                            const data = supportDocs.filter((_, i) => i !== index);
                            onChange(data);
                          }}>
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </Show>
                </div>
              </>
            )}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default ContractDocSection;
