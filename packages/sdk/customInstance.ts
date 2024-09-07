import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// add a second `options` argument here if you want to pass extra options to each generated query
export const customInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig & { axiosInstance?: AxiosInstance }) => {
  const { axiosInstance, ...rest } = options ?? {};
  const controller = new AbortController();
  const axios = axiosInstance ?? Axios.create();

  const promise = axios({
    ...config,
    ...rest,
    signal: controller.signal
  }).then(({ data }: { data: T }) => data);

  // @ts-ignore
  promise.cancel = () => {
    controller.abort();
  };

  return promise;
};
