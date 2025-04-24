import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/_features/_common/components/_shadcn-ui/alert-dialog";
import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import { Input } from "@/_features/_common/components/_shadcn-ui/input";
import { Label } from "@/_features/_common/components/_shadcn-ui/label";
import { Textarea } from "@/_features/_common/components/_shadcn-ui/textarea";
import { handleBubbleEvent } from "@/_features/_common/utils/dom";
import { queryClient } from "@/components/organisms/provider/react-query-provider";
import { useForm } from "@inertiajs/react";
import { CircleAlertIcon, LoaderCircle } from "lucide-react";
import { FormEvent, useEffect, useId } from "react";
import { HOST_TO_HOST_QUERY_KEY } from "../../services/host-to-host-query";

interface CreateUpdateHostToHostModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
  hostToHost?: any;
}

export default function CreateUpdateHostToHostModal({
  open,
  handleOpen,
  hostToHost,
}: CreateUpdateHostToHostModalProps) {
  const id = useId();

  const { data, setData, post, put, processing, reset } = useForm<{
    id: string;
    guarantor_url_host: string;
    auth_prefix: string;
    token: string;
  }>({
    id: "",
    guarantor_url_host: "",
    auth_prefix: "",
    token: "",
  });

  useEffect(() => {
    if (hostToHost && typeof hostToHost === "object") {
      setData({
        id: hostToHost.id,
        guarantor_url_host: hostToHost.guarantor_url_host,
        auth_prefix: hostToHost.auth_prefix,
        token: hostToHost.token,
      });
    }
  }, [hostToHost]);

  const createHostToHost = () => {
    post(route("host-to-host.store"), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [HOST_TO_HOST_QUERY_KEY.SEARCH_HOST_TO_HOST],
            refetchType: "active",
          }),
        ]);
        reset();
        handleOpen?.(false);
      },
    });
  };

  const updateHostToHost = () => {
    put(
      route("host-to-host.update", {
        id: data.id,
      }),
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [HOST_TO_HOST_QUERY_KEY.SEARCH_HOST_TO_HOST],
              refetchType: "active",
            }),
          ]);
          reset();
          handleOpen?.(false);
        },
      },
    );
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (hostToHost) {
      updateHostToHost();
    } else {
      createHostToHost();
    }
  };

  if (!open) return null;

  return (
    <AlertDialog open={open} onOpenChange={handleOpen}>
      <AlertDialogContent className="max-w-md">
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="sm:text-center">
              {hostToHost ? "Update Host to Host" : "Tambah Host to Host"}
            </AlertDialogTitle>
            <AlertDialogDescription className="sm:text-center">
              {hostToHost ? "Anda akan mengupdate host to host." : "Anda akan menambahkan host to host baru."}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        <form onSubmit={handleFormSubmit} id={`form`} className="space-y-4">
          {/* URL */}
          <div>
            <Label htmlFor={`url`}>URL</Label>
            <Input
              id={`url`}
              className=" shadow-none"
              placeholder="https:// ...."
              defaultValue={data.guarantor_url_host}
              type="text"
              onChange={(e) => setData({ ...data, guarantor_url_host: e.target.value })}
            />
          </div>
          {/* AUTH PREFIX */}
          <div>
            <Label htmlFor={`auth-prefix`}>Prefix Auth</Label>
            <Input
              id={`auth-prefix`}
              className=" shadow-none"
              placeholder="Isi dengan prefix auth boleh kosong"
              defaultValue={data.auth_prefix}
              type="text"
              onChange={(e) => setData({ ...data, auth_prefix: e.target.value })}
            />
          </div>
          {/* TOKEN */}
          <div>
            <Label htmlFor={`token`}>Token</Label>
            <Textarea
              id={`token`}
              placeholder="Isi dengan token yang diberikan"
              defaultValue={data.token}
              onChange={(e) => setData({ ...data, token: e.target.value })}
              aria-describedby={`token`}
            />
          </div>
        </form>
        <AlertDialogFooter>
          <Button
            variant={"outline"}
            type="button"
            className="flex-1"
            onClick={(e) => {
              handleBubbleEvent(e);
              handleOpen?.(false);
            }}>
            Batal
          </Button>
          <Button form={`form`} type={"submit"} disabled={processing} className="flex-1">
            {processing && <LoaderCircle className="animate-spin mr-1" />}
            {hostToHost ? "Update Data" : "Simpan Data"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
