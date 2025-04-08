import { UseQueryOptions } from "@tanstack/react-query";

export type QuerySetting<TResponse = unknown> = Omit<UseQueryOptions<TResponse, Error>, "queryKey" | "queryFn">;
