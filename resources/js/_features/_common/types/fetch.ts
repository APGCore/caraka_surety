import { PaginationMeta } from "./pagination";

export interface FetchParams {
  perPage?: number;
  search?: string;
  page?: number;
  isPageAble?: "true" | "false";
}

export interface FetchResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
