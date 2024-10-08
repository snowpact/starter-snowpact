/**
 * Generated by orval v7.0.1 🍺
 * Do not edit manually.
 * Starter API
 * OpenAPI spec version: 1.0.0
 */

import type { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import type {
  AuthLoginBody,
  AuthRefreshBody,
  AuthRegisterBody,
  AuthResendValidationEmailBody,
  AuthResetPasswordBody,
  AuthResetPasswordRequestBody,
  AuthValidateAccountBody,
  ErrorResponse,
  HealthcheckResponse,
  LoginTokens,
  RefreshTokens,
  ResetPasswordResponse
} from '.././models';

export const getPublicApiCollection = (axios: AxiosInstance) => {
  const authLogin = <TData = AxiosResponse<LoginTokens>>(authLoginBody: AuthLoginBody, options?: AxiosRequestConfig): Promise<TData> => {
    return axios.post(`/api/public/auth/login`, authLoginBody, options);
  };
  const authRegister = <TData = AxiosResponse<ErrorResponse>>(
    authRegisterBody: AuthRegisterBody,
    options?: AxiosRequestConfig
  ): Promise<TData> => {
    return axios.post(`/api/public/auth/register`, authRegisterBody, options);
  };
  const authRefresh = <TData = AxiosResponse<RefreshTokens>>(
    authRefreshBody: AuthRefreshBody,
    options?: AxiosRequestConfig
  ): Promise<TData> => {
    return axios.post(`/api/public/auth/refresh`, authRefreshBody, options);
  };
  const authResetPassword = <TData = AxiosResponse<ResetPasswordResponse>>(
    authResetPasswordBody: AuthResetPasswordBody,
    options?: AxiosRequestConfig
  ): Promise<TData> => {
    return axios.post(`/api/public/auth/reset-password`, authResetPasswordBody, options);
  };
  const authResetPasswordRequest = <TData = AxiosResponse<ErrorResponse>>(
    authResetPasswordRequestBody: AuthResetPasswordRequestBody,
    options?: AxiosRequestConfig
  ): Promise<TData> => {
    return axios.post(`/api/public/auth/reset-password-request`, authResetPasswordRequestBody, options);
  };
  const authValidateAccount = <TData = AxiosResponse<ErrorResponse>>(
    authValidateAccountBody: AuthValidateAccountBody,
    options?: AxiosRequestConfig
  ): Promise<TData> => {
    return axios.post(`/api/public/auth/validate-account`, authValidateAccountBody, options);
  };
  const authResendValidationEmail = <TData = AxiosResponse<ErrorResponse>>(
    authResendValidationEmailBody: AuthResendValidationEmailBody,
    options?: AxiosRequestConfig
  ): Promise<TData> => {
    return axios.post(`/api/public/auth/resend-validation-email`, authResendValidationEmailBody, options);
  };
  const healthcheck = <TData = AxiosResponse<HealthcheckResponse>>(options?: AxiosRequestConfig): Promise<TData> => {
    return axios.get(`/api/public/healthcheck`, options);
  };
  return {
    authLogin,
    authRegister,
    authRefresh,
    authResetPassword,
    authResetPasswordRequest,
    authValidateAccount,
    authResendValidationEmail,
    healthcheck
  };
};
export type AuthLoginResult = AxiosResponse<LoginTokens>;
export type AuthRegisterResult = AxiosResponse<ErrorResponse>;
export type AuthRefreshResult = AxiosResponse<RefreshTokens>;
export type AuthResetPasswordResult = AxiosResponse<ResetPasswordResponse>;
export type AuthResetPasswordRequestResult = AxiosResponse<ErrorResponse>;
export type AuthValidateAccountResult = AxiosResponse<ErrorResponse>;
export type AuthResendValidationEmailResult = AxiosResponse<ErrorResponse>;
export type HealthcheckResult = AxiosResponse<HealthcheckResponse>;
