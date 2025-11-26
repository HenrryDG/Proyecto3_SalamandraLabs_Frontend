import { useEffect, useState } from "react";
import { getSolicitudes } from "../../services/solicitud/solicitudService";
import { getPrestamos } from "../../services/prestamo/prestamoService";

/**
 * Hook que verifica si un cliente puede ser deshabilitado.
 * Un cliente NO puede ser deshabilitado si:
 * - Tiene solicitudes en estado "Pendiente"
 * - Tiene préstamos en estado "En Curso" o "Mora"
 */
export const useCanDisableCliente = (clienteId: number | null) => {
  const [canDisable, setCanDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState<string | null>(null);

  useEffect(() => {
    if (!clienteId) {
      setCanDisable(true);
      setReason(null);
      return;
    }

    const checkCanDisable = async () => {
      setLoading(true);
      try {
        // Obtener solicitudes y préstamos
        const [solicitudes, prestamos] = await Promise.all([
          getSolicitudes(),
          getPrestamos(),
        ]);

        // Filtrar solicitudes del cliente con estado "Pendiente"
        const solicitudesPendientes = solicitudes.filter(
          (s) => s.cliente === clienteId && s.estado === "Pendiente"
        );

        if (solicitudesPendientes.length > 0) {
          setCanDisable(false);
          setReason("El cliente tiene solicitudes pendientes");
          setLoading(false);
          return;
        }

        // Obtener IDs de solicitudes del cliente
        const solicitudesClienteIds = solicitudes
          .filter((s) => s.cliente === clienteId)
          .map((s) => s.id);

        // Filtrar préstamos del cliente con estado "En Curso" o "Mora"
        const prestamosActivos = prestamos.filter(
          (p) =>
            solicitudesClienteIds.includes(p.solicitud) &&
            (p.estado === "En Curso" || p.estado === "Mora")
        );

        if (prestamosActivos.length > 0) {
          setCanDisable(false);
          setReason("El cliente tiene préstamos en curso");
          setLoading(false);
          return;
        }

        // Si llegamos aquí, el cliente puede ser deshabilitado
        setCanDisable(true);
        setReason(null);
      } catch (error) {
        // En caso de error, permitimos la acción (fail-open)
        // pero podrías cambiarlo a fail-closed si prefieres
        console.error("Error al verificar si el cliente puede ser deshabilitado:", error);
        setCanDisable(true);
        setReason(null);
      } finally {
        setLoading(false);
      }
    };

    checkCanDisable();
  }, [clienteId]);

  return { canDisable, loading, reason };
};
