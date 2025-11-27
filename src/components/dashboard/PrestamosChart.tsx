import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { DashboardResumen } from "../../types/dashboard";
import { useTheme } from "../../context/ThemeContext";

interface Props {
  resumen: DashboardResumen | null;
  loading: boolean;
}

export default function PrestamosChart({ resumen, loading }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-48 mb-4"></div>
        <div className="h-[200px] bg-gray-200 rounded dark:bg-gray-700"></div>
      </div>
    );
  }

  const prestamos = resumen?.prestamos;
  const series = [
    prestamos?.en_curso ?? 0,
    prestamos?.completados ?? 0,
    prestamos?.en_mora ?? 0,
  ];

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
      background: "transparent",
    },
    labels: ["En Curso", "Completados", "En Mora"],
    colors: ["#0ba5ec", "#12b76a", "#f04438"], // info, success, error
    legend: {
      position: "bottom",
      fontFamily: "Outfit, sans-serif",
      labels: {
        colors: isDark ? "#9CA3AF" : "#374151",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
      style: {
        colors: ["#FFFFFF"],
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              color: isDark ? "#9CA3AF" : "#374151",
            },
            value: {
              show: true,
              fontSize: "20px",
              fontWeight: 600,
              color: isDark ? "#E5E7EB" : "#1F2937",
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "14px",
              color: isDark ? "#9CA3AF" : "#374151",
              formatter: () => `${prestamos?.total ?? 0}`,
            },
          },
        },
      },
    },
    stroke: {
      colors: isDark ? ["#1F2937"] : ["#FFFFFF"],
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 280,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Estado de Préstamos
        </h3>
        {(prestamos?.tasa_mora ?? 0) > 0 && (
          <span className="text-sm text-error-600 dark:text-error-500 font-medium">
            {prestamos?.tasa_mora ?? 0}% mora
          </span>
        )}
      </div>

      <Chart options={options} series={series} type="donut" height={250} />
    </div>
  );
}
