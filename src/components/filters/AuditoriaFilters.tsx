import Input from "../form/input/InputField";

interface AuditoriaFiltersProps {
  searchTerm: string;
  filterAction: string;
  uniqueActions: string[];
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  totalRecords: number;
  filteredRecords: number;
}

export default function AuditoriaFilters({
  searchTerm,
  filterAction,
  uniqueActions,
  onSearchChange,
  onFilterChange,
  totalRecords,
  filteredRecords
}: AuditoriaFiltersProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Búsqueda */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar por usuario, acción o descripción..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtro por acción */}
        <div className="relative">
          <select
            value={filterAction}
            onChange={(e) => onFilterChange(e.target.value)}
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
          Total: {totalRecords}
        </span>
        <span className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          Filtrados: {filteredRecords}
        </span>
      </div>
    </div>
  );
}