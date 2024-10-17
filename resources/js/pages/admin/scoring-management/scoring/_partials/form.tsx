import InputError from "@/components/common/input-error";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { getNumericValue } from "@/lib/getNumericValue";
import { router } from "@inertiajs/react";
import axios from "axios";
import { RotateCw } from "lucide-react";
import { useState } from "react";

interface FormSkoringProps {}

const FormSkoring = () => {
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ name: Array<string> | null; min_point: Array<string> | null }>({
    name: null,
    min_point: null,
  });

  const [dataForm, setDataForm] = useState<{
    name: string;
    min_point: number | undefined;
  }>({
    name: "",
    min_point: undefined,
  });

  const submit = () => {
    setIsLoading(true);
    axios
      .post(route("scoring.store"), { ...dataForm })
      .then(() => {
        toast({
          title: "Berhasil",
          description: "Skoring berhasil ditambahkan",
        });
        setErrors({ name: null, min_point: null });
        setIsOpenForm(false);
        router.get(route("scoring.index"));
      })
      .catch((error) => {
        setErrors(error.response.data.errors);
        toast({
          title: "Gagal",
          description: "Skoring gagal ditambahkan",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <AlertDialog open={isOpenForm} onOpenChange={setIsOpenForm}>
      <AlertDialogTrigger asChild>
        <Button>Tambah Skoring</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tambah Skoring</AlertDialogTitle>
          <AlertDialogDescription>Tindakan ini akan menambah data Skoring</AlertDialogDescription>
        </AlertDialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          id="skoring-form"
          className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              type="name"
              placeholder="Masukan nama skoring"
              required
              value={dataForm.name}
              onChange={(e) => setDataForm({ ...dataForm, name: e.target.value })}
            />
            {(errors.name?.length ?? 0) > 0 &&
              errors.name?.map((error: string, index: number) => (
                <InputError key={index + 1} className="mt-2" message={error} />
              ))}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="min_point">Poin Minimal</Label>
            <Input
              id="min_point"
              type="number"
              required
              value={dataForm.min_point}
              placeholder="Masukan poin minimal"
              onChange={(e) => setDataForm({ ...dataForm, min_point: getNumericValue(e) })}
            />
            {(errors.min_point?.length ?? 0) > 0 &&
              errors.min_point?.map((error: string, index: number) => (
                <InputError key={index + 1} className="mt-2" message={error} />
              ))}
          </div>
          <div className="flex justify-end gap-x-3">
            <AlertDialogCancel onClick={() => setIsOpenForm(false)}>Batal</AlertDialogCancel>
            <Button form="skoring-form" className="w-max" disabled={isLoading}>
              {isLoading && <RotateCw className="animate-spin mr-2 flex-shrink-0" />}
              Tambah Skoring
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FormSkoring;
