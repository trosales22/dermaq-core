import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import * as fns from 'endpoints/auth';

type MyProfileParams = {
  queryOptions?: UseQueryOptions;
};

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

export const useMyProfile = ({ queryOptions }: MyProfileParams) => {
  return useQuery({
    queryKey: ['MY_PROFILE'],
    queryFn: () => fns.myProfile(),
    ...queryOptions
  });
};

export const useUpdateMyProfileMutation = (mutationOptions?: UseMutationOptions<AxiosResponse<any>, unknown, any>) => {
  return useMutation({
    mutationKey: ['UPDATE_MY_PROFILE'],
    mutationFn: (payload) => fns.updateMyProfile(payload),
    ...mutationOptions
  });
};

export const useChangePasswordMutation = (mutationOptions?: UseMutationOptions<AxiosResponse<any>, unknown, any>) => {
  return useMutation({
    mutationKey: ['CHANGE_PASSWORD'],
    mutationFn: (payload) => fns.changePassword(payload),
    ...mutationOptions
  });
};