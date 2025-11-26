import ExcelJS from "exceljs";
import { Solicitud } from "../types/solicitud";

export async function exportSolicitudesToExcel(solicitudes: Solicitud[], filename?: string) {
  if (!solicitudes || solicitudes.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Solicitudes");

  sheet.columns = [
    { header: "ID", key: "id", width: 8 },
    { header: "Empleado", key: "empleado_nombre", width: 24 },
    { header: "Cliente", key: "cliente_nombre", width: 24 },
    { header: "Ingreso Mensual", key: "cliente_ingreso_mensual", width: 16 },
    { header: "Monto Solicitado", key: "monto_solicitado", width: 16 },
    { header: "Monto Aprobado", key: "monto_aprobado", width: 16 },
    { header: "Plazo (meses)", key: "plazo_meses", width: 12 },
    { header: "Propósito", key: "proposito", width: 36 },
    { header: "Fecha Solicitud", key: "fecha_solicitud", width: 14 },
    { header: "Fecha Aprobación", key: "fecha_aprobacion", width: 14 },
    { header: "Fecha Plazo", key: "fecha_plazo", width: 14 },
    { header: "Estado", key: "estado", width: 12 },
    { header: "Observaciones", key: "observaciones", width: 36 },
  ];

  solicitudes.forEach((s) => {
    sheet.addRow({
      id: s.id,
      empleado_nombre: s.empleado_nombre,
      cliente_nombre: s.cliente_nombre,
      cliente_ingreso_mensual: s.cliente_ingreso_mensual ?? "",
      monto_solicitado: s.monto_solicitado,
      monto_aprobado: s.monto_aprobado ?? "",
      plazo_meses: s.plazo_meses ?? "",
      proposito: s.proposito,
      fecha_solicitud: s.fecha_solicitud,
      fecha_aprobacion: s.fecha_aprobacion ?? "",
      fecha_plazo: s.fecha_plazo ?? "",
      estado: s.estado,
      observaciones: s.observaciones ?? "",
    });
  });

  // Formato encabezados
  sheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true } as any;
    cell.alignment = { horizontal: "center" } as any;
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'B8CCE4' }
    } as any;
  });

  // Proteger la hoja para que sea de solo lectura
  sheet.protect('', {
    selectLockedCells: true,
    selectUnlockedCells: true,
    formatCells: false,
    formatColumns: false,
    formatRows: false,
    insertColumns: false,
    insertRows: false,
    insertHyperlinks: false,
    deleteColumns: false,
    deleteRows: false,
    sort: false,
    autoFilter: false,
    pivotTables: false,
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const ahora = new Date();
  const timestamp = ahora.toISOString().replace(/[:.]/g, "-");
  a.download = filename ?? `solicitudes-reporte-${timestamp}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default exportSolicitudesToExcel;
