import api from "../axios";
import {
  DashboardResumen,
  DashboardTendencias,
  PrestamosEstadisticas,
  PlanPagosEstadisticas,
} from "../../types/dashboard";

// * === SERVICIO PARA OBTENER RESUMEN GENERAL DEL DASHBOARD === * //
export const getDashboardResumen = async (): Promise<DashboardResumen> => {
  const response = await api.get<DashboardResumen>("/dashboard/resumen/");
  return response.data;
};

// * === SERVICIO PARA OBTENER TENDENCIAS === * //
export const getDashboardTendencias = async (
  periodo: "7d" | "30d" | "90d" | "365d" = "30d"
): Promise<DashboardTendencias> => {
  const response = await api.get<DashboardTendencias>("/dashboard/tendencias/", {
    params: { periodo },
  });
  return response.data;
};

// * === SERVICIO PARA OBTENER ESTADÍSTICAS DE PRÉSTAMOS === * //
export const getPrestamosEstadisticas = async (): Promise<PrestamosEstadisticas> => {
  const response = await api.get<PrestamosEstadisticas>("/dashboard/prestamos/");
  return response.data;
};

// * === SERVICIO PARA OBTENER ESTADÍSTICAS DE PLAN DE PAGOS === * //
export const getPlanPagosEstadisticas = async (): Promise<PlanPagosEstadisticas> => {
  const response = await api.get<PlanPagosEstadisticas>("/dashboard/plan-pagos/");
  return response.data;
};
