import { useEffect, useState, useCallback } from "react";
import { getAuditorias } from "../../services/auditoria/auditoriaService";
import { Auditoria } from "../../types/auditoria";


export const useAuditorias = () => {
    const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAuditorias = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAuditorias();
            setAuditorias(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al cargar las auditorias");
            setAuditorias([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAuditorias();
    }, [fetchAuditorias]);

    return { auditorias, loading, error, refetch: fetchAuditorias };
}
