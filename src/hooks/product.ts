import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import * as fns from 'endpoints/product';
import { removeEmpty } from 'utils';

type ProductListParams = {
    params?: any;
    queryOptions?: UseQueryOptions;
};

type ProductShowParams = {
    productId?: string | undefined | null,
    queryOptions?: UseQueryOptions;
};

export const useListProduct = ({ params, queryOptions }: ProductListParams) => {
  return useQuery({
    queryKey: ['PRODUCT_LIST', removeEmpty(params)],
    queryFn: () => fns.getProductList(params),
    ...queryOptions
  });
};

export const useShowProductById = ({productId, queryOptions}: ProductShowParams) => {
  return useQuery({
    queryKey: ['PRODUCT_SHOW', productId],
    queryFn: () => fns.getProductById(productId),
    ...queryOptions
  });
};

export const useCreateProductMutation = (mutationOptions?: UseMutationOptions<AxiosResponse<any>, unknown, any>) => {
  return useMutation({
    mutationKey: ['PRODUCT_CREATE'],
    mutationFn: (payload: any) => fns.createProduct(payload),
    ...mutationOptions
  });
};

export const useUpdateProductMutation = (mutationOptions?: UseMutationOptions<AxiosResponse<any>, string, any>) => {
  return useMutation({
    mutationKey: ['PRODUCT_UPDATE'],
    mutationFn: ({ productId, payload }) =>
      fns.updateProduct(productId, payload),
    ...mutationOptions
  });
};

export const useDeleteProductMutation = (mutationOptions?: UseMutationOptions<AxiosResponse<any>, unknown, any>) => {
  return useMutation({
    mutationKey: ['PRODUCT_DELETE'],
    mutationFn: (productId: string | undefined | null) => fns.deleteProduct(productId),
    ...mutationOptions
  });
};