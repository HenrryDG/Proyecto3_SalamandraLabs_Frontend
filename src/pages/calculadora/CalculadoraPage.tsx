import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Input from "../../components/form/input/InputField";
import PageMeta from "../../components/common/PageMeta";
import {
    ResultadoCalculo,
    calcularMontoMaximo,
    generarPDF,
} from "../../components/utils/calculadoraUtils";
import Button from "../../components/ui/button/Button";

export default function CalculadoraPage() {
    const [cliente, setCliente] = useState("");
    const [ingreso, setIngreso] = useState("");
    const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);

    // Evita ingresar números y caracteres especiales en el nombre del cliente
    const handleClienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const filtered = raw.replace(/[^^\p{L}\s'-]/gu, "");
        setCliente(filtered);
    };

    // Evita ingresos <= 0
    const handleIngresoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Evita signos negativos
        if (value.startsWith("-")) return;

        // Evita ceros al inicio
        if (value === "0" || value === "0.") return;

        setIngreso(value);
    };

    const handleCalcular = () => {
        const ingresoNum = parseFloat(ingreso);
        if (!ingresoNum || ingresoNum <= 0 || !cliente.trim()) {
            setResultado(null);
            return;
        }
        setResultado(calcularMontoMaximo(ingresoNum, cliente));
    };

    const formatMoney = (value: number) =>
        value.toLocaleString("es-BO", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const handleGenerarPDF = () => {
        if (!resultado) return;
        generarPDF(resultado, parseFloat(ingreso));
    };

    // 🔥 Botón deshabilitado si no se cumplen los requisitos
    const botonDeshabilitado =
        !cliente.trim() ||
        !ingreso ||
        parseFloat(ingreso) <= 0;

    return (
        <div>
            <PageMeta title="Calculadora" description="Calculadora de préstamos" />
            <PageBreadcrumb pageTitle="Calculadora" />

            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 space-y-10">
                <div className="mx-auto w-full max-w-[600px] text-center">
                    <h3 className="mb-5 font-bold text-gray-800 text-2xl dark:text-white">
                        Calculadora de Préstamos
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
                        Ingrese los datos del cliente para calcular el monto máximo aprobado.
                    </p>

                    <div className="mb-4">
                        <Input
                            type="text"
                            value={cliente}
                            onChange={handleClienteChange}
                            placeholder="Nombre del cliente"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div className="mb-6">
                        <Input
                            type="number"
                            value={ingreso}
                            onChange={handleIngresoChange}
                            placeholder="Ingreso mensual (Bs)"
                            min="1"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <Button
                        variant="primary"
                        onClick={handleCalcular}
                        disabled={botonDeshabilitado}
                        className="w-full"
                    >
                        Calcular
                    </Button>

                    {resultado && (
                        <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-left text-gray-800 dark:bg-gray-900 dark:border-gray-700 dark:text-white shadow-inner">
                            <p className="mb-2"><span className="font-semibold">Cliente:</span> {resultado.cliente}</p>
                            <p className="mb-2"><span className="font-semibold">Capacidad mensual:</span> {formatMoney(resultado.cuotaMaxima)} Bs</p>
                            <p className="mb-2"><span className="font-semibold">Interés:</span> {resultado.interes}%</p>
                            <p className="mb-4"><span className="font-semibold">Plazo:</span> {resultado.plazo} meses</p>

                            <p className="text-xl font-bold text-green-600 mb-2">
                                Monto máximo sugerido: {formatMoney(resultado.montoMaximo)} Bs
                            </p>

                            <p className="text-lg font-semibold text-blue-700 mb-4">
                                Monto total a pagar: {formatMoney(resultado.montoTotal)} Bs
                            </p>

                            <Button
                                variant="success"
                                onClick={handleGenerarPDF}
                                className="w-full"
                            >
                                Generar PDF
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
