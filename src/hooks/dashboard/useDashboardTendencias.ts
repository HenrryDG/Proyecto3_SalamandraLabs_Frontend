import { useCallback, useEffect, useState } from "react";
import { getDashboardTendencias } from "../../services/dashboard/dashboardService";
import { DashboardTendencias } from "../../types/dashboard";

export const useDashboardTendencias = (periodo: "7d" | "30d" | "90d" | "365d" = "30d") => {
  const [tendencias, setTendencias] = useState<DashboardTendencias | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTendencias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardTendencias(periodo);
      setTendencias(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar las tendencias");
      setTendencias(null);
    } finally {
      setLoading(false);
    }
  }, [periodo]);

  useEffect(() => {
    fetchTendencias();
  }, [fetchTendencias]);

  return { tendencias, loading, error, refetch: fetchTendencias };
};
