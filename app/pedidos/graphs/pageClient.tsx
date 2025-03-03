import {
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Chart as ChartJS } from "chart.js";
import SalesChart from "./charts/monthAmountLineChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

export default function Graphs() {
  return (
    <div className="flex flex-col gap-6 mt-8">
      <h1 className="text-2xl font-bold text-primary-900">Estatísticas</h1>
      <SalesChart salesData={[100, 140, 50, 20, 200]} />
    </div>
  );
}
