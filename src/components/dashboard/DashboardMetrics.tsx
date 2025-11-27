import { GroupIcon } from "../../icons";
import { FaMoneyBillWave, FaUserTie, FaClipboardList } from "react-icons/fa";
import { DashboardResumen } from "../../types/dashboard";
import Badge from "../ui/badge/Badge";

interface Props {
  resumen: DashboardResumen | null;
  loading: boolean;
}

export default function DashboardMetrics({ resumen, loading }: Props) {
  if (loading) {
    return (
      <>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700"></div>
            <div className="mt-5 space-y-2">
              <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-20"></div>
              <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-24"></div>
            </div>
          </div>
        ))}
      </>
    );
  }

  const metrics = [
    {
      title: "Clientes Activos",
      value: resumen?.clientes.activos ?? 0,
      badgeValue: `${resumen?.clientes.total ?? 0} total`,
      icon: <GroupIcon className="text-brand-500 size-6" />,
      bgColor: "bg-brand-50 dark:bg-brand-500/15",
      badgeColor: "primary" as const,
    },
    {
      title: "Empleados Activos",
      value: resumen?.empleados.activos ?? 0,
      badgeValue: `${resumen?.empleados.total ?? 0} total`,
      icon: <FaUserTie className="text-blue-light-500 size-6" />,
      bgColor: "bg-blue-light-50 dark:bg-blue-light-500/15",
      badgeColor: "info" as const,
    },
    {
      title: "Préstamos en Curso",
      value: resumen?.prestamos.en_curso ?? 0,
      badgeValue: `${resumen?.prestamos.en_mora ?? 0} en mora`,
      icon: <FaMoneyBillWave className="text-success-500 size-6" />,
      bgColor: "bg-success-50 dark:bg-success-500/15",
      badgeColor: (resumen?.prestamos.en_mora ?? 0) > 0 ? "error" as const : "success" as const,
    },
    {
      title: "Solicitudes Pendientes",
      value: resumen?.solicitudes.pendientes ?? 0,
      badgeValue: `${resumen?.solicitudes.total ?? 0} total`,
      icon: <FaClipboardList className="text-warning-500 size-6" />,
      bgColor: "bg-warning-50 dark:bg-warning-500/15",
      badgeColor: "warning" as const,
    },
  ];

  return (
    <>
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
        >
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-xl ${metric.bgColor}`}
          >
            {metric.icon}
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {metric.title}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metric.value.toLocaleString()}
              </h4>
            </div>
            <Badge color={metric.badgeColor}>
              {metric.badgeValue}
            </Badge>
          </div>
        </div>
      ))}
    </>
  );
}
