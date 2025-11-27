import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { DashboardResumen } from "../../types/dashboard";

interface Props {
  resumen: DashboardResumen | null;
  loading: boolean;
}

export default function SolicitudesChart({ resumen, loading }: Props) {
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
    },
    labels: ["Aprobadas", "Pendientes", "Rechazadas"],
    colors: ["#10B981", "#F59E0B", "#EF4444"],
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
              formatter: () => `${solicitudes?.total ?? 0}`,
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
          Estado de Solicitudes
        </h3>
        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
          {solicitudes?.tasa_aprobacion ?? 0}% aprobación
        </span>
      </div>

      <Chart options={options} series={series} type="donut" height={250} />

      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Aprobadas</p>
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
            {solicitudes?.aprobadas ?? 0}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Pendientes</p>
          <p className="text-lg font-semibold text-amber-600 dark:text-amber-400">
            {solicitudes?.pendientes ?? 0}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Rechazadas</p>
          <p className="text-lg font-semibold text-red-600 dark:text-red-400">
            {solicitudes?.rechazadas ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}
