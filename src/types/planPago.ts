export type PlanPagoEstado = 'Pendiente' | 'Pagada' | 'Vencida';
export type MetodoPago = 'QR' | 'Efectivo';

export interface PlanPago {
    id: number;
    prestamo: number;
    fecha_pago: string | null;
    fecha_vencimiento: string;
    metodo_pago: MetodoPago | null;
    monto_cuota: string;
    mora_cuota: string;
    estado: PlanPagoEstado;
    created_at: string;
    updated_at: string;
}

export interface PlanPagoActualizacion {
    metodo_pago?: MetodoPago;
    estado?: PlanPagoEstado;
}

export interface NotificacionPlanPago {
    id_plan_pago: number;
    id_prestamo: number;
    nombre_cliente: string;
    mensaje: string;
}

export interface NotificacionesResponse {
    notificaciones: NotificacionPlanPago[];
}
