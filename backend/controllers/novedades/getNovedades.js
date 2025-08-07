const path = require("path");
const fs = require("fs").promises;

const getNovedades = async (req, res) => {
  try {
    const jsonPath = path.join(__dirname, "../../data/data.json");

    // Leer y parsear el archivo JSON
    const data = await fs.readFile(jsonPath, "utf-8");
    const json = JSON.parse(data);

    // Enviar respuesta
    return res.status(200).json({
      status: true,
      data: json
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
