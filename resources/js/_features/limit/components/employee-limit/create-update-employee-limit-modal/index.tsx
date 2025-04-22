import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/_features/_common/components/_shadcn-ui/alert-dialog";
import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import { Label } from "@/_features/_common/components/_shadcn-ui/label";
import { handleBubbleEvent } from "@/_features/_common/utils/dom";
import { EMPLOYEE_LIMIT_QUERY_KEY } from "@/_features/limit/services/employee-limit-query";
import { OFFICE_LIMIT_QUERY_KEY } from "@/_features/limit/services/office-limit-query";
import InputCurrency from "@/components/molecules/input/currency-input";
import InputError from "@/components/molecules/input/error-input";
import { queryClient } from "@/components/organisms/provider/react-query-provider";
import { useForm } from "@inertiajs/react";
import { CircleAlertIcon, LoaderCircle } from "lucide-react";
import { FormEvent, useEffect } from "react";

interface CreateUpdateEmployeeLimitModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
  employeeLimit?: any;
}

export default function CreateUpdateEmployeeLimitModal({
  open,
  handleOpen,
  employeeLimit,
}: CreateUpdateEmployeeLimitModalProps) {
  const { data, setData, post, put, errors, processing, reset } = useForm<{
    employee_limit_id: number;
    product_id: number;
    product_type_id: number;
    job_group: string;
    office_id: number;
    employee_id: number;
    limit: string | number | undefined;
  }>({
    employee_limit_id: employeeLimit?.employee_limit_id,
    product_id: employeeLimit?.product_id,
    product_type_id: employeeLimit?.product_type_id,
    job_group: employeeLimit?.job_group,
    office_id: employeeLimit?.office_id,
    employee_id: employeeLimit?.employee_id,
    limit: employeeLimit?.limit ?? 0,
  });

  useEffect(() => {
    if (employeeLimit && typeof employeeLimit === "object") {
      setData({
        employee_limit_id: employeeLimit?.employee_limit_id,
        product_id: employeeLimit?.product_id,
        product_type_id: employeeLimit?.product_type_id,
        job_group: employeeLimit?.job_group,
        office_id: employeeLimit?.office_id,
        employee_id: employeeLimit?.employee_id,
        limit: employeeLimit?.limit ?? 0,
      });
    }
  }, [employeeLimit]);

  const createEmployeeLimit = () => {
    post(route("employee-limit.store"), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [EMPLOYEE_LIMIT_QUERY_KEY.SEARCH],
            refetchType: "active",
          }),
        ]);
        reset();
        handleOpen?.(false);
      },
    });
  };

  const updateEmployeeLimit = () => {
    if (data.employee_limit_id) {
      put(
        route("employee-limit.update", {
          id: data.employee_limit_id,
        }),
        {
          preserveState: true,
          preserveScroll: true,
          onSuccess: async () => {
            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: [EMPLOYEE_LIMIT_QUERY_KEY.SEARCH],
                refetchType: "active",
              }),
            ]);
            reset();
            handleOpen?.(false);
          },
        },
      );
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (data.employee_limit_id) {
      updateEmployeeLimit();
    } else {
      createEmployeeLimit();
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
              {employeeLimit?.employee_limit_id
                ? "Update Batas Kewenangan Nilai Pengguna"
                : "Tambah Batas Kewenangan Nilai Pengguna"}
            </AlertDialogTitle>
            <AlertDialogDescription className="sm:text-center">
              {employeeLimit?.employee_limit_id
                ? "Anda akan mengupdate batas kewenangan nilai pengguna."
                : "Anda akan menambahkan batas kewenangan nilai pengguna."}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        <form onSubmit={handleFormSubmit} id={`form-create-update-employee-limit`} className="space-y-4">
          {/* LIMIT */}
          <div>
            <Label htmlFor={`limit`}>Batas Kewenangan Nilai</Label>
            <InputCurrency
              value={data?.limit ? data?.limit?.toString() : ""}
              placeholder="Batas Kewenangan Nilai Pengguna"
              onChange={(e) => setData({ ...data, limit: e || "" })}
            />
            <InputError message={errors?.limit} />
          </div>
          {/* LIMIT INHERIT */}
          {/* <div>
            <Label htmlFor={`limit-inherit`}>Batas Kewenangan Turunan</Label>
            <InputCurrency
              value={data.limit_inherit ? data.limit_inherit?.toString() : ""}
              placeholder="Batas Kewenangan Nilai Jaminan Turunan Kantor"
              onChange={(e) => setData({ ...data, limit_inherit: e || "" })}
            />
            <InputError message={errors?.limit_inherit} />
          </div> */}
        </form>
        <AlertDialogFooter className="flex gap-2">
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
          <Button form={`form-create-update-employee-limit`} type={"submit"} disabled={processing} className="flex-1">
            {processing && <LoaderCircle className="animate-spin mr-1" />}
            {employeeLimit?.employee_limit_id ? "Update Data" : "Simpan Data"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
