export const transformMonthlyReservationStats = (apiResponse: any) => {
    const labels: string[] = [];
    const confirmedCounts: number[] = [];
    const completedCounts: number[] = [];
    const unattendedCounts: number[] = [];

    apiResponse.forEach((item: any) => {
        labels.push(item.month);
        confirmedCounts.push(Number(item.confirmed_counts || 0));
        completedCounts.push(Number(item.completed_count || 0));
        unattendedCounts.push(Number(item.unattended_count || 0));
    });

    return {
        labels,
        datasets: [
            {
                label: "Confirmed",
                data: confirmedCounts,
                backgroundColor: "#4CAF50", // Green
                borderColor: "#388E3C",
                borderWidth: 1,
            },
            {
                label: "Completed",
                data: completedCounts,
                backgroundColor: "#FFC107", // Yellow
                borderColor: "#FFA000",
                borderWidth: 1,
            },
            {
                label: "Unattended",
                data: unattendedCounts,
                backgroundColor: "#F44336", // Red
                borderColor: "#D32F2F",
                borderWidth: 1,
            }
        ],
    };
};

export const transformReservationCountPerSession = (apiResponse: any) => {
    const labels: string[] = [];
    const reservationCounts: number[] = [];

    apiResponse.forEach((item: any) => {
        labels.push(item.key);
        reservationCounts.push(Number(item.value || 0));
    });

    return {
        labels,
        datasets: [
            {
                label: "Reservations",
                data: reservationCounts,
                backgroundColor: '#000000',
                borderColor: "#000000",
                borderWidth: 1,
            }
        ],
    };
};