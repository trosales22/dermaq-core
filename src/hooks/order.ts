import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import * as fns from 'endpoints/order';
import { removeEmpty } from 'utils';

type OrderListParams = {
    params?: any;
    queryOptions?: UseQueryOptions;
};

type OrderShowParams = {
    orderId?: string | undefined | null,
    queryOptions?: UseQueryOptions;
};

export const useListOrder = ({ params, queryOptions }: OrderListParams) => {
  return useQuery({
    queryKey: ['ORDER_LIST', removeEmpty(params)],
    queryFn: () => fns.getOrderList(params),
    ...queryOptions
  });
};

export const useShowOrderById = ({orderId, queryOptions}: OrderShowParams) => {
  return useQuery({
    queryKey: ['ORDER_SHOW', orderId],
    queryFn: () => fns.getOrderById(orderId),
    ...queryOptions
  });
};

export const useCreateOrderMutation = (mutationOptions?: UseMutationOptions<AxiosResponse<any>, unknown, any>) => {
  return useMutation({
    mutationKey: ['ORDER_CREATE'],
    mutationFn: (payload: any) => fns.createOrder(payload),
    ...mutationOptions
  });
};

export const useDeleteOrderMutation = (mutationOptions?: UseMutationOptions<AxiosResponse<any>, unknown, any>) => {
  return useMutation({
    mutationKey: ['ORDER_DELETE'],
    mutationFn: (orderId: string | undefined | null) => fns.deleteOrder(orderId),
    ...mutationOptions
  });
};