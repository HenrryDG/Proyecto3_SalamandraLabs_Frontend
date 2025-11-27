import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { useDashboardTendencias } from "../../hooks/dashboard/useDashboardTendencias";
import { useTheme } from "../../context/ThemeContext";

type Periodo = "7d" | "30d" | "90d" | "365d";

export default function TendenciasChart() {
  const [periodo, setPeriodo] = useState<Periodo>("7d");
  const { tendencias, loading } = useDashboardTendencias(periodo);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const periodos: { value: Periodo; label: string }[] = [
    { value: "7d", label: "7 días" },
    { value: "30d", label: "30 días" },
    { value: "90d", label: "90 días" },
    { value: "365d", label: "1 año" },
  ];

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-48 mb-4"></div>
        <div className="h-[300px] bg-gray-200 rounded dark:bg-gray-700"></div>
      </div>
    );
  }

  // Formatear los datos para el gráfico
  const categorias = tendencias?.tendencia_pagos.map((t) => t.periodo) ?? [];
  const datosPagos = tendencias?.tendencia_pagos.map((t) => t.monto_total ?? 0) ?? [];
  const datosPrestamos = tendencias?.tendencia_prestamos.map((t) => t.monto_total ?? 0) ?? [];

  const options: ApexOptions = {
    chart: {
      type: "area",
      fontFamily: "Outfit, sans-serif",
      height: 300,
      background: "transparent",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ["#10B981", "#3B82F6"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: categorias,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: isDark ? "#9CA3AF" : "#6B7280",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark ? "#9CA3AF" : "#6B7280",
          fontSize: "12px",
        },
        formatter: (val) => `Bs. ${val.toLocaleString()}`,
      },
    },
    grid: {
      borderColor: isDark ? "#374151" : "#E5E7EB",
      strokeDashArray: 4,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontFamily: "Outfit, sans-serif",
      labels: {
        colors: isDark ? "#9CA3AF" : "#374151",
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val) => `Bs. ${val.toLocaleString("es-BO", { minimumFractionDigits: 2 })}`,
      },
    },
  };

  const series = [
    {
      name: "Pagos Recibidos",
      data: datosPagos,
    },
    {
      name: "Préstamos Desembolsados",
      data: datosPrestamos,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Tendencias Financieras
        </h3>

        <div className="flex gap-2">
          {periodos.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriodo(p.value)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                periodo === p.value
                  ? "bg-sky-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-w-0">
        <Chart options={options} series={series} type="area" height={300} />
      </div>
    </div>
  );
}
