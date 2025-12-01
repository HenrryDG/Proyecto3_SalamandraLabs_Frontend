import api from "../axios";
import { Auditoria } from "../../types/auditoria";

// * === SERVICIO PARA OBTENER TODAS LAS AUDITORÍAS === * //

export const getAuditorias = async (): Promise<Auditoria[]> => {
    const response = await api.get<Auditoria[]>("/auditorias/");
    return response.data;
}