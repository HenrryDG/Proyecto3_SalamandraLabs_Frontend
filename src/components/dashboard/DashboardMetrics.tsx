import { GroupIcon } from "../../icons";
import { FaMoneyBillWave, FaFileInvoiceDollar, FaExclamationTriangle } from "react-icons/fa";
import { DashboardResumen } from "../../types/dashboard";

interface Props {
  resumen: DashboardResumen | null;
  loading: boolean;
}

export default function DashboardMetrics({ resumen, loading }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-BO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700"></div>
            <div className="mt-5 space-y-2">
              <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-20"></div>
              <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: "Clientes Activos",
      value: resumen?.clientes.activos ?? 0,
      subtitle: `${resumen?.clientes.total ?? 0} total`,
      icon: <GroupIcon className="text-blue-600 size-6" />,
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Préstamos en Curso",
      value: resumen?.prestamos.en_curso ?? 0,
      subtitle: `${resumen?.prestamos.en_mora ?? 0} en mora`,
      icon: <FaMoneyBillWave className="text-green-600 size-6" />,
      bgColor: "bg-green-100 dark:bg-green-900/30",
      highlight: (resumen?.prestamos.en_mora ?? 0) > 0,
    },
    {
      title: "Total Recaudado",
      value: `Bs. ${formatCurrency(resumen?.pagos.total_recaudado ?? 0)}`,
      subtitle: `${resumen?.pagos.tasa_cumplimiento ?? 0}% cumplimiento`,
      icon: <FaFileInvoiceDollar className="text-emerald-600 size-6" />,
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      isAmount: true,
    },
    {
      title: "Cuotas Pendientes",
      value: resumen?.pagos.cuotas_pendientes ?? 0,
      subtitle: `${resumen?.pagos.cuotas_vencidas ?? 0} vencidas`,
      icon: <FaExclamationTriangle className="text-amber-600 size-6" />,
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      highlight: (resumen?.pagos.cuotas_vencidas ?? 0) > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
        >
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-xl ${metric.bgColor}`}
          >
            {metric.icon}
          </div>

          <div className="mt-5">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {metric.title}
            </span>
            <h4 className="mt-1 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metric.isAmount ? metric.value : metric.value.toLocaleString()}
            </h4>
            <span
              className={`text-xs ${
                metric.highlight
                  ? "text-red-500 dark:text-red-400"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {metric.subtitle}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
