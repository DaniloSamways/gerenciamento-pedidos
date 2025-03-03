"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useRef, useEffect, useState } from "react"; // Importações para manipular o gradiente
import { graphsService } from "@/services/graphsService";

// Registra os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

interface SalesChartProps {
  salesData?: number[] | null;
}

const SalesChart: React.FC<SalesChartProps> = () => {
  const chartRef = useRef(null); // Ref para o canvas do gráfico
  const [salesData, setSalesData] = useState<{
    isNegative?: boolean;
    data?: any;
    percentageChange?: number;
    currentMonth?: number;
  }>({});
  const [loading, setLoading] = useState({});

  async function getMonthValues() {
    setLoading(true);

    const response = await graphsService
      .getMonthOrdersValue()
      .then((data) => data)
      .catch((error) => console.error(error));

    if (!response) {
      return;
    }

    // Calcula os índices e valores dos meses atual e anterior
    const currentMonthIndex = response.length - 1;
    const lastMonthIndex = currentMonthIndex - 1;
    const currentMonth = response[currentMonthIndex].totalSales || 0;
    const lastMonth = response[lastMonthIndex].totalSales || 0;

    // Calcula a porcentagem de mudança
    const percentageChange = lastMonth
      ? ((Number(currentMonth) - Number(lastMonth)) / Number(lastMonth)) * 100
      : 0;
    const isNegative = percentageChange < 0;

    const data = {
      labels: response.map((_, index) => `Mês ${index + 1}`), // Rótulos para o eixo X
      datasets: [
        {
          label: "R$ Vendidos",
          data: response.map((data) => data.totalSales),
          borderColor: isNegative ? "#ff4d4d" : "#5AD69E",
          backgroundColor: (context: {
            chart: { ctx: CanvasRenderingContext2D };
          }) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400); // Gradiente vertical
            if (isNegative) {
              gradient.addColorStop(0, "rgba(255, 102, 102, 0.4)"); // Cor inicial
              gradient.addColorStop(1, "rgba(255, 102, 102, 0.1)"); // Cor final
            } else {
              gradient.addColorStop(0, "rgba(90, 214, 158, 0.4)"); // Cor inicial
              gradient.addColorStop(1, "rgba(90, 214, 158, 0.1)"); // Cor final
            }
            return gradient;
          },
          fill: true,
          tension: 0.3,
        },
      ],
    };
    setSalesData({
      data,
      percentageChange,
      isNegative,
      currentMonth,
    });

    setLoading(false);
  }

  useEffect(() => {
    getMonthValues();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }, // Oculta a legenda
    },
    scales: {
      x: {
        display: false, // Oculta o eixo X
      },
      y: {
        display: false, // Oculta o eixo Y
      },
    },
  };

  return (
    <Card className="p-4 shadow-md w-fit">
      <CardContent className="p-0 flex">
        {loading && <h2 className="text-2xl font-bold">Carregando...</h2>}
        {(!loading && salesData?.data && (
          <>
            <div className="z-10">
              <h3 className="text-sm font-semibold text-primary-800">
                Vendas do mês
              </h3>
              <h2 className="text-2xl font-bold">
                R$ {(salesData.currentMonth ?? 0).toFixed(2)}
              </h2>
              <div
                className={`flex items-center font-semibold text-sm mt-1 ${
                  salesData.isNegative ? "text-red-500" : "text-green-500"
                }`}
              >
                {salesData.isNegative ? (
                  <ArrowDown size={16} />
                ) : (
                  <ArrowUp size={16} />
                )}
                {Math.abs(salesData.percentageChange ?? 0).toFixed(1)}% que o
                mês passado
              </div>
            </div>
            <div className="mt-2 -ml-5 relative">
              {/* efeito de sumindo na esquerda com uma div */}
              <div className="absolute z-[1] top-0 left-0 w-20 h-full bg-gradient-to-r from-white to-transparent" />
              <Line
                className="opacity-50 z-0"
                data={salesData.data}
                options={options}
                width={200}
                height={100}
                ref={chartRef} // Passa a ref para o componente Line
              />
            </div>
          </>
        )) ?? <h2 className="text-2xl font-bold">Sem dados disponíveis</h2>}
      </CardContent>
    </Card>
  );
};

export default SalesChart;
