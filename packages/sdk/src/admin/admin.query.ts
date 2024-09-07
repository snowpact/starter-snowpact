/**
 * Generated by orval v7.0.1 🍺
 * Do not edit manually.
 * Starter API
 * OpenAPI spec version: 1.0.0
 */
import { useQuery } from '@tanstack/react-query';
import type {
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';
import * as axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ErrorResponse, UserGetById200 } from '.././models';

type AwaitedInput<T> = PromiseLike<T> | T;

type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;

export const userGetByIdApi = (id: string | undefined | null, options?: AxiosRequestConfig): Promise<AxiosResponse<UserGetById200>> => {
  return axios.default.get(`/api/admin/user/${encodeURIComponent(String(id))}`, options);
};

export const getUserGetByIdApiQueryKey = (id: string | undefined | null) => {
  return [`/api/admin/user/${id}`] as const;
};

export const getUserGetByIdApiQueryOptions = <TData = Awaited<ReturnType<typeof userGetByIdApi>>, TError = AxiosError<ErrorResponse>>(
  id: string | undefined | null,
  options?: { query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof userGetByIdApi>>, TError, TData>>; axios?: AxiosRequestConfig }
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getUserGetByIdApiQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof userGetByIdApi>>> = ({ signal }) =>
    userGetByIdApi(id, { signal, ...axiosOptions });

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof userGetByIdApi>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type UserGetByIdApiQueryResult = NonNullable<Awaited<ReturnType<typeof userGetByIdApi>>>;
export type UserGetByIdApiQueryError = AxiosError<ErrorResponse>;

export function useUserGetByIdApi<TData = Awaited<ReturnType<typeof userGetByIdApi>>, TError = AxiosError<ErrorResponse>>(
  id: string,
  options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof userGetByIdApi>>, TError, TData>> &
      Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof userGetByIdApi>>, TError, TData>, 'initialData'>;
    axios?: AxiosRequestConfig;
  }
): DefinedUseQueryResult<TData, TError> & { queryKey: QueryKey };
export function useUserGetByIdApi<TData = Awaited<ReturnType<typeof userGetByIdApi>>, TError = AxiosError<ErrorResponse>>(
  id: string,
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof userGetByIdApi>>, TError, TData>> &
      Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof userGetByIdApi>>, TError, TData>, 'initialData'>;
    axios?: AxiosRequestConfig;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey };
export function useUserGetByIdApi<TData = Awaited<ReturnType<typeof userGetByIdApi>>, TError = AxiosError<ErrorResponse>>(
  id: string,
  options?: { query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof userGetByIdApi>>, TError, TData>>; axios?: AxiosRequestConfig }
): UseQueryResult<TData, TError> & { queryKey: QueryKey };

export function useUserGetByIdApi<TData = Awaited<ReturnType<typeof userGetByIdApi>>, TError = AxiosError<ErrorResponse>>(
  id: string | undefined | null,
  options?: { query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof userGetByIdApi>>, TError, TData>>; axios?: AxiosRequestConfig }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getUserGetByIdApiQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const prefetchUserGetByIdApi = async <TData = Awaited<ReturnType<typeof userGetByIdApi>>, TError = AxiosError<ErrorResponse>>(
  queryClient: QueryClient,
  id: string | undefined | null,
  options?: { query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof userGetByIdApi>>, TError, TData>>; axios?: AxiosRequestConfig }
): Promise<QueryClient> => {
  const queryOptions = getUserGetByIdApiQueryOptions(id, options);

  await queryClient.prefetchQuery(queryOptions);

  return queryClient;
};
