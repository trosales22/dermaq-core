
import { ChartCard, StatCard } from "components/ui/components";
import Layout from "components/Layout";
import { transformMonthlyReservationStats, transformReservationCountPerSession } from "transformers/transformer";
import { useDashboardTotals, useDashboardMonthlyReservationStats, useDashboardReservationCountPerSession } from "hooks/dashboard";
import { Role, ROLES } from "constants/roles";
import Cookies from 'js-cookie';

const DashboardPage = () => {
    const userRole = (Cookies.get('role') as Role) ?? '';
    const { data: totalsRes }: any = useDashboardTotals({})
    const { data: monthlyReservationStatsRes }: any = useDashboardMonthlyReservationStats({})
    const { data: reservationCountPerSessionRes }: any = useDashboardReservationCountPerSession({})
    
    const stats = [
        { label: "Total Sessions", value: totalsRes?.data?.total_sessions || 0, color: 'text-orange-600', roles: [ROLES.ADMIN] },
        { label: "Total Reservations", value: totalsRes?.data?.total_reservations || 0, color: 'text-red-600', roles: [ROLES.ADMIN] },
        { label: "Total Products", value: totalsRes?.data?.total_products || 0, color: 'text-violet-600', roles: [ROLES.ADMIN] }
    ]

    const filteredStats = stats.filter(stat => stat.roles.includes(userRole))
    const monthlyReservationStatsData = transformMonthlyReservationStats(monthlyReservationStatsRes?.data?.data || [])
    const reservationCountPerSessionData = transformReservationCountPerSession(reservationCountPerSessionRes?.data?.data || [])

    return (
        <Layout>
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                {filteredStats.map((stat, index) => (
                    <StatCard key={index} label={stat.label} value={stat.value} color={stat.color} />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ChartCard title="Monthly Reservations" type="bar" data={monthlyReservationStatsData} />
                <ChartCard title="Reservation Count per Session" type="horizontalBar" data={reservationCountPerSessionData} />
            </div>
        </Layout>
    );
};

export default DashboardPage;
