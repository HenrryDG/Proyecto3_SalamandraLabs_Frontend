export interface Auditoria {
    id: number;
    usuario: number;
    username: string;
    empleado_nombre: string;
    accion: string;
    tabla: string;
    descripcion: string;
    ip: string;
    fecha: string;
    hora: string;
}