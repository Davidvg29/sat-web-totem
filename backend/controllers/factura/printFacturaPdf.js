const path = require("path");
const printer = require("pdf-to-printer");
const fs = require("fs").promises;
const { getFacturasVigentesSAT, connectSSH } = require("../../services/funcionesAccesoRemoto");
const pool = require("../../config/bd/bd");

const printFacturaPdf = async (req, res) => {
    const {codInmueble, emision, prefijo, numFactura, periodo, vencimiento} = req.body;
    console.log(req.body);
    

    const filePath = path.join(__dirname, `../../cache/res_facturas_vigentes${prefijo}${numFactura}.pdf`);

    let conn = null;

    try {
        conn = await connectSSH();
        await getFacturasVigentesSAT(`res_facturas_vigentes${prefijo}${numFactura}.pdf`, conn);
        await printer.print(filePath, { printer: process.env.IMPRESORA });

        //Enviar respuesta
        res.status(200).json({
            status: true,
            message: "Factura impresa correctamente.",
        });

        //Eliminar el PDF temporal
        await fs.unlink(filePath);
        
        const querySearchFactura = await pool.query(`select * from facturas_impresas where numero_factura = $1`, [numFactura])
        if (querySearchFactura.rowCount > 0) {
            await pool.query(`update facturas_impresas set cantidad_impresion = cantidad_impresion + 1 where numero_factura = $1`, [numFactura])
        }else{
            const queryInsert = `INSERT INTO facturas_impresas(codigo_inmueble, periodo_factura, prefijo_factura, numero_factura, emision_factura, vencimiento_factura, cantidad_impresion)
                VALUES($1, $2, $3, $4, $5, $6, $7) returning*` 
               
                
           const a = await pool.query(queryInsert, [codInmueble, periodo, prefijo, numFactura, emision, vencimiento, 1])
            
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
