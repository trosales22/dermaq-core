import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import * as fns from 'endpoints/auth';

export const useLoginMutation = (mutationOptions?: UseMutationOptions<AxiosResponse<any>, unknown, any>) => {
  return useMutation({
    mutationKey: ['LOGIN'],
    mutationFn: (payload: any) => fns.login(payload),
    ...mutationOptions
  });
};

export const useLogoutMutation = (mutationOptions?: UseMutationOptions<AxiosResponse<any>, unknown, unknown>) => {
  return useMutation({
    mutationKey: ['LOGOUT'],
    mutationFn: () => fns.logout(),
    ...mutationOptions
  });
};
