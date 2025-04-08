import { PaginationMeta } from "./pagination";

export interface FetchParams {
  perPage?: number;
  search?: string;
  page?: number;
}

export interface FetchResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
