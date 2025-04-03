import axios from 'axios';

interface ProductListParams {
    q?: string;
    page?: number;
    limit?: number;
}

export const getProductList = (params: ProductListParams) => axios.get('/api/v1/core/products', {
    params: params
});

export const getProductById = (productId: string | undefined | null) => axios.get(`/api/v1/core/products/${productId}`);

export const createProduct = (payload: any) => axios.post('/api/v1/core/products', payload);

export const updateProduct = (productId: string | undefined, payload: any) => axios.put(`/api/v1/core/products/${productId}`, payload);

export const deleteProduct = (productId: string | undefined | null) => axios.delete(`/api/v1/core/products/${productId}`);