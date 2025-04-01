import axios from 'axios';

interface ClinicSessionListParams {
    q?: string;
    page?: number;
    limit?: number;
}

export const getClinicSessionList = (params: ClinicSessionListParams) => axios.get('/api/v1/core/clinic_sessions', {
    params: params
});

export const getClinicSessionById = (clinicSessionId: string | undefined) => axios.get(`/api/v1/core/clinic_sessions/${clinicSessionId}`);

export const createClinicSession = (payload: any) => axios.post('/api/v1/core/clinic_sessions', payload);

export const updateClinicSession = (clinicSessionId: string | undefined, payload: any) => axios.put(`/api/v1/core/clinic_sessions/${clinicSessionId}`, payload);

export const deleteClinicSession= (clinicSessionId: string | undefined) => axios.delete(`/api/v1/core/clinic_sessions/${clinicSessionId}`);