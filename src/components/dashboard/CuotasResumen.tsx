import { DashboardResumen } from "../../types/dashboard";
import { usePlanPagosEstadisticas } from "../../hooks/dashboard/usePlanPagosEstadisticas";

interface Props {
  resumen: DashboardResumen | null;
  loading: boolean;
}

export default function CuotasResumen({ resumen, loading }: Props) {
  const { estadisticas: planPagos, loading: loadingPlanPagos } = usePlanPagosEstadisticas();

  if (loading || loadingPlanPagos) {
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
      color: "bg-success-500",
      textColor: "text-success-600 dark:text-success-500",
    },
    {
      label: "Pendientes",
      cantidad: pagos?.cuotas_pendientes ?? 0,
      porcentaje: totalCuotas > 0 ? ((pagos?.cuotas_pendientes ?? 0) / totalCuotas) * 100 : 0,
      color: "bg-warning-500",
      textColor: "text-warning-600 dark:text-orange-400",
    },
    {
      label: "Vencidas",
      cantidad: pagos?.cuotas_vencidas ?? 0,
      porcentaje: totalCuotas > 0 ? ((pagos?.cuotas_vencidas ?? 0) / totalCuotas) * 100 : 0,
      color: "bg-error-500",
      textColor: "text-error-600 dark:text-error-500",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 h-full">
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

      {/* Distribución por método de pago */}
      {planPagos?.distribucion_metodo_pago && planPagos.distribucion_metodo_pago.length > 0 && (
        <>
          <div className="mt-6 mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Métodos de Pago
            </h4>
          </div>
          <div className="space-y-3">
            {planPagos.distribucion_metodo_pago.map((metodo, index) => {
              const colores = [
                { bg: "bg-brand-500", text: "text-brand-500 dark:text-brand-400" },
                { bg: "bg-success-500", text: "text-success-600 dark:text-success-500" },
                { bg: "bg-blue-light-500", text: "text-blue-light-500 dark:text-blue-light-500" },
                { bg: "bg-warning-500", text: "text-warning-600 dark:text-orange-400" },
              ];
              const color = colores[index % colores.length];
              const totalPagados = pagos?.cuotas_pagadas ?? 1;
              const porcentaje = totalPagados > 0 ? (metodo.cantidad / totalPagados) * 100 : 0;

              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${color.bg}`} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {metodo.metodo_pago}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-semibold ${color.text}`}>
                      {metodo.cantidad}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 w-12 text-right">
                      {porcentaje.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
