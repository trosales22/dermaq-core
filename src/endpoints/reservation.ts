import axios from 'axios';
import { removeEmpty } from 'utils';

interface ReservationListParams {
    q?: string;
    page?: number;
    limit?: number;
    clinic_session_id?: string;
    customer_id?: string;
}

export const getReservationList = (params: ReservationListParams) => axios.get('/api/v1/core/reservations', {
    params: removeEmpty(params)
});

export const updateReservation = (clinicSessionId: string | undefined, reservationRefNo: string | undefined, payload: any) => axios.put(`/api/v1/core/clinic_sessions/${clinicSessionId}/reservations/${reservationRefNo}`, payload);

export const getReservationQueueInfo = (clinicSessionId: string | undefined | null) => axios.get(`/api/v1/core/clinic_sessions/${clinicSessionId}/queue_info`);