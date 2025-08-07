const path = require("path");
const printer = require("pdf-to-printer");
const fs = require("fs").promises;
const { getFacturasVigentesSAT, connectSSH } = require("../../services/funcionesAccesoRemoto");

const printFacturaPdf = async (req, res) => {
    const { numeroFactura } = req.params;
    const filePath = path.join(__dirname, `../../cache/res_facturas_vigentes${numeroFactura}.pdf`);
    const jsonPath = path.join(__dirname, "../../data/data.json");

    try {
        const conn = await connectSSH();
        await getFacturasVigentesSAT(`res_facturas_vigentes${numeroFactura}.pdf`, conn);
        await printer.print(filePath, { printer: process.env.IMPRESORA });

        // ✅ Leer JSON
        const data = await fs.readFile(jsonPath, "utf-8");
        const dataJson = JSON.parse(data);

        // ✅ Actualizar cantidad total
        dataJson.facturasImpresasTotal = String(Number(dataJson.facturasImpresasTotal) + 1);

        // ✅ Obtener fecha actual en formato YYYY-MM-DD
        const hoy = new Date().toISOString().split("T")[0];

        // ✅ Buscar si ya hay registro para hoy
        const registroExistente = dataJson.facturasImpresas.find(f => f.fecha === hoy);

        if (registroExistente) {
            // Si ya existe, sumar 1
            registroExistente.cantidad = String(Number(registroExistente.cantidad) + 1);
        } else {
            // Si no existe, agregar nuevo registro
            dataJson.facturasImpresas.push({
                fecha: hoy,
                cantidad: "1"
            });
        }

        // ✅ Guardar cambios en el JSON
        await fs.writeFile(jsonPath, JSON.stringify(dataJson, null, 2), "utf-8");

        // ✅ Eliminar el PDF temporal
        await fs.unlink(filePath);

        // ✅ Enviar respuesta
        return res.status(200).json({
            status: true,
            message: "Factura impresa correctamente.",
        });

    } catch (error) {
        console.error("Error en printFacturaPdf:", error);
        return res.status(500).json({
            status: false,
            message: "Error al imprimir factura.",
        });
    }
};

module.exports = printFacturaPdf;
