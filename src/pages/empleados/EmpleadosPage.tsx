import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useModal } from "../../hooks/useModal";
import CreateEmpleadoModal from "../../components/modals/empleado/CreateEmpleadoModal";
import EditEmpleadoModal from "../../components/modals/empleado/EditEmpleadoModal";
import { useEmpleados } from "../../hooks/empleado/useEmpleados";
import EmpleadoFilter from "../../components/filters/empleado/EmpleadoFilter";
import EmpleadoTable from "../../components/tables/empleado/EmpleadoTable";
import { Pagination } from "../../components/tables/Pagination";
import { Empleado } from "../../types/empleado";
import Button from "../../components/ui/button/Button";
import { FaPlus } from "react-icons/fa";
import exportEmpleadosToExcel from "../../utils/exportEmpleados";

export default function EmpleadosPage() {
  const { isOpen, openModal, closeModal } = useModal();
  const { empleados, loading, error, refetch } = useEmpleados();

  //Edición
  const [empleadoEdit, setEmpleadoEdit] = useState<Empleado | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = (empleado: Empleado) => {
    setEmpleadoEdit(empleado);
    setIsEditOpen(true);
  };

  // ---------- Filtro de texto y estado ----------
  const [filtro, setFiltro] = useState("");
  const [estado, setEstado] = useState("true");

  // ------------- Paginación ------------
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 6;

  // -------------- Filtrado -------------
  const empleadosFiltrados = (empleados ?? []).filter((empleado) =>
    `${empleado.user} ${empleado.nombre} ${empleado.apellido_paterno} ${empleado.apellido_materno} ${empleado.correo} ${empleado.telefono} ${empleado.rol}`
      .toLowerCase()
      .includes(filtro.toLowerCase())
  )
    .filter((empleado) =>
      estado === "true" ? empleado.activo : estado === "false" ? !empleado.activo : true
    );

  // ------------- Paginación -----------
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const empleadosPaginados = empleadosFiltrados.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(empleadosFiltrados.length / elementosPorPagina);

  // Reiniciar a la primera página al cambiar el filtro
  useEffect(() => {
    setPaginaActual(1);
  }, [filtro, estado]);

  // Estado para descarga
  const [isDownloading, setIsDownloading] = useState(false);
  // Alcance de la exportación: 'page' | 'filtrados' | 'todos'
  const [exportScope, setExportScope] = useState<"page" | "filtrados" | "todos">("filtrados");

  // Llamar al util para exportar según alcance seleccionado
  const handleDownloadReport = async () => {
    const dataToExport = exportScope === "page"
      ? empleadosPaginados
      : exportScope === "filtrados"
        ? empleadosFiltrados
        : empleados ?? [];

    if (!dataToExport || dataToExport.length === 0) return;

    try {
      setIsDownloading(true);
      await exportEmpleadosToExcel(dataToExport);
    } catch (err) {
      console.error("Error generando reporte empleados:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Cambios de página
  const onPrev = () => setPaginaActual((p) => Math.max(p - 1, 1));
  const onNext = () => setPaginaActual((p) => Math.min(p + 1, totalPaginas));

  return (
    <div>
      <PageMeta
        title="Empleados"
        description="Página de gestión de empleados"
      />
      <PageBreadcrumb pageTitle="Empleados" />
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 space-y-10">
        <EmpleadoFilter
          filtro={filtro}
          setFiltro={setFiltro}
          estado={estado}
          setEstado={setEstado}
          child={
            <div className="flex items-center gap-3">
              <select
                value={exportScope}
                onChange={(e) => setExportScope(e.target.value as any)}
                className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                title="Alcance del reporte"
              >
                <option value="page">Página</option>
                <option value="filtrados">Filtrados</option>
                <option value="todos">Todos</option>
              </select>

              <Button
                size="md"
                variant="outline"
                onClick={handleDownloadReport}
                disabled={isDownloading}
              >
                {isDownloading ? "Generando..." : "Descargar Reporte"}
              </Button>

              <Button
                size="md"
                variant="primary"
                onClick={openModal}
              >
                <FaPlus className="size-3" />
                Nuevo Empleado
              </Button>
            </div>
          }
        />
        {/* === Tabla / estados === */}
        <div className="max-w-full space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Cargando empleados...
              </p>
            </div>
          ) : error ? (
            <p className="text-center text-red-500 dark:text-red-400">
              Error al cargar empleados.
            </p>
          ) : empleadosFiltrados.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No hay empleados que coincidan con el filtro.
            </p>
          ) : (
            <>
              <EmpleadoTable empleados={empleadosPaginados} onEdit={handleEdit} />
              <Pagination
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onPrev={onPrev}
                onNext={onNext}
              />
            </>
          )}
        </div>
      </div>

      {/* === Modal de creación de empleado === */}
      <CreateEmpleadoModal
        isOpen={isOpen}
        onClose={closeModal}
        onCreated={refetch}
      />

      {/* === Modal de edición === */}
      <EditEmpleadoModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        empleado={empleadoEdit}
        onUpdated={refetch}
      />
    </div>
  );
}
