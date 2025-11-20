import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ClienteTable from "../../components/tables/cliente/ClienteTable";
import { Pagination } from "../../components/tables/Pagination";
import { useClientes } from "../../hooks/cliente/useClientes";
import ClienteFilter from "../../components/filters/cliente/ClienteFilter";
import Button from "../../components/ui/button/Button";
import exportClientesToExcel from "../../utils/exportClientes";
import { FileIcon } from "../../icons";
import { FaPlus } from "react-icons/fa";
import CreateClienteModal from "../../components/modals/cliente/CreateClienteModal";
import { useModal } from "../../hooks/useModal";
import { Cliente } from "../../types/cliente";
import EditClienteModal from "../../components/modals/cliente/EditClienteModal";


export default function ClientesPage() {
  const { isOpen, openModal, closeModal } = useModal();
  const { clientes, loading, error, refetch } = useClientes();

  // Estado para edición
  const [clienteEdit, setClienteEdit] = useState<Cliente | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = (cliente: Cliente) => {
    setClienteEdit(cliente);
    setIsEditOpen(true);
  };

  // ---------- Filtro de texto y estado ----------
  const [filtro, setFiltro] = useState("");
  const [estado, setEstado] = useState("true");

  // ------------- Paginación ------------
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 6;

  // -------------- Filtrado -------------
  const clientesFiltrados = (clientes ?? []).filter((cliente) =>
    `${cliente.nombre} ${cliente.apellido_paterno} ${cliente.apellido_materno} ${cliente.carnet} ${cliente.direccion} ${cliente.telefono} ${cliente.correo}`
      .toLowerCase()
      .includes(filtro.toLowerCase())
  )
    .filter((cliente) =>
      estado === "true" ? cliente.activo : estado === "false" ? !cliente.activo : true
    );

  // ------------- Paginación -----------
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const clientesPaginados = clientesFiltrados.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(clientesFiltrados.length / elementosPorPagina);

  // Reiniciar a la primera página al cambiar el filtro
  useEffect(() => {
    setPaginaActual(1);
  }, [filtro, estado]);

  // Estado para descarga
  const [isDownloading, setIsDownloading] = useState(false);
  // Alcance de la exportación: 'page' | 'filtrados' | 'todos'
  const [exportScope, setExportScope] = useState<"page" | "filtrados" | "todos">("filtrados");

  // Llamar al util para generar y descargar el reporte con los clientes filtrados
  const handleDownloadReport = async () => {
    // Determinar datos según el alcance seleccionado
    const dataToExport = exportScope === "page"
      ? clientesPaginados
      : exportScope === "filtrados"
        ? clientesFiltrados
        : clientes ?? [];

    if (!dataToExport || dataToExport.length === 0) return;

    try {
      setIsDownloading(true);
      await exportClientesToExcel(dataToExport);
    } catch (err) {
      console.error("Error generando reporte Excel:", err);
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
        title="Clientes"
        description="Página de gestión de clientes"
      />
      <PageBreadcrumb pageTitle="Clientes" />

      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 space-y-10">
        {/* === Filtros === */}
        <ClienteFilter
          filtro={filtro}
          setFiltro={setFiltro}
          estado={estado}
          setEstado={setEstado}
          child={
            <>
              <div className="flex items-center gap-3 ml-3">
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
                  startIcon={<FileIcon />}
                  onClick={handleDownloadReport}
                  disabled={isDownloading}
                >
                  {isDownloading ? "Generando..." : "Descargar Reporte"}
                </Button>
              </div>
              <Button
          size="md"
          variant="primary"
          onClick={openModal}
              >
          <FaPlus className="size-3" />
          Nuevo Cliente
              </Button>
            </>
          }
        />

        {/* === Tabla / estados === */}
        <div className="max-w-full space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Cargando clientes...
              </p>
            </div>
          ) : error ? (
            <p className="text-center text-red-500 dark:text-red-400">
              Error al cargar clientes.
            </p>
          ) : clientesFiltrados.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No hay clientes que coincidan con el filtro.
            </p>
          ) : (
            <>
              <ClienteTable clientes={clientesPaginados} onEdit={handleEdit} />
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

      {/* === Modal de creación de cliente === */}
      <CreateClienteModal
        isOpen={isOpen}
        onClose={closeModal}
        onCreated={refetch}
      />

      {/* === Modal de edición === */}
      <EditClienteModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        cliente={clienteEdit}
        onUpdated={refetch}
      />
    </div>
  );
}
