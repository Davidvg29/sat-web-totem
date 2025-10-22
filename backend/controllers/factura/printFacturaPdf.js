const path = require("path");
const printer = require("pdf-to-printer");
const fs = require("fs").promises;
const { getFacturasVigentesSAT, connectSSH } = require("../../services/funcionesAccesoRemoto");
const pool = require("../../config/bd/bd");

const printFacturaPdf = async (req, res) => {
    const {codInmueble, emision, prefijo, numFactura, periodo, vencimiento} = req.body;

    const filePath = path.join(__dirname, `../../cache/res_facturas_vigentes${prefijo}${numFactura}.pdf`);
    const jsonPath = path.join(__dirname, "../../data/data.json");

    let conn = null;

    try {
        conn = await connectSSH();
        await getFacturasVigentesSAT(`res_facturas_vigentes${prefijo}${numFactura}.pdf`, conn);
        await printer.print(filePath, { printer: process.env.IMPRESORA });

        // Leer JSON
        const data = await fs.readFile(jsonPath, "utf-8");
        const dataJson = JSON.parse(data);

        // Actualizar cantidad total
        dataJson.facturasImpresasTotal = String(Number(dataJson.facturasImpresasTotal) + 1);

        // Obtener fecha actual en formato YYYY-MM-DD
        const hoy = new Date().toISOString().split("T")[0];

        // Buscar si ya hay registro para hoy
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

        //Enviar respuesta
        res.status(200).json({
            status: true,
            message: "Factura impresa correctamente.",
        });

        //Guardar cambios en el JSON
        await fs.writeFile(jsonPath, JSON.stringify(dataJson, null, 2), "utf-8");

        //Eliminar el PDF temporal
        await fs.unlink(filePath);

        const querySearchFactura = await pool.query(`select * from facturas_impresas where numero_factura = $1`, [numFactura])
        if (querySearchFactura.rowCount > 0) {
            await pool.query(`update facturas_impresas set cantidad_impresion = cantidad_impresion + 1 where numero_factura = $1`, [numFactura])
        }else{
            const queryInsert = `INSERT INTO facturas_impresas(codigo_inmueble, periodo_factura, prefijo_factura, numero_factura, emision_factura, vencimiento_factura, cantidad_impresion)
                VALUES($1, $2, $3, $4, $5, $6, $7)` 
            await pool.query(queryInsert, [codInmueble, periodo, prefijo, numFactura, emision, vencimiento, 1])
        }

        await pool.query(`update total_facturas_impresas set cantidad_total = cantidad_total + 1 `)

    } catch (error) {
        console.error("Error en printFacturaPdf:", error);
        res.status(500).json({
            status: false,
            message: "Error al imprimir factura.",
        });
        if(conn){conn.end();}
    }
    
    
};

module.exports = printFacturaPdf;
