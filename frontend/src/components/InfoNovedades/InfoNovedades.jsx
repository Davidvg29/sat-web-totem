import { useEffect, useState } from "react";
import api from "../../axios/api";
import css from "./InfoNovedades.module.css";

const InfoNovedades = () => {
  const [facturas, setFacturas] = useState(null);
  const [filteredFacturas, setFilteredFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [fechaExacta, setFechaExacta] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const response = await api("/totem/novedades");
        if (response.data.status) {
          setFacturas(response.data.data);
          setFilteredFacturas(response.data.data.facturasImpresas);
        } else {
          setError("Error al obtener datos de facturas.");
        }
      } catch (err) {
        setError("Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchFacturas();
  }, []);

  const handleFiltrar = () => {
    if (!facturas) return;

    let resultados = facturas.facturasImpresas;

    if (fechaExacta) {
      resultados = resultados.filter(f => f.fecha === fechaExacta);
    } else if (fechaDesde && fechaHasta) {
      resultados = resultados.filter(f => f.fecha >= fechaDesde && f.fecha <= fechaHasta);
    }

    setFilteredFacturas(resultados);
  };

  const handleReset = () => {
    setFechaExacta("");
    setFechaDesde("");
    setFechaHasta("");
    if (facturas) {
      setFilteredFacturas(facturas.facturasImpresas);
    }
  };

  if (loading) return <p className={css.loading}>Cargando novedades...</p>;
  if (error) return <p className={css.error}>{error}</p>;

  return (
    <div className={css.containerInfo}>
      <div className={css.card}>
        <h2 className={css.title}>📢 Novedades Totem</h2>
        <p className={css.total}>
          Total facturas impresas: <span>{facturas.facturasImpresasTotal}</span>
        </p>

        <div className={css.filtroFechas}>
          <h3 className={css.subtitle}>Filtrar por fecha</h3>
          <div className={css.filtros}>
            <label>
              Por día:
              <input
                type="date"
                value={fechaExacta}
                onChange={(e) => setFechaExacta(e.target.value)}
              />
            </label>

            <label>
              Desde:
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
              />
            </label>

            <label>
              Hasta:
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
              />
            </label>

            <div className={css.buttons}>
              <button onClick={handleFiltrar}>Filtrar</button>
              <button onClick={handleReset}>Mostrar todos</button>
            </div>
          </div>
        </div>

        <h3 className={css.subtitle}>📅 Facturas por fecha</h3>
        {filteredFacturas.length === 0 ? (
          <p>No hay resultados para el filtro aplicado.</p>
        ) : (
          <ul className={css.list}>
            {filteredFacturas.map(({ fecha, cantidad }, index) => (
              <li key={index} className={css.listItem}>
                {fecha}: <span>{cantidad} factura{cantidad !== "1" ? "s" : ""}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default InfoNovedades;
