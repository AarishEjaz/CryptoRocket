import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getMoneySymbol } from "../../../utils/additionalFunc";
import { setLoading } from "../../../redux/slices/loadingSlice";
import { getIncomeWeakData } from "../../../api/user.api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EarningsChart = () => {
  const dispatch = useDispatch();

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchIncomeWeekTotal = async () => {
      try {
        dispatch(setLoading(true));
        const response = await getIncomeWeakData();

        const rawData = response?.data || [];

        const labels = rawData.map((item) => item.date);
        const dataPoints = rawData.map((item) =>
          parseFloat(item.count.toFixed(2))
        );

        setChartData({
          labels,
          datasets: [
            {
              label: `Earnings (${getMoneySymbol()})`,
              data: dataPoints,
              borderColor: "#38bdf8",
              backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                gradient.addColorStop(0, "rgba(56, 189, 248, 0.4)");
                gradient.addColorStop(1, "rgba(56, 189, 248, 0)");
                return gradient;
              },
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "#38bdf8",
              pointBorderColor: "#fff",
              pointHoverRadius: 7,
              pointRadius: 5,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching weekly income data:", err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchIncomeWeekTotal();
  }, [dispatch]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "#94a3b8" },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: {
          color: "#94a3b8",
          callback: function (value) {
            return "$" + value;
          },
        },
      },
    },
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6 h-100">
      <h2 className="text-xl font-semibold text-white mb-4">
        Earnings Overview
      </h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default EarningsChart;
