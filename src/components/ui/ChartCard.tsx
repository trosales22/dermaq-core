import { FC } from "react";
import { ChartData, ChartOptions } from "chart.js";
import { Line, Bar, Pie, Doughnut, Radar, PolarArea } from "react-chartjs-2";

interface ChartCardProps {
    title: string;
    type: "line" | "bar" | "horizontalBar" | "pie" | "doughnut" | "radar" | "polarArea";
    data: ChartData<any, any, any>;
    options?: ChartOptions<any>;
}

const ChartCard: FC<ChartCardProps> = ({ title, type, data, options }) => {
    // Ensure horizontal bar uses correct axis setting
    const barOptions = type === "horizontalBar" ? { indexAxis: "y", barThickness: 20, ...options } : options;

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg h-[400px] flex flex-col">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <div className="flex-grow">
                {type === "line" && <Line data={data} options={{ ...options, barThickness: 20, maintainAspectRatio: false }} />}
                {type === "bar" && <Bar data={data} options={{ ...options, barThickness: 20, maintainAspectRatio: false }} />}
                {type === "horizontalBar" && <Bar data={data} options={{ ...barOptions, maintainAspectRatio: false }} />}
                {type === "pie" && <Pie data={data} options={{ ...options, maintainAspectRatio: false }} />}
                {type === "doughnut" && <Doughnut data={data} options={{ ...options, maintainAspectRatio: false }} />}
                {type === "radar" && <Radar data={data} options={{ ...options, maintainAspectRatio: false }} />}
                {type === "polarArea" && <PolarArea data={data} options={{ ...options, maintainAspectRatio: false }} />}
            </div>
        </div>
    );
};

export default ChartCard;
