import { Chart, ChartOptions } from "chart.js";
import {
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
} from "chart.js";

// Register all necessary Chart.js components globally
Chart.register(
  CategoryScale, // Required for X-axis in bar/line charts
  LinearScale, // Required for Y-axis in bar/line charts
  RadialLinearScale, // Required for radar and polar area charts
  BarElement, // Bar charts
  LineElement, // Line charts
  PointElement, // Points on line charts
  ArcElement, // Pie, Doughnut, Polar Area
  Title, // Chart title
  Tooltip, // Tooltip display
  Legend // Chart legend
);

// Default chart options (applies to all types)
export const defaultChartOptions: ChartOptions<any> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        font: {
          size: 14,
        },
      },
    },
    tooltip: {
      enabled: true,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      titleFont: { size: 14 },
      bodyFont: { size: 12 },
    },
  },
};
