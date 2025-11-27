import PageMeta from "../../components/common/PageMeta";
import DashboardMetrics from "../../components/dashboard/DashboardMetrics";
import ResumenFinanciero from "../../components/dashboard/ResumenFinanciero";
import SolicitudesChart from "../../components/dashboard/SolicitudesChart";
import PrestamosChart from "../../components/dashboard/PrestamosChart";
import TendenciasChart from "../../components/dashboard/TendenciasChart";
import CuotasResumen from "../../components/dashboard/CuotasResumen";
import { useDashboardResumen } from "../../hooks/dashboard/useDashboardResumen";

export default function Home() {
  const { resumen, loading, error } = useDashboardResumen();

  return (
    <>
      <PageMeta title="Dashboard" description="Panel de control principal" />

      <div className="space-y-6">
        {/* Error state */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Métricas principales */}
        <DashboardMetrics resumen={resumen} loading={loading} />

        {/* Fila: Resumen financiero + Estado de cuotas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResumenFinanciero resumen={resumen} loading={loading} />
          <CuotasResumen resumen={resumen} loading={loading} />
        </div>

        {/* Fila: Gráficos de solicitudes y préstamos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SolicitudesChart resumen={resumen} loading={loading} />
          <PrestamosChart resumen={resumen} loading={loading} />
        </div>

        {/* Gráfico de tendencias */}
        <TendenciasChart />
      </div>
    </>
  );
}
