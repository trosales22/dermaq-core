import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import * as fns from 'endpoints/dataset';
import { removeEmpty } from 'utils';

type GenericListParams = {
  params?: any;
  queryOptions?: UseQueryOptions;
};


export const useListCustomerDataset = ({ params, queryOptions }: GenericListParams) => {
  return useQuery({
    queryKey: ['DATASET_CUSTOMER_LIST', removeEmpty(params)],
    queryFn: () => fns.getCustomerDatasetList(params),
    ...queryOptions
  });
};

export const useListProductDataset = ({ params, queryOptions }: GenericListParams) => {
    return useQuery({
      queryKey: ['DATASET_PRODUCT_LIST', removeEmpty(params)],
      queryFn: () => fns.getProductDatasetList(params),
      ...queryOptions
    });
  };