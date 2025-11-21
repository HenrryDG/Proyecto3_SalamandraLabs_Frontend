import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import PrestamoFilter from "../../components/filters/prestamo/PrestamoFilter";
import PrestamoTable from "../../components/tables/prestamo/PrestamoTable";
import { Pagination } from "../../components/tables/Pagination";
import { usePrestamos } from "../../hooks/prestamo/usePrestamos";
import exportPrestamosToExcel from "../../utils/exportPrestamos";
import Button from "../../components/ui/button/Button";
import { FaFileExcel } from "react-icons/fa";
import PlanPagosModal from "../../components/modals/planPago/PlanPagosModal";


export default function SolicitudesPage() {
  const { prestamos, loading, error, refetch } = usePrestamos();
  const [searchParams, setSearchParams] = useSearchParams();



  const [filtro, setFiltro] = useState("");
  const [estado, setEstado] = useState("Todos");
  const [rangoFechas, setRangoFechas] = useState<[Date | null, Date | null]>([null, null]);

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 6;

  // Control del modal desde URL
  const prestamoIdParam = searchParams.get('prestamoId');
  const clienteNombreParam = searchParams.get('clienteNombre');
  const isPlanPagosModalOpen = prestamoIdParam !== null;

  const handleOpenPlanPagos = (prestamoId: number, clienteNombre: string) => {
    setSearchParams({ prestamoId: prestamoId.toString(), clienteNombre });
  };

  const handleClosePlanPagos = () => {
    setSearchParams({});
    refetch();
  };

  // Filtrar solicitudes por texto y estado
  const prestamosFiltrados = (prestamos ?? []).filter((prestamo) =>
    `${prestamo.cliente_nombre} ${prestamo.monto_solicitado} ${prestamo.monto_aprobado} ${prestamo.monto_restante} ${prestamo.plazo_meses ?? ""}`
      .toLowerCase()
      .includes(filtro.toLowerCase())
  )
    .filter((prestamo) =>
      (estado === "Todos" ? true : prestamo.estado === estado)
    )
    .filter((prestamo) => {
      if (!rangoFechas[0] || !rangoFechas[1]) return true;

      function formatDateISO(date: Date | string): string {
        const d = new Date(date);
        return d.toISOString().slice(0, 10);
      }

      const fechaPrestamo = formatDateISO(prestamo.fecha_plazo);
      const fechaInicio = formatDateISO(rangoFechas[0]!);
      const fechaFin = formatDateISO(rangoFechas[1]!);

      return fechaPrestamo >= fechaInicio && fechaPrestamo <= fechaFin;
    });

  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const prestamosPaginados = prestamosFiltrados.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.max(1, Math.ceil(prestamosFiltrados.length / elementosPorPagina));

  useEffect(() => {
    setPaginaActual(1);
  }, [filtro, estado]);

  // Estado para descarga
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadReport = async () => {
    // Usar siempre los datos filtrados
    const dataToExport = prestamosFiltrados;

    if (!dataToExport || dataToExport.length === 0) return;

    try {
      setIsDownloading(true);
      await exportPrestamosToExcel(dataToExport);
    } catch (err) {
      console.error("Error generando reporte prestamos:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const onPrev = () => setPaginaActual((p) => Math.max(p - 1, 1));
  const onNext = () => setPaginaActual((p) => Math.min(p + 1, totalPaginas));

  return (
    <div>
      <PageMeta title="Prestamos" description="Página de gestión de préstamos" />
      <PageBreadcrumb pageTitle="Prestamos" />

      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 space-y-10">

        {/* === Filtros === */}
        <PrestamoFilter
          filtro={filtro}
          setFiltro={setFiltro}
          rango={rangoFechas}
          setRango={setRangoFechas}
          estado={estado}
          setEstado={setEstado}
          child={
            <Button
              size="md"
              variant="outline"
              onClick={handleDownloadReport}
              disabled={isDownloading}
              title="Descargar reporte Excel"
            >
                <FaFileExcel className="size-5 text-green-550" />
            </Button>
          }
        />

        <div className="max-w-full space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-center text-gray-500 dark:text-gray-400">Cargando préstamos...</p>
            </div>
          ) : error ? (
            <p className="text-center text-red-500 dark:text-red-400">Error al cargar préstamos.</p>
          ) : prestamosFiltrados.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No hay préstamos que coincidan con el filtro.</p>
          ) : (
            <>
              <PrestamoTable 
                prestamos={prestamosPaginados} 
                onOpenPlanPagos={handleOpenPlanPagos}
              />
              <Pagination paginaActual={paginaActual} totalPaginas={totalPaginas} onPrev={onPrev} onNext={onNext} />
            </>
          )}
        </div>
      </div>

      {/* Modal de Plan de Pagos */}
      <PlanPagosModal
        isOpen={isPlanPagosModalOpen}
        onClose={handleClosePlanPagos}
        prestamoId={prestamoIdParam ? parseInt(prestamoIdParam) : null}
        clienteNombre={clienteNombreParam || ""}
        onPagoExitoso={refetch}
      />
    </div>
  );
}
