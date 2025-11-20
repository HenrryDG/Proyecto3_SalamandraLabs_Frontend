import { useState, useEffect, useCallback } from 'react';
import { planPagoService } from '../../services/planPago/planPagoService';
import { NotificacionPlanPago } from '../../types/planPago';

export const useNotificaciones = () => {
    const [notificaciones, setNotificaciones] = useState<NotificacionPlanPago[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasNewNotifications, setHasNewNotifications] = useState(false);

    const fetchNotificaciones = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await planPagoService.obtenerNotificaciones();
            
            // Verificar si hay nuevas notificaciones
            if (response.notificaciones.length > notificaciones.length) {
                setHasNewNotifications(true);
            }
            
            setNotificaciones(response.notificaciones);
        } catch (err) {
            console.error('Error al obtener notificaciones:', err);
            setError('Error al cargar las notificaciones');
        } finally {
            setLoading(false);
        }
    }, [notificaciones.length]);

    const markAsRead = useCallback(() => {
        setHasNewNotifications(false);
    }, []);

    // Cargar notificaciones al montar el componente
    useEffect(() => {
        fetchNotificaciones();
    }, []);

    // Actualizar notificaciones cada 5 minutos
    useEffect(() => {
        const interval = setInterval(() => {
            fetchNotificaciones();
        }, 5 * 60 * 1000); // 5 minutos

        return () => clearInterval(interval);
    }, [fetchNotificaciones]);

    return {
        notificaciones,
        loading,
        error,
        hasNewNotifications,
        markAsRead,
        refetch: fetchNotificaciones,
    };
};
