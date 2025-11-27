import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { DashboardResumen } from "../../types/dashboard";

interface Props {
  resumen: DashboardResumen | null;
  loading: boolean;
}

export default function PrestamosChart({ resumen, loading }: Props) {
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
    },
    labels: ["En Curso", "Completados", "En Mora"],
    colors: ["#3B82F6", "#10B981", "#EF4444"],
    legend: {
      position: "bottom",
      fontFamily: "Outfit, sans-serif",
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
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
            },
            value: {
              show: true,
              fontSize: "20px",
              fontWeight: 600,
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "14px",
              formatter: () => `${prestamos?.total ?? 0}`,
            },
          },
        },
      },
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
          <span className="text-sm text-red-600 dark:text-red-400 font-medium">
            {prestamos?.tasa_mora ?? 0}% mora
          </span>
        )}
      </div>

      <Chart options={options} series={series} type="donut" height={250} />

      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">En Curso</p>
          <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {prestamos?.en_curso ?? 0}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Completados</p>
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
            {prestamos?.completados ?? 0}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">En Mora</p>
          <p className="text-lg font-semibold text-red-600 dark:text-red-400">
            {prestamos?.en_mora ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}
