import ExcelJS from "exceljs";
import { Prestamo } from "../types/prestamo";

export async function exportPrestamosToExcel(prestamos: Prestamo[], filename?: string) {
  if (!prestamos || prestamos.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Prestamos");

  sheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Cliente", key: "cliente_nombre", width: 30 },
    { header: "Monto Solicitado", key: "monto_solicitado", width: 18 },
    { header: "Monto Aprobado", key: "monto_aprobado", width: 18 },
    { header: "Monto Restante", key: "monto_restante", width: 18 },
    { header: "Interés", key: "interes", width: 12 },
    { header: "Plazo (meses)", key: "plazo_meses", width: 14 },
    { header: "Fecha Desembolso", key: "fecha_desembolso", width: 16 },
    { header: "Fecha Plazo", key: "fecha_plazo", width: 16 },
    { header: "Estado", key: "estado", width: 14 },
  ];

  prestamos.forEach((p) => {
    sheet.addRow({
      id: p.id,
      cliente_nombre: p.cliente_nombre,
      monto_solicitado: p.monto_solicitado,
      monto_aprobado: p.monto_aprobado,
      monto_restante: p.monto_restante,
      interes: p.interes,
      plazo_meses: p.plazo_meses,
      fecha_desembolso: p.fecha_desembolso,
      fecha_plazo: p.fecha_plazo,
      estado: p.estado,
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

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const ahora = new Date();
  const timestamp = ahora.toISOString().replace(/[:.]/g, "-");
  a.download = filename ?? `prestamos-reporte-${timestamp}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default exportPrestamosToExcel;
