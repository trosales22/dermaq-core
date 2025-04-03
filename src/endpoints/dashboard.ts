import axios from 'axios';

export const getDashboardTotals = () => axios.get(`/api/v1/core/dashboard/statistics/totals`);

export const getDashboardMonthlyReservationStats = () => axios.get(`/api/v1/core/dashboard/analytics/monthly_reservation_stats`);

export const getDashboardReservationCountPerSession = () => axios.get(`/api/v1/core/dashboard/analytics/reservation_count_per_session`);