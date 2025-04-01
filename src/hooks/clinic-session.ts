import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import * as fns from 'endpoints/clinic-session';
import { removeEmpty } from 'utils';

type ClinicSessionListParams = {
  params?: any;
  queryOptions?: UseQueryOptions;
};

type ClinicSessionShowParams = {
  clinicSessionId?: string | undefined,
  queryOptions?: UseQueryOptions;
};

export const useListClinicSession = ({ params, queryOptions }: ClinicSessionListParams) => {
  return useQuery({
    queryKey: ['CLINIC_SESSION_LIST', removeEmpty(params)],
    queryFn: () => fns.getClinicSessionList(params),
    ...queryOptions
  });
};

export const useShowClinicSessionById = ({clinicSessionId, queryOptions}: ClinicSessionShowParams) => {
  return useQuery({
    queryKey: ['BCLINIC_SESSION_SHOW', clinicSessionId],
    queryFn: () => fns.getClinicSessionById(clinicSessionId),
    ...queryOptions
  });
};

export const useCreateClinicSessionMutation = (mutationOptions?: UseMutationOptions<AxiosResponse<any>, unknown, any>) => {
  return useMutation({
    mutationKey: ['CLINIC_SESSION_CREATE'],
    mutationFn: (payload: any) => fns.createClinicSession(payload),
    ...mutationOptions
  });
};

export const useUpdateClinicSessionMutation = (mutationOptions?: UseMutationOptions<AxiosResponse<any>, string, any>) => {
  return useMutation({
    mutationKey: ['CLINIC_SESSION_UPDATE'],
    mutationFn: ({ clinicSessionId, payload }) =>
      fns.updateClinicSession(clinicSessionId, payload),
    ...mutationOptions
  });
};

export const useDeleteClinicSessionMutation = (mutationOptions?: UseMutationOptions<AxiosResponse<any>, unknown, any>) => {
  return useMutation({
    mutationKey: ['CLINIC_SESSION_DELETE'],
    mutationFn: (clinicSessionId: string | undefined) => fns.deleteClinicSession(clinicSessionId),
    ...mutationOptions
  });
};