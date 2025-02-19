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
import HostToHostForm from "@/pages/admin/host-to-host-management/host-to-host/_partials/form";
import { HostToHostUtils } from "@/pages/admin/host-to-host-management/host-to-host/_partials/host-to-host.utils";
import { useForm } from "@inertiajs/react";
import { PencilIcon } from "lucide-react";
import { useState } from "react";

export default function HostToHostEdit({ hostToHost }: { hostToHost: any }) {
  const { data, setData, put } = useForm({
    id: hostToHost.id,
    guarantor_id: hostToHost.guarantor_id,
    guarantor_url_host: hostToHost.guarantor_url_host,
    token: hostToHost.token,
  });
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = () => {
    put(route(HostToHostUtils.link.update, hostToHost.id), {
      preserveState: true,
      preserveScroll: true,
      onError: (errors) => {
        console.log("Gagal mengubah data host to host", errors);
      },
      onSuccess: () => {
        console.log("Berhasil mengubah data host to host");
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="bg-yellow-300 hover:bg-yellow-200">
          <PencilIcon className="w-[16px] h-[16px]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b border-border px-6 py-4 text-base">Edit Host to Host</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">Disini bisa edit data host to host</DialogDescription>
        <div className="overflow-y-auto h-[calc(100vh_-_12rem)]">
          <div className="px-6 pb-6 pt-4">
            <HostToHostForm handleSubmit={handleSubmit} data={data} setData={setData} />
          </div>
        </div>
        <DialogFooter className="border-t border-border px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form={`form`}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
