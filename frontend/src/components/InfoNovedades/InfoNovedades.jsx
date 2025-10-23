import { useEffect, useState } from "react";
import api from "../../axios/api";
import css from "./InfoNovedades.module.css";
import * as XLSX from 'xlsx'; // <-- NUEVO: Importar la librería de Excel

const InfoNovedades = () => {
  const [facturas, setFacturas] = useState([]);
  const [filteredFacturas, setFilteredFacturas] = useState([]);
  const [totalImpresas, setTotalImpresas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [fechaExacta, setFechaExacta] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [codigoInmueble, setCodigoInmueble] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [numeroFactura, setNumeroFactura] = useState("");

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const response = await api("/totem/novedades");
        if (response.data.status) {
          const data = response.data.data;
          const facturasImpresas = data.facturasImpresas || [];
          const total = data.totalFacturasImpresas?.cantidad_total || 0;

          setFacturas(facturasImpresas);
          setFilteredFacturas(facturasImpresas);
          setTotalImpresas(total);
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

  const formatFechaHora = (isoDate) => {
    if (!isoDate) return "N/A";
    return new Date(isoDate).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleFiltrar = () => {
    // ... (Tu función de filtrar no cambia) ...
    if (!facturas) return;
    let resultados = [...facturas];
    if (codigoInmueble) {
      resultados = resultados.filter(f =>
        String(f.codigo_inmueble).includes(codigoInmueble)
      );
    }
    if (periodo) {
      resultados = resultados.filter(f =>
        String(f.periodo_factura).includes(periodo)
      );
    }
    if (numeroFactura) {
      resultados = resultados.filter(f =>
        String(f.numero_factura).includes(numeroFactura)
      );
    }
    if (fechaExacta) {
      resultados = resultados.filter(f => f.fecha_hora.startsWith(fechaExacta));
    } else {
      if (fechaDesde) {
        const desde = new Date(fechaDesde + "T00:00:00");
        resultados = resultados.filter(f => new Date(f.fecha_hora) >= desde);
      }
      if (fechaHasta) {
        const hasta = new Date(fechaHasta + "T23:59:59");
        resultados = resultados.filter(f => new Date(f.fecha_hora) <= hasta);
      }
    }
    setFilteredFacturas(resultados);
  };

  const handleReset = () => {
    // ... (Tu función de reset no cambia) ...
    setFechaExacta("");
    setFechaDesde("");
    setFechaHasta("");
    setCodigoInmueble("");
    setPeriodo("");
    setNumeroFactura("");
    if (facturas) {
      setFilteredFacturas(facturas);
    }
  };

  // <-- NUEVO: Función para exportar a Excel
  const handleExportExcel = () => {
    // 1. Formateamos los datos para que coincidan con la tabla
    const dataToExport = filteredFacturas.map(factura => ({
      "ID": factura.id_factura_impresa,
      "Cód. Inmueble": factura.codigo_inmueble,
      "Periodo": factura.periodo_factura,
      "N° Factura": `${factura.prefijo_factura}-${factura.numero_factura}`,
      "Emisión": factura.emision_factura,
      "Vencimiento": factura.vencimiento_factura,
      "Fecha Impresión": formatFechaHora(factura.fecha_hora), // Usamos la fecha formateada
      "Cant. Impr.": factura.cantidad_impresion
    }));

    // 2. Creamos la hoja de cálculo (worksheet)
    const ws = XLSX.utils.json_to_sheet(dataToExport);

    // (Opcional) Ajustar anchos de columna
    ws["!cols"] = [
      { wch: 5 },  // ID
      { wch: 15 }, // Cód. Inmueble
      { wch: 10 }, // Periodo
      { wch: 15 }, // N° Factura
      { wch: 12 }, // Emisión
      { wch: 12 }, // Vencimiento
      { wch: 20 }, // Fecha Impresión
      { wch: 10 }  // Cant. Impr.
    ];

    // 3. Creamos el libro (workbook) y añadimos la hoja
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FacturasImpresas"); // "FacturasImpresas" es el nombre de la pestaña

    // 4. Generamos y descargamos el archivo
    XLSX.writeFile(wb, "Reporte_Facturas_Impresas.xlsx"); // Este es el nombre del archivo
  };

  if (loading) return <p className={css.loading}>Cargando novedades...</p>;
  if (error) return <p className={css.error}>{error}</p>;

  return (
    <div className={css.containerInfo}>
      <div className={css.card}>
        <h2 className={css.title}>📢 Novedades Totem</h2>
        <p className={css.total}>
          Total facturas impresas: <span>{totalImpresas}</span>
        </p>

        {/* --- Sección de Filtros --- */}
        <div className={css.filtrosContainer}>
          {/* ... (Tus filtros de fecha y datos no cambian) ... */}
           <h3 className={css.subtitle}>Filtrar por fecha</h3>
          <div className={css.filtros}>
            <label>
              Por día:
              <input
                type="date"
                value={fechaExacta}
                onChange={(e) => setFechaExacta(e.target.value)}
                disabled={!!fechaDesde || !!fechaHasta}
              />
            </label>
            <label>
              Desde:
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                disabled={!!fechaExacta}
              />
            </label>
            <label>
              Hasta:
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                disabled={!!fechaExacta}
              />
            </label>
          </div>

          <h3 className={css.subtitle}>Filtrar por datos</h3>
          <div className={css.filtros}>
            <label>
              Cód. Inmueble:
              <input
                type="text"
                value={codigoInmueble}
                onChange={(e) => setCodigoInmueble(e.target.value)}
                placeholder="Ej: 16400003"
              />
            </label>
            <label>
              Periodo:
              <input
                type="text"
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                placeholder="Ej: 202509"
              />
            </label>
            <label>
              N° Factura:
              <input
                type="text"
                value={numeroFactura}
                onChange={(e) => setNumeroFactura(e.target.value)}
                placeholder="Ej: 33305426"
              />
            </label>
          </div>
          
          <div className={css.buttons}>
            <button onClick={handleFiltrar}>Filtrar</button>
            <button onClick={handleReset} className={css.resetButton}>Mostrar todos</button>
            {/* <-- NUEVO: Botón de Exportar */}
            <button 
              onClick={handleExportExcel} 
              className={css.exportButton}
              disabled={filteredFacturas.length === 0} // (Opcional) Deshabilitar si no hay datos
            >
              Exportar a Excel
            </button>
          </div>
        </div>
        
        {/* --- Sección de Resultados (La tabla no cambia) --- */}
        <h3 className={css.subtitle}>📄 Listado de Facturas ({filteredFacturas.length} registros)</h3>
        {filteredFacturas.length === 0 ? (
          <p>No hay resultados para el filtro aplicado.</p>
        ) : (
          <div className={css.tableContainer}>
            <table className={css.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cód. Inmueble</th>
                  <th>Periodo</th>
                  <th>N° Factura</th>
                  <th>Emisión</th>
                  <th>Vencimiento</th>
                  <th>Fecha Impresión</th>
                  <th>Cant. Impr.</th>
                </tr>
              </thead>
              <tbody>
                {filteredFacturas.map((factura) => (
                  <tr key={factura.id_factura_impresa}>
                    <td>{factura.id_factura_impresa}</td>
                    <td>{factura.codigo_inmueble}</td>
                    <td>{factura.periodo_factura}</td>
                    <td>{factura.prefijo_factura}-{factura.numero_factura}</td>
                    <td>{factura.emision_factura}</td>
                    <td>{factura.vencimiento_factura}</td>
                    <td>{formatFechaHora(factura.fecha_hora)}</td>
                    <td>{factura.cantidad_impresion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoNovedades;