import axios from 'axios';

interface OrderListParams {
    q?: string;
    page?: number;
    limit?: number;
}

export const getOrderList = (params: OrderListParams) => axios.get('/api/v1/core/orders', {
    params: params
});

export const getOrderById = (orderId: string | undefined | null) => axios.get(`/api/v1/core/orders/${orderId}`);

export const createOrder = (payload: any) => axios.post('/api/v1/core/orders', payload);

export const deleteOrder = (orderId: string | undefined | null) => axios.delete(`/api/v1/core/orders/${orderId}`);