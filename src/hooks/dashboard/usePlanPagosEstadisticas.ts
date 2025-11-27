import { useState, useEffect } from "react";
import { PlanPagosEstadisticas } from "../../types/dashboard";
import { getPlanPagosEstadisticas } from "../../services/dashboard/dashboardService";

export function usePlanPagosEstadisticas() {
  const [estadisticas, setEstadisticas] = useState<PlanPagosEstadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPlanPagosEstadisticas();
        setEstadisticas(data);
        setError(null);
      } catch (err) {
        console.error("Error al obtener estadísticas de plan de pagos:", err);
        setError("Error al cargar estadísticas de pagos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { estadisticas, loading, error };
}
