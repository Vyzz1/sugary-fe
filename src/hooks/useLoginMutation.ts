import type { UseMutationOptions } from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";
import { useApiMutation } from "./useApiMutation";
import { setAccessToken } from "../lib/auth-token";
import type { BaseResponse, ErrorResponse } from "../types/api";

export interface LoginVariables {
  username: string;
  password: string;
}

export interface LoginResponseData {
  accessToken?: string;
  access_token?: string;
  expires_in?: string;
  token_type?: string;
}

type LoginResponse = BaseResponse<LoginResponseData>;

interface UseLoginMutationOptions<TVariables, TContext> extends Omit<
  UseMutationOptions<LoginResponse, ErrorResponse, TVariables, TContext>,
  "mutationFn"
> {
  axiosConfig?: AxiosRequestConfig;
}

export function useLoginMutation<
  TVariables extends LoginVariables = LoginVariables,
  TContext = unknown,
>(options?: UseLoginMutationOptions<TVariables, TContext>) {
  const { axiosConfig, onSuccess, ...mutationOptions } = options || {};

  return useApiMutation<LoginResponse, ErrorResponse, TVariables, TContext>("/login", "POST", {
    ...mutationOptions,
    axiosConfig: {
      ...axiosConfig,
      skipAuth: true,
    },
    onSuccess: (response, variables, onMutateResult, context) => {
      const accessToken = response.data.accessToken ?? response.data.access_token;

      if (!accessToken) {
        throw new Error("Login response does not include an access token.");
      }

      setAccessToken(accessToken);
      return onSuccess?.(response, variables, onMutateResult, context);
    },
  });
}
