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