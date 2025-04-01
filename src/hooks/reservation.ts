import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import * as fns from 'endpoints/reservation';
import { removeEmpty } from 'utils';

type ReservationListParams = {
  params?: any;
  queryOptions?: UseQueryOptions;
};

export const useListReservation = ({ params, queryOptions }: ReservationListParams) => {
  return useQuery({
    queryKey: ['RESERVATION_LIST', removeEmpty(params)],
    queryFn: () => fns.getReservationList(params),
    ...queryOptions
  });
};