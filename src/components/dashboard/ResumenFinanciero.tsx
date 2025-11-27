import { DashboardResumen } from "../../types/dashboard";
import { FaChartLine, FaWallet, FaHandHoldingUsd } from "react-icons/fa";

interface Props {
  resumen: DashboardResumen | null;
  loading: boolean;
}

export default function ResumenFinanciero({ resumen, loading }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-BO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-40 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-32"></div>
              <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const financials = [
    {
      label: "Total Desembolsado",
      value: resumen?.prestamos.monto_desembolsado ?? 0,
      icon: <FaHandHoldingUsd className="text-brand-500 size-5" />,
      color: "text-brand-500 dark:text-brand-400",
    },
    {
      label: "Por Cobrar",
      value: resumen?.prestamos.monto_restante ?? 0,
      icon: <FaWallet className="text-warning-500 size-5" />,
      color: "text-warning-600 dark:text-orange-400",
    },
    {
      label: "Total Recaudado",
      value: resumen?.pagos.total_recaudado ?? 0,
      icon: <FaChartLine className="text-success-500 size-5" />,
      color: "text-success-600 dark:text-success-500",
    },
    {
      label: "Mora Acumulada",
      value: resumen?.pagos.mora_acumulada ?? 0,
      icon: <FaChartLine className="text-error-500 size-5" />,
      color: "text-error-600 dark:text-error-500",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
        Resumen Financiero
      </h3>

      <div className="space-y-4">
        {financials.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800">
                {item.icon}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.label}
              </span>
            </div>
            <span className={`font-semibold ${item.color}`}>
              Bs. {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
