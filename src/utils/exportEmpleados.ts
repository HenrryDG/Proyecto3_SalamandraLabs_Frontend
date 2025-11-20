import ExcelJS from "exceljs";
import { Empleado } from "../types/empleado";

export async function exportEmpleadosToExcel(empleados: Empleado[], filename?: string) {
  if (!empleados || empleados.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Empleados");

  sheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Usuario", key: "user", width: 20 },
    { header: "Nombre", key: "nombre", width: 20 },
    { header: "Apellido Paterno", key: "apellido_paterno", width: 20 },
    { header: "Apellido Materno", key: "apellido_materno", width: 20 },
    { header: "Correo", key: "correo", width: 28 },
    { header: "Teléfono", key: "telefono", width: 18 },
    { header: "Rol", key: "rol", width: 16 },
    { header: "Activo", key: "activo", width: 10 },
  ];

  empleados.forEach((e) => {
    sheet.addRow({
      id: e.id,
      user: e.user,
      nombre: e.nombre,
      apellido_paterno: e.apellido_paterno,
      apellido_materno: e.apellido_materno,
      correo: e.correo,
      telefono: e.telefono,
      rol: e.rol,
      activo: e.activo ? "Sí" : "No",
    });
  });

  // Negrita en encabezados
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
  a.download = filename ?? `empleados-reporte-${timestamp}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default exportEmpleadosToExcel;
