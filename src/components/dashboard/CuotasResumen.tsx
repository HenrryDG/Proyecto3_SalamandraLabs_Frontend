import { DashboardResumen } from "../../types/dashboard";

interface Props {
  resumen: DashboardResumen | null;
  loading: boolean;
}

export default function CuotasResumen({ resumen, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-40 mb-6"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded dark:bg-gray-700"></div>
          ))}
        </div>
      </div>
    );
  }

  const pagos = resumen?.pagos;
  const totalCuotas = pagos?.total_cuotas ?? 0;

  const estados = [
    {
      label: "Pagadas",
      cantidad: pagos?.cuotas_pagadas ?? 0,
      porcentaje: totalCuotas > 0 ? ((pagos?.cuotas_pagadas ?? 0) / totalCuotas) * 100 : 0,
      color: "bg-green-500",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "Pendientes",
      cantidad: pagos?.cuotas_pendientes ?? 0,
      porcentaje: totalCuotas > 0 ? ((pagos?.cuotas_pendientes ?? 0) / totalCuotas) * 100 : 0,
      color: "bg-amber-500",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Vencidas",
      cantidad: pagos?.cuotas_vencidas ?? 0,
      porcentaje: totalCuotas > 0 ? ((pagos?.cuotas_vencidas ?? 0) / totalCuotas) * 100 : 0,
      color: "bg-red-500",
      textColor: "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Estado de Cuotas
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {totalCuotas} total
        </span>
      </div>

      {/* Barra de progreso apilada */}
      <div className="h-4 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex mb-6">
        {estados.map((estado, index) => (
          <div
            key={index}
            className={`${estado.color} transition-all duration-500`}
            style={{ width: `${estado.porcentaje}%` }}
          />
        ))}
      </div>

      {/* Detalle de estados */}
      <div className="space-y-3">
        {estados.map((estado, index) => (
          <div
            key={index}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${estado.color}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {estado.label}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-semibold ${estado.textColor}`}>
                {estado.cantidad}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 w-12 text-right">
                {estado.porcentaje.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
