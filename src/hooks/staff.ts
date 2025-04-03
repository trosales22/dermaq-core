import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import * as fns from 'endpoints/staff';
import { removeEmpty } from 'utils';

type StaffListParams = {
    params?: any;
    queryOptions?: UseQueryOptions;
};

type StaffShowParams = {
    staffId?: string | undefined | null,
    queryOptions?: UseQueryOptions;
};

export const useListStaff = ({ params, queryOptions }: StaffListParams) => {
  return useQuery({
    queryKey: ['STAFF_LIST', removeEmpty(params)],
    queryFn: () => fns.getStaffList(params),
    ...queryOptions
  });
};

export const useShowStaffById = ({staffId, queryOptions}: StaffShowParams) => {
  return useQuery({
    queryKey: ['STAFF_SHOW', staffId],
    queryFn: () => fns.getStaffById(staffId),
    ...queryOptions
  });
};

export const useCreateStaffMutation = (mutationOptions?: UseMutationOptions<AxiosResponse<any>, unknown, any>) => {
  return useMutation({
    mutationKey: ['STAFF_CREATE'],
    mutationFn: (payload: any) => fns.createStaff(payload),
    ...mutationOptions
  });
};

export const useUpdateStaffMutation = (mutationOptions?: UseMutationOptions<AxiosResponse<any>, string, any>) => {
  return useMutation({
    mutationKey: ['STAFF_UPDATE'],
    mutationFn: ({ staffId, payload }) =>
      fns.updateStaff(staffId, payload),
    ...mutationOptions
  });
};

export const useDeleteStaffMutation = (mutationOptions?: UseMutationOptions<AxiosResponse<any>, unknown, any>) => {
  return useMutation({
    mutationKey: ['STAFF_DELETE'],
    mutationFn: (staffId: string | undefined | null) => fns.deleteStaff(staffId),
    ...mutationOptions
  });
};