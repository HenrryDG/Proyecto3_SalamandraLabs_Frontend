import BusquedaFilter from "../BusquedaFilter";
import EstadoPrestamoFilter from "./EstadoPrestamoFilter";
import FechaFilter from "../FechaFilter";

type Props = {
  filtro: string;
  setFiltro: (v: string) => void;
  estado: string;
  setEstado: (v: string) => void;
  rango: [Date | null, Date | null];
  setRango: (value: [Date | null, Date | null]) => void;
  child?: React.ReactNode;
};

export default function PrestamoFilter({ filtro, setFiltro, estado, setEstado, rango, setRango, child }: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center md:justify-between mb-5">
      <BusquedaFilter filtro={filtro} onChange={setFiltro} />
      <FechaFilter rango={rango} onChange={setRango} />
      <EstadoPrestamoFilter estado={estado} onChange={setEstado} />
      {child}
    </div>
  );
}
