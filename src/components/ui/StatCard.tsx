import { FC } from "react";

interface StatCardProps {
    label: string;
    value: string;
    color?: string;
}

const StatCard: FC<StatCardProps> = ({ label, value, color = "text-gray-800" }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
            <h2 className="text-lg font-semibold">{label}</h2>
            <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
    );
};

export default StatCard;
