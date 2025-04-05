import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import * as fns from 'endpoints/customer';
import { removeEmpty } from 'utils';

type CustomerListParams = {
    params?: any;
    queryOptions?: UseQueryOptions;
};

type CustomerShowParams = {
    customerId?: string | undefined | null,
    queryOptions?: UseQueryOptions;
};

export const useListCustomer = ({ params, queryOptions }: CustomerListParams) => {
  return useQuery({
    queryKey: ['CUSTOMER_LIST', removeEmpty(params)],
    queryFn: () => fns.getCustomerList(params),
    ...queryOptions
  });
};

export const useShowCustomerById = ({customerId, queryOptions}: CustomerShowParams) => {
  return useQuery({
    queryKey: ['CUSTOMER_SHOW', customerId],
    queryFn: () => fns.getCustomerById(customerId),
    ...queryOptions
  });
};