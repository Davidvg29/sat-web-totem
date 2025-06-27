const path = require("path")
const printer = require('pdf-to-printer');

const printFacturaPdf = (req, res) => {
    const { numeroFactura } = req.params;
    const filePath = path.join(__dirname, `../../cache/res_facturas_vigentes${numeroFactura}.pdf`);

    printer.print(filePath)
    .then(() => {
        return res.status(200).json({
                status: true,
                message: "Factura impresa correctamente.",
            });
    })
    .catch((error) => {
        return res.status(500).json({
                status: false,
                message: "Error al imprimir factura.",
            });
    });
  
};

module.exports = printFacturaPdf