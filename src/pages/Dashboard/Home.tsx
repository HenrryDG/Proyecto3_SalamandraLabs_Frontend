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

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Error state */}
        {error && (
          <div className="col-span-12 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Columna izquierda: 4 métricas en grid 2x2 */}
        <div className="col-span-12 xl:col-span-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <DashboardMetrics resumen={resumen} loading={loading} />
          </div>
        </div>

        {/* Columna derecha: Estado de Cuotas */}
        <div className="col-span-12 xl:col-span-6">
          <CuotasResumen resumen={resumen} loading={loading} />
        </div>

        {/* Gráficos de solicitudes y préstamos */}
        <div className="col-span-12 xl:col-span-6">
          <SolicitudesChart resumen={resumen} loading={loading} />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <PrestamosChart resumen={resumen} loading={loading} />
        </div>

        {/* Gráfico de tendencias */}
        <div className="col-span-12">
          <TendenciasChart />
        </div>

        {/* Resumen financiero */}
        <div className="col-span-12">
          <ResumenFinanciero resumen={resumen} loading={loading} />
        </div>
      </div>
    </>
  );
}
