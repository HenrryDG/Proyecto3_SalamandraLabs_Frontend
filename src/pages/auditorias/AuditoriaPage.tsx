import { useState, useMemo } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Pagination from "../../components/common/Pagination";
import AuditoriaTable from "../../components/tables/auditoria/AuditoriaTable";
import AuditoriaFilters from "../../components/filters/AuditoriaFilters";
import { useAuditorias } from "../../hooks/auditoria/useAuditoria";

export default function AuditoriaPage() {
  const { auditorias, loading, error } = useAuditorias();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Obtener acciones únicas para el filtro
  const uniqueActions = useMemo(() => {
    const actions = [...new Set(auditorias.map(audit => audit.accion))];
    return actions.sort();
  }, [auditorias]);

  // Filtrar auditorías
  const filteredAuditorias = useMemo(() => {
    return auditorias.filter(audit => {
      const matchesSearch = searchTerm === "" || 
        audit.empleado_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audit.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audit.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audit.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audit.tabla.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAction = filterAction === "" || audit.accion === filterAction;

      return matchesSearch && matchesAction;
    });
  }, [auditorias, searchTerm, filterAction]);

  // Cálculos de paginación
  const totalPages = Math.ceil(filteredAuditorias.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAuditorias = filteredAuditorias.slice(startIndex, endIndex);

  // Reiniciar página cuando cambien los filtros
  const resetPagination = () => setCurrentPage(1);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetPagination();
  };

  const handleFilterChange = (value: string) => {
    setFilterAction(value);
    resetPagination();
  };

  return (
    <div>
      <PageMeta
        title="Auditorias"
        description="Gestión y seguimiento de auditorías del sistema"
      />
      <PageBreadcrumb pageTitle="Auditorias" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
            Registro de Auditorías
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Monitoreo completo de todas las actividades realizadas en el sistema
          </p>
        </div>

        {/* Filtros */}
        <AuditoriaFilters
          searchTerm={searchTerm}
          filterAction={filterAction}
          uniqueActions={uniqueActions}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          totalRecords={auditorias.length}
          filteredRecords={filteredAuditorias.length}
        />

        {/* Tabla */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <AuditoriaTable
            auditorias={currentAuditorias}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            filterAction={filterAction}
          />
        </div>

        {/* Paginación */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredAuditorias.length}
          onPageChange={setCurrentPage}
        />

        {/* Footer con información */}
        {filteredAuditorias.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                Total de registros: {auditorias.length} | Filtrados: {filteredAuditorias.length}
              </span>
              <span>
                Última actualización: {new Date().toLocaleString('es-BO')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
