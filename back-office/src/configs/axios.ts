import axios, { InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

import { apiUrl } from './config';
import i18n from './i18n';

import { refreshRequest } from '@/api/lib/auth';

type OriginalRequest = InternalAxiosRequestConfig & { _isRetry?: boolean };

const skipTokenError = [
  '/public/auth/refresh',
  '/public/auth/refresh/',
  '/public/auth/login',
  '/public/auth/login/',
];
const skipToast = ['/agent/organization/zone'];

const defaultToastConfig = {
  duration: 3000,
  id: 'api-error',
};

export const configureAxios = ({
  onTokenError,
  translate,
}: {
  onTokenError: () => void;
  translate: (key: string) => string;
}) => {
  axios.defaults.baseURL = apiUrl;
  axios.defaults.headers.common['Content-Type'] = 'application/json';

  axios.interceptors.request.use(config => {
    const token = Cookies.get('at');

    config.headers = config.headers || {};

    config.headers.Accept = 'application/json';
    config.headers['Accept-Language'] = i18n.resolvedLanguage || 'fr';

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  axios.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest: OriginalRequest = error.config;
      const message = error?.response?.data?.message || translate('errors.common-api');
      const statusCode = error?.response?.status;

      const isRetry = originalRequest?._isRetry;
      const url = error?.config.url;

      if (statusCode === 401 && isRetry) {
        onTokenError();
        toast.error(message, defaultToastConfig);
      } else if (statusCode === 401 && !skipTokenError.includes(url) && !isRetry) {
        originalRequest._isRetry = true;
        try {
          await refreshRequest();
          return axios.request(originalRequest);
        } catch {
          onTokenError();
          toast.error(message, defaultToastConfig);
        }
      } else {
        if (!skipToast.includes(url)) {
          toast.error(message, defaultToastConfig);
        }
      }
      return Promise.reject(error?.response?.data);
    }
  );
};
