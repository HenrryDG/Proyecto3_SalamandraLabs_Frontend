import { createContext, useContext, ReactNode } from 'react';
import { useNotificaciones } from '../hooks/planPago/useNotificaciones';
import { NotificacionPlanPago } from '../types/planPago';

interface NotificacionesContextType {
    notificaciones: NotificacionPlanPago[];
    loading: boolean;
    error: string | null;
    hasNewNotifications: boolean;
    markAsRead: () => void;
    refetch: (isInitial?: boolean) => Promise<void>;
}

const NotificacionesContext = createContext<NotificacionesContextType | undefined>(undefined);

export const NotificacionesProvider = ({ children }: { children: ReactNode }) => {
    const notificacionesData = useNotificaciones();

    return (
        <NotificacionesContext.Provider value={notificacionesData}>
            {children}
        </NotificacionesContext.Provider>
    );
};

export const useNotificacionesContext = () => {
    const context = useContext(NotificacionesContext);
    if (!context) {
        throw new Error('useNotificacionesContext debe ser usado dentro de NotificacionesProvider');
    }
    return context;
};
