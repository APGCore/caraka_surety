import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

export const PRINCIPAL_QUERY_KEY = {
  PRINCIPAL: "principal",
  CREATE_PRINCIPAL: "create-principal",
  UPDATE_PRINCIPAL: "update-principal",
  CREATE_OR_UPDATE_PRINCIPAL_DOCS: "create-or-update-principal-docs",
  GET_PRINCIPAL_DOCS: "get-principal-docs",
};

export const useGetAllPrincipal = (querySetting?: UseQueryOptions) => {
  return useQuery({
    queryKey: [PRINCIPAL_QUERY_KEY.PRINCIPAL],
    queryFn: async () => {
      const response = await axios.get(route("api.principal-management.principal.all"));
      return response.data.data;
    },
    ...querySetting,
  });
};

interface CreatePrincipalRequest {
  province_id?: string;
  regency_id?: string;
  district_id?: string;
  village?: string;
  name?: string;
  address?: string;
  telephone?: string;
  fax?: string;
  postal_code?: string;
  npwp?: string;
  nib?: string;
  siup_siujk?: string;
  head_name?: string;
  director_name?: string;
  director_position?: string;
  director_phone?: string;
  commissioner?: string;
  year_established?: string;
  last_deed?: string;
  business_fields?: string;
}

interface UpdatePrincipalRequest {
  principal_id: string;
  province_id: string;
  regency_id: string;
  district_id: string;
  village?: string;
  name: string;
  address: string;
  telephone: string;
  fax?: string;
  postal_code: string;
  npwp: string;
  nib?: string;
  siup_siujk?: string;
  head_name?: string;
  director_name: string;
  director_position: string;
  director_phone: string;
  commissioner?: string;
  year_established: string;
  last_deed?: string;
  business_fields?: string;
}

export const useCreateOrUpdatePrincipal = (
  isUpdate: boolean = false,
  mutationSetting: UseMutationOptions<unknown, Error, CreatePrincipalRequest | UpdatePrincipalRequest, unknown> = {},
) => {
  return useMutation({
    mutationKey: [isUpdate ? PRINCIPAL_QUERY_KEY.UPDATE_PRINCIPAL : PRINCIPAL_QUERY_KEY.CREATE_PRINCIPAL],
    mutationFn: async (data: CreatePrincipalRequest | UpdatePrincipalRequest) => {
      const response = isUpdate
        ? await axios.put(
            route("api.principal-management.principal.update", {
              principal: (data as UpdatePrincipalRequest).principal_id,
            }),
            data,
          )
        : await axios.post(route("api.principal-management.principal.store"), data);
      return response?.data?.data;
    },
    ...mutationSetting,
  });
};

interface CreateOrUpdatePrincipalDocRequest {
  principal_id: number;
  required_doc_id: number;
  file: File;
}

export const useCreateOrUpdatePrincipalDocs = (
  mutationSetting: UseMutationOptions<unknown, Error, CreateOrUpdatePrincipalDocRequest, unknown> = {},
) => {
  return useMutation({
    mutationKey: [PRINCIPAL_QUERY_KEY.CREATE_OR_UPDATE_PRINCIPAL_DOCS],
    mutationFn: async (data: CreateOrUpdatePrincipalDocRequest) => {
      const response = await axios.post(
        route("api.principal-management.document.upload", {
          principal: data.principal_id,
        }),
        {
          required_doc_id: data.required_doc_id,
          file: data.file,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response?.data?.data;
    },
    ...mutationSetting,
  });
};

export const useGetPrincipalDocs = (principalId: number, querySetting?: UseQueryOptions) => {
  return useQuery({
    queryKey: [PRINCIPAL_QUERY_KEY.GET_PRINCIPAL_DOCS, principalId],
    queryFn: async () => {
      const response = await axios.get(route("references.principal.documents", { principal_id: principalId }));
      return response.data.data;
    },
    enabled: !!principalId,
    ...querySetting,
  });
};
