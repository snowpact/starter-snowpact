import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';

// Generic type for API response
type ApiResponse<T> = {
  data: T;
};

// Generic type for error response
type ErrorResponse = {
  message: string;
  status: number;
};

// Generic type for query parameters
type QueryParams = Record<string, unknown>;

// Generic type for mutation parameters
type MutationParams = Record<string, unknown>;

export const useApiQuery = <TData = unknown, TParams extends QueryParams = QueryParams>(
  queryKey: QueryKey,
  queryFn: (params?: TParams) => Promise<ApiResponse<TData>>,
  options?: Omit<UseQueryOptions<TData, ErrorResponse, TData, QueryKey>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey,
    queryFn: () => queryFn().then(response => response.data),
    ...options,
  });
};

export const useApiMutation = <
  TData = unknown,
  TParams extends MutationParams = MutationParams,
  TError = ErrorResponse,
>(
  mutationFn: (params: TParams) => Promise<ApiResponse<TData>>,
  options?: Omit<UseMutationOptions<TData, TError, TParams>, 'mutationFn'>
) => {
  const { onSuccess: optionsOnSuccess, onError: optionsOnError, ...restOptions } = options ?? {};

  return useMutation({
    mutationFn: (params: TParams) => mutationFn(params).then(response => response.data),
    onSuccess: (data: TData, params: TParams, context: unknown) => {
      if (optionsOnSuccess) {
        optionsOnSuccess(data, params, context);
      }
    },
    onError: (error: TError, params: TParams, context: unknown) => {
      if (optionsOnError) {
        optionsOnError(error, params, context);
      }
    },
    ...restOptions,
  });
};
