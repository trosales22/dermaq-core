import axios from 'axios';

interface GenericListParams {
    q?: string;
    page?: number;
    limit?: number;
}

export const getCustomerDatasetList = (params: GenericListParams) => axios.get('/api/v1/core/datasets/customers', {
    params: params
});


export const getProductDatasetList = (params: GenericListParams) => axios.get('/api/v1/core/datasets/products', {
    params: params
});