import axios, { AxiosError } from 'axios';
import i18n from 'i18next';

// TODO uses env
const apiURL = process.env.API_URL ?? 'http://test.com:3000';

export const isAxiosError = <T>(error: unknown): error is AxiosError<T> => {
  if (error instanceof Error) {
    return 'isAxiosError' in error;
  }
  return false;
};

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  config.baseURL = apiURL;
  config.headers.Accept = 'application/json';
  config.headers['Content-Type'] = config.headers['Content-Type'] ?? 'application/json';

  return config;
});

export const configureAxios = ({ onTokenError, onPaymentError }: { onTokenError: () => void; onPaymentError: () => void }) => {
  axiosInstance.interceptors.request.use((config) => {
    config.headers = config.headers || {};
    config.headers['Accept-Language'] = i18n.resolvedLanguage || 'fr';

    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (!isAxiosError(error)) {
        return Promise.reject(error);
      }

      const errorResponse = error.response;
      if (!errorResponse) {
        return Promise.reject(error);
      }

      if (error?.response?.status === 401) {
        onTokenError();
      } else if (error?.response?.status === 402) {
        onPaymentError();
      }

      return Promise.reject(errorResponse.data);
    }
  );
};

export { axiosInstance };
