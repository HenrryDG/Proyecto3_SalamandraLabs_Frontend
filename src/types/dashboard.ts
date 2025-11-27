// Tipos para el Dashboard

export interface DashboardResumen {
  clientes: {
    total: number;
    activos: number;
    inactivos: number;
  };
  empleados: {
    total: number;
    activos: number;
    inactivos: number;
  };
  solicitudes: {
    total: number;
    pendientes: number;
    aprobadas: number;
    rechazadas: number;
    tasa_aprobacion: number;
  };
  prestamos: {
    total: number;
    en_curso: number;
    en_mora: number;
    completados: number;
    monto_desembolsado: number;
    monto_restante: number;
    tasa_mora: number;
  };
  pagos: {
    total_cuotas: number;
    cuotas_pagadas: number;
    cuotas_pendientes: number;
    cuotas_vencidas: number;
    total_recaudado: number;
    mora_acumulada: number;
    tasa_cumplimiento: number;
  };
}

export interface TendenciaPeriodo {
  periodo: string;
  cantidad: number;
  monto_total?: number;
}

export interface TendenciaSolicitudes {
  periodo: string;
  total: number;
  aprobadas: number;
  rechazadas: number;
  pendientes: number;
}

export interface DashboardTendencias {
  periodo_seleccionado: string;
  fecha_inicio: string;
  tendencia_clientes: TendenciaPeriodo[];
  tendencia_solicitudes: TendenciaSolicitudes[];
  tendencia_prestamos: TendenciaPeriodo[];
  tendencia_pagos: TendenciaPeriodo[];
}

export interface DistribucionEstado {
  estado: string;
  cantidad: number;
  monto_total?: number;
}

export interface PrestamosEstadisticas {
  total: number;
  interes_promedio: number;
  monto_promedio: number;
  distribucion_estado: DistribucionEstado[];
  distribucion_plazo: { plazo_meses: number; cantidad: number }[];
  resumen_financiero: {
    total_desembolsado: number;
    total_por_cobrar: number;
    total_cobrado: number;
  };
}

export interface PlanPagosEstadisticas {
  total_cuotas: number;
  distribucion_estado: DistribucionEstado[];
  distribucion_metodo_pago: { metodo_pago: string; cantidad: number; monto_total: number }[];
  cuotas_por_vencer_30_dias: { cantidad: number; monto_total: number };
  cuotas_vencidas: { cantidad: number; monto_total: number; mora_total: number };
  resumen_recaudacion: {
    total_recaudado: number;
    mora_recaudada: number;
    pendiente_por_cobrar: number;
  };
}
