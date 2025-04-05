import axios from 'axios';

interface StaffListParams {
    q?: string;
    page?: number;
    limit?: number;
}

export const getStaffList = (params: StaffListParams) => axios.get('/api/v1/core/staff', {
    params: params
});

export const getStaffById = (staffId: string | undefined | null) => axios.get(`/api/v1/core/staff/${staffId}`);

export const createStaff = (payload: any) => axios.post('/api/v1/core/staff', payload);

export const updateStaff = (staffId: string | undefined, payload: any) => axios.put(`/api/v1/core/staff/${staffId}`, payload);

export const deleteStaff = (staffId: string | undefined | null) => axios.delete(`/api/v1/core/staff/${staffId}`);