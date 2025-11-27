import { useCallback, useEffect, useState } from "react";
import { getDashboardResumen } from "../../services/dashboard/dashboardService";
import { DashboardResumen } from "../../types/dashboard";

export const useDashboardResumen = () => {
  const [resumen, setResumen] = useState<DashboardResumen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResumen = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardResumen();
      setResumen(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar el resumen del dashboard");
      setResumen(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumen();
  }, [fetchResumen]);

  return { resumen, loading, error, refetch: fetchResumen };
};
