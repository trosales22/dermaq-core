import axios from 'axios';

interface CustomerListParams {
    q?: string;
    page?: number;
    limit?: number;
}

export const getCustomerList = (params: CustomerListParams) => axios.get('/api/v1/core/customers', {
    params: params
});

export const getCustomerById = (customerId: string | undefined | null) => axios.get(`/api/v1/core/customers/${customerId}`);