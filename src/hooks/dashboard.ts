import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import * as fns from 'endpoints/dashboard';

type DashboardParams = {
  queryOptions?: UseQueryOptions;
};

export const useDashboardTotals = ({ queryOptions }: DashboardParams) => {
  return useQuery({
    queryKey: ['DASHBOARD_TOTALS'],
    queryFn: () => fns.getDashboardTotals(),
    ...queryOptions
  });
};

export const useDashboardMonthlyReservationStats = ({ queryOptions }: DashboardParams) => {
  return useQuery({
    queryKey: ['DASHBOARD_MONTHLY_RESERVATION_STATS'],
    queryFn: () => fns.getDashboardMonthlyReservationStats(),
    ...queryOptions
  });
};

export const useDashboardReservationCountPerSession = ({ queryOptions }: DashboardParams) => {
  return useQuery({
    queryKey: ['DASHBOARD_RESERVATION_COUNT_PER_SESSION'],
    queryFn: () => fns.getDashboardReservationCountPerSession(),
    ...queryOptions
  });
};