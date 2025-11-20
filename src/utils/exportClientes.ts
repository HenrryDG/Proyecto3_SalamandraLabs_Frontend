import ExcelJS from "exceljs";
import { Cliente } from "../types/cliente";

export async function exportClientesToExcel(clientes: Cliente[], filename?: string) {
  if (!clientes || clientes.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Clientes");
  sheet.columns = [
    { header: "ID", key: "id", width: 10, style: { alignment: { horizontal: 'center' } }  },
    { header: "Nombre", key: "nombre", width: 25 },
    { header: "Apellido Paterno", key: "apellido_paterno", width: 20 },
    { header: "Apellido Materno", key: "apellido_materno", width: 20 },
    { header: "Carnet", key: "carnet", width: 18 },
    { header: "Dirección", key: "direccion", width: 60, style: { alignment: { horizontal: 'left' } } },
    { header: "Teléfono", key: "telefono", width: 18 },
    { header: "Correo", key: "correo", width: 28 },
    { header: "Activo", key: "activo", width: 10 },
  ];

  clientes.forEach((c) => {
    sheet.addRow({
      id: c.id,
      nombre: c.nombre,
      apellido_paterno: c.apellido_paterno,
      apellido_materno: c.apellido_materno,
      carnet: c.carnet,
      direccion: c.direccion,
      telefono: c.telefono,
      correo: c.correo,
      activo: c.activo ? "Sí" : "No",
    });
  });

  // Formato simple para encabezados
  sheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true } as any;
    cell.alignment = { horizontal: "center" } as any;
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'B8CCE4' }
    };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const ahora = new Date();
  const timestamp = ahora.toISOString().replace(/[:.]/g, "-");
  a.download = filename ?? `clientes-reporte-${timestamp}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default exportClientesToExcel;
