import useGetAllBranchGuarantor from "@/common/hooks/api/guarantor/useGetAllBranchGuarantor";
import useGetAllGuarantor from "@/common/hooks/api/guarantor/useGetAllGuarantor";
import useGetAllProvince from "@/common/hooks/api/locations/useGetAllProvince";
import useGetDistrictByRegencyId from "@/common/hooks/api/locations/useGetDistrictByRegencyId";
import useGetRegencyByProvinceId from "@/common/hooks/api/locations/useGetRegencyByProvinceId";
import { router, useForm } from "@inertiajs/react";
import { FormEventHandler, useMemo, useState } from "react";

interface IBranchGuarantor {
  id: number | null;
  name: string | null;
}

interface IPairingGuarantor {
  id: number;
  name: string;
  branches: IBranchGuarantor[];
}

interface IBranchOfficeForm {
  branchOffice?: any;
  routeSubmit: string;
  routeBack: string;
  type?: "cabang" | "mitra-pemasaran" | "mitra-agen";
}

const useBranchOfficeForm = ({ branchOffice, routeSubmit, routeBack }: IBranchOfficeForm) => {
  const { data, setData, post, patch, errors, processing } = useForm({
    id: branchOffice?.id ?? null,
    code: branchOffice?.code ?? "",
    name: branchOffice?.name ?? "",
    email: branchOffice?.email ?? "",
    phone: branchOffice?.phone ?? "",
    province_id: branchOffice?.province_id ?? null,
    regency_id: branchOffice?.regency_id ?? null,
    district_id: branchOffice?.district_id ?? null,
    village: branchOffice?.village ?? "",
    address: branchOffice?.address ?? "",
    postal_code: branchOffice?.postal_code ?? "",
    pairing_guarantor: branchOffice?.pairing_guarantor ?? [],
    office_type: "agent_partner",
  });

  // Open Modal

  const [selectedGuarantor, setSelectedGuarantor] = useState<IPairingGuarantor | undefined>(undefined);

  const { provinces: jobLocationProvinces } = useGetAllProvince();
  const { regencies: jobLocationRegencies } = useGetRegencyByProvinceId({
    province_id: data?.province_id,
  });
  const { districts: jobLocationDistricts } = useGetDistrictByRegencyId({
    regency_id: data?.regency_id,
  });

  const { guarantors, loading: loadingGetGuarantor } = useGetAllGuarantor();
  const { branchGuarantors, loading: loadingGetBranchGuarantor } = useGetAllBranchGuarantor();

  const defaultPairingGuarantor = [{ id: null, name: null, branches: [] }];
  const [pairingGuarantor, setPairingGuarantor] = useState<IPairingGuarantor[] | null>(
    data.pairing_guarantor ?? defaultPairingGuarantor,
  );

  const availableGuarantors = useMemo(() => {
    if (!loadingGetGuarantor) {
      return guarantors.map((guarantor: any) => ({
        ...guarantor,
        isChoosed: (pairingGuarantor ?? []).some((pairing) => pairing.id === guarantor.id),
      }));
    }

    return [];
  }, [pairingGuarantor, loadingGetGuarantor]);

  const availableBranchGuarantors = useMemo(() => {
    if (selectedGuarantor?.id && !loadingGetGuarantor && !loadingGetBranchGuarantor) {
      const filteredBranchGuarantors = branchGuarantors.filter(
        (branch: any) => branch?.headquarter_id === selectedGuarantor?.id,
      );

      return filteredBranchGuarantors.map((branch: any) => ({
        ...branch,
        isChoosed: (pairingGuarantor ?? []).some(
          (pairing) => pairing.branches?.some((pairingBranch) => pairingBranch.id === branch.id) ?? false,
        ),
      }));
    }

    return [];
  }, [pairingGuarantor, loadingGetGuarantor, loadingGetBranchGuarantor, selectedGuarantor?.id]);

  const limitCreateGuarantor = useMemo(
    () => pairingGuarantor?.length === availableGuarantors.length,
    [pairingGuarantor, availableGuarantors],
  );

  const addGuarantor = (guarantor: any) => {
    if (limitCreateGuarantor) {
      return;
    }
    setPairingGuarantor((prev) => [
      ...(prev || []),
      {
        id: guarantor.id,
        name: guarantor.name,
        branches: [],
      },
    ]);
  };

  // Delete a guarantor
  const deleteGuarantor = (guarantorId: number) => {
    const updatedData = pairingGuarantor?.filter((gr, idx) => gr?.id !== guarantorId) || [];

    setData("pairing_guarantor", updatedData);
    setPairingGuarantor(updatedData);
  };

  const addBranchGuarantor = (guarantorId: number, branch: any) => {
    const updatedBranch =
      pairingGuarantor?.map((gr, idx) =>
        gr?.id === guarantorId
          ? {
              ...gr,
              branches: [...(gr.branches || []), { id: branch?.id, name: branch?.name }],
            }
          : gr,
      ) || [];

    setData("pairing_guarantor", updatedBranch);
    setPairingGuarantor(updatedBranch);
  };

  // Delete a branch from a specific guarantor
  const deleteBranchGuarantor = (guarantorId: number, branchId: number) => {
    const updatedBranch =
      pairingGuarantor?.map((gr, idx) =>
        gr?.id === guarantorId
          ? {
              ...gr,
              branches: gr.branches.filter((br, bIdx) => br?.id !== branchId),
            }
          : gr,
      ) || [];

    setData("pairing_guarantor", updatedBranch);
    setPairingGuarantor(updatedBranch);
  };

  const cancel = () => {
    router.get(routeBack);
  };

  const handleSubmitForm: FormEventHandler<HTMLFormElement> = (event: any) => {
    event.preventDefault();

    if (data.id) {
      patch(routeSubmit, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          router.get(routeBack);
        },
      });
    } else {
      post(routeSubmit, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          router.get(routeBack);
        },
      });
    }
  };

  return {
    limitCreateGuarantor,
    data,
    setData,
    errors,
    processing,
    jobLocationProvinces,
    jobLocationRegencies,
    jobLocationDistricts,
    availableGuarantors,
    availableBranchGuarantors,
    pairingGuarantor,
    selectedGuarantor,
    setSelectedGuarantor,
    addGuarantor,
    deleteGuarantor,
    addBranchGuarantor,
    deleteBranchGuarantor,
    cancel,
    handleSubmitForm,
  };
};

export default useBranchOfficeForm;
