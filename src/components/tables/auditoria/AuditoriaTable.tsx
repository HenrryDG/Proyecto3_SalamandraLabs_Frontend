import { Auditoria } from "../../../types/auditoria";

interface AuditoriaTableProps {
  auditorias: Auditoria[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filterAction: string;
}

export default function AuditoriaTable({ auditorias, loading, error, searchTerm, filterAction }: AuditoriaTableProps) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando auditorías...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center">
        <div className="text-red-500 mb-2">Error al cargar los datos</div>
        <div className="text-gray-500 text-sm">{error}</div>
      </div>
    );
  }

  if (auditorias.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500 dark:text-gray-400">
        {searchTerm || filterAction ? 'No se encontraron registros que coincidan con los filtros' : 'No hay registros de auditoría disponibles'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              <div className="flex items-center gap-2">Usuario</div>
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
              <div className="flex items-center gap-2">Fecha & Hora</div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              IP
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900/50 dark:divide-gray-700">
          {auditorias.map((auditoria) => (
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
  );
}