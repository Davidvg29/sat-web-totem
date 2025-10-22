const pool = require("../../config/bd/bd");

const getNovedades = async (req, res) => {
  try {
    const queryGetFacturasImpresas = await pool.query("SELECT * FROM facturas_impresas");
    const queryGetTotalFacturasImpresas = await pool.query("SELECT * FROM total_facturas_impresas");
    return res.status(200).json({
      status: true,
      data: {
        totalFacturasImpresas: queryGetTotalFacturasImpresas.rows[0],
        facturasImpresas: queryGetFacturasImpresas.rows
      }
    });
  } catch (error) {
    console.error("Error al leer facturas impresas:", error);
    return res.status(500).json({
      status: false,
      message: "Error al obtener facturas impresas."
    });
  }
};

module.exports = getNovedades;
