const path = require("path")
const printer = require('pdf-to-printer');
const fs = require("fs").promises
const { getFacturasVigentesSAT, connectSSH } = require("../../services/funcionesAccesoRemoto");

const printFacturaPdf = async (req, res) => {
    const { numeroFactura } = req.params;
    const filePath = path.join(__dirname, `../../cache/res_facturas_vigentes${numeroFactura}.pdf`);

    try {
        const conn = await connectSSH()
        await getFacturasVigentesSAT(`res_facturas_vigentes${numeroFactura}.pdf`, conn)
        printer.print(filePath)
        .then(() => {
            res.status(200).json({
                    status: true,
                    message: "Factura impresa correctamente.",
                });
            fs.unlink(filePath)
            return
        })
        .catch((error) => {
            return res.status(500).json({
                    status: false,
                    message: "Error al imprimir factura.",
                });
        });
    } catch (error) {
        console.log("error en printFacturaPdf")
        return res.status(500).json({
                    status: false,
                    message: "Error al imprimir factura.",
                });
    }

    
  
};

module.exports = printFacturaPdf