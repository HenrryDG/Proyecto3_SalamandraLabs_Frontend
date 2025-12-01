import { useState, useMemo } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
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

  const formatDate = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (hora: string) => {
    return hora.substring(0, 5); // HH:MM
  };

  const getActionBadgeColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'crear':
      case 'create':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'actualizar':
      case 'update':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'eliminar':
      case 'delete':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'login':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'logout':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
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
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Búsqueda */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar por usuario, acción o descripción..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  resetPagination();
                }}
                className="pl-10"
              />
            </div>

            {/* Filtro por acción */}
            <div className="relative">
              <select
                value={filterAction}
                onChange={(e) => {
                  setFilterAction(e.target.value);
                  resetPagination();
                }}
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Todas las acciones</option>
                {uniqueActions.map(action => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              Total: {auditorias.length}
            </span>
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              Filtrados: {filteredAuditorias.length}
            </span>
          </div>
        </div>

        {/* Tabla */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando auditorías...</span>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="text-red-500 mb-2">Error al cargar los datos</div>
              <div className="text-gray-500 text-sm">{error}</div>
            </div>
          ) : filteredAuditorias.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              {searchTerm || filterAction ? 'No se encontraron registros que coincidan con los filtros' : 'No hay registros de auditoría disponibles'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        Usuario
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Acción
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Tabla
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Descripción
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        Fecha & Hora
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      IP
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900/50 dark:divide-gray-700">
                  {currentAuditorias.map((auditoria) => (
                    <tr key={auditoria.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {auditoria.empleado_nombre}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {auditoria.username}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionBadgeColor(auditoria.accion)}`}>
                          {auditoria.accion}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {auditoria.tabla}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs">
                        <div className="truncate" title={auditoria.descripcion}>
                          {auditoria.descripcion}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>
                          <div>{formatDate(auditoria.fecha)}</div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {formatTime(auditoria.hora)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                        {auditoria.ip}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Paginación */}
        {filteredAuditorias.length > 0 && totalPages > 1 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Mostrando {startIndex + 1} - {Math.min(endIndex, filteredAuditorias.length)} de {filteredAuditorias.length} registros
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Botón Anterior */}
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Anterior
                </button>

                {/* Números de página */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentPage === page
                          ? 'bg-sky-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Botón Siguiente */}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}

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
