"use client";

import { toast } from "@/common/hooks/general/use-toast";
import { useFetchGetAllGuarantor } from "@/common/hooks/react-query/guarantor";
import { Button } from "@/components/_shadcn-ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/_shadcn-ui/dialog";
import { Input } from "@/components/_shadcn-ui/input";
import { Label } from "@/components/_shadcn-ui/label";
import { Textarea } from "@/components/_shadcn-ui/textarea";
import { Combobox } from "@/components/molecules/combobox";
import { useForm } from "@inertiajs/react";
import { useId } from "react";

export default function ModalForm() {
  const id = useId();
  const { data: guarantors, isLoading: isLoadingGuarantor } = useFetchGetAllGuarantor(true);
  const { data, setData, post } = useForm();

  const handleSubmit = () => {
    post(route(""), {
      preserveState: true,
      preserveScroll: true,

      onError: (errors) => {
        console.log(errors);
        toast({
          title: "Gagal",
          description: "Terjadi kesalahan saat menyimpan data. Silahkan coba lagi",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        console.log("success");
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Tambah Data</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b border-border px-6 py-4 text-base">Tambah Host to Host</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">Disini bisa edit data host to host</DialogDescription>
        <div className="overflow-y-auto h-[calc(100vh_-_12rem)]">
          <div className="px-6 pb-6 pt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-4">
              <div className="space-y-2">
                <Label className="text-md">Asuransi/Penjamin</Label>
                <Combobox
                  id={`${id}-guarantor`}
                  datas={Array.isArray(guarantors) ? guarantors : []}
                  labelKey="name"
                  valueKey="name"
                  placeholder="Pilih Asuransi/Penjamin"
                  onSelect={(val: any) => {
                    setData({ ...data, guarantor_id: val.id });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-url`}>URL</Label>
                <div className="flex rounded-lg shadow-sm shadow-black/5">
                  <Input
                    id={`${id}-url`}
                    className=" shadow-none"
                    placeholder="https:// ...."
                    defaultValue=""
                    type="text"
                    onChange={(e) => setData({ ...data, guarantor_url_host: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-token`}>Token</Label>
                <Textarea
                  id={`${id}-token`}
                  placeholder="Isi dengan token yang diberikan"
                  onChange={(e) => setData({ ...data, token: e.target.value })}
                  aria-describedby={`${id}-token`}
                />
              </div>
            </form>
          </div>
        </div>
        <DialogFooter className="border-t border-border px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button">Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
