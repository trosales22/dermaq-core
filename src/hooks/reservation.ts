import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import * as fns from 'endpoints/reservation';
import { removeEmpty } from 'utils';

type ReservationListParams = {
  params?: any;
  queryOptions?: UseQueryOptions;
};

type ReservationQueueInfoParams = {
  clinicSessionId?: string | undefined | null;
  queryOptions?: UseQueryOptions;
};

export const useListReservation = ({ params, queryOptions }: ReservationListParams) => {
  return useQuery({
    queryKey: ['RESERVATION_LIST', removeEmpty(params)],
    queryFn: () => fns.getReservationList(params),
    ...queryOptions
  });
};

export const useUpdateReservationMutation = (mutationOptions?: UseMutationOptions<AxiosResponse<any>, string, any>) => {
  return useMutation({
    mutationKey: ['RESERVATION_UPDATE'],
    mutationFn: ({ clinicSessionId, reservationRefNo, payload }) =>
      fns.updateReservation(clinicSessionId, reservationRefNo, payload),
    ...mutationOptions
  });
};

export const useShowReservationQueueInfo = ({ clinicSessionId, queryOptions }: ReservationQueueInfoParams) => {
  return useQuery({
    queryKey: ['RESERVATION_QUEUE_INFO', clinicSessionId],
    queryFn: () => fns.getReservationQueueInfo(clinicSessionId),
    retry: false,
    ...queryOptions
  });
};