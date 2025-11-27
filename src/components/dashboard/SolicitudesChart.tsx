import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { DashboardResumen } from "../../types/dashboard";
import { useTheme } from "../../context/ThemeContext";

interface Props {
  resumen: DashboardResumen | null;
  loading: boolean;
}

export default function SolicitudesChart({ resumen, loading }: Props) {
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

  const solicitudes = resumen?.solicitudes;
  const series = [
    solicitudes?.aprobadas ?? 0,
    solicitudes?.pendientes ?? 0,
    solicitudes?.rechazadas ?? 0,
  ];

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
      background: "transparent",
    },
    labels: ["Aprobadas", "Pendientes", "Rechazadas"],
    colors: ["#12b76a", "#f79009", "#f04438"], // success, warning, error
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
              formatter: () => `${solicitudes?.total ?? 0}`,
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
          Estado de Solicitudes
        </h3>
        <span className="text-sm text-success-600 dark:text-success-500 font-medium">
          {solicitudes?.tasa_aprobacion ?? 0}% aprobación
        </span>
      </div>

      <Chart options={options} series={series} type="donut" height={250} />
    </div>
  );
}
