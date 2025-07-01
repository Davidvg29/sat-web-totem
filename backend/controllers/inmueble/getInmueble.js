const { crearArchivoRemoto, leerArchivoRemotoTes, leerArchivoRemotoTxt, getFacturasVigentesSAT, connectSSH } = require("../../services/funcionesAccesoRemoto");
const validarCodInmueble = require("../../validations/validarCodInmueble");

const getInmueble = async (req, res) => {
    try {
        const { codInmueble } = req.params;

        const validar = validarCodInmueble(codInmueble)
        if(!validar){
            return res.status(404).json({
                status: false,
                message: "Inmueble no encontrado",
            });
        }

        const conn = await connectSSH()
        
        const archivoRemoto = await crearArchivoRemoto(codInmueble, conn);
        if (!archivoRemoto) {
            return res.status(500).json({
                status: false,
                message: "Error al crear el archivo remoto",
            });
        }

        const archivoTes = await leerArchivoRemotoTes(`res_ident_de_clientes${codInmueble}.tes`, conn);
        if (archivoTes === "0001") {
            return res.status(404).json({
                status: true,
                message: "Inmueble sin facturas pendientes",
            });
        }
        if (!archivoTes) {
            return res.status(404).json({
                status: false,
                message: "Inmueble no encontrado",
            });
        }
        const archivoTes2 = await leerArchivoRemotoTes(`res_facturas_vigentes${codInmueble}.tes`, conn);
        if (archivoTes2 === "0001") {
            return res.status(404).json({
                status: false,
                message: "Inmueble sin facturas pendientes",
            });
        }
        if (!archivoTes2) {
            return res.status(404).json({
                status: false,
                message: "Inmueble no encontrado",
            });
        }
        let infoInmueble = {}
        const archivoTxt = await leerArchivoRemotoTxt(`res_ident_de_clientes${codInmueble}.txt`,conn);
        infoInmueble = {
            status: true,
            message: "Inmueble encontrado",
            informacion: {
                codInmueble: archivoTxt.toString().slice(0, 8),
                cuenta  : {
                    distrito: archivoTxt.toString().slice(8, 11),
                    cuenta: archivoTxt.toString().slice(11, 19),
                    subCuenta: archivoTxt.toString().slice(19, 23),
                },
                nombre: archivoTxt.toString().slice(23, 50).trim(),
                direccion: {
                    calle: archivoTxt.toString().slice(73, 103).trim(),
                    numero: archivoTxt.toString().slice(103, 108).trim(),
                    piso: archivoTxt.toString().slice(108, 110).trim(),
                    depto: archivoTxt.toString().slice(110, 113).trim(),
                    manzana: archivoTxt.toString().slice(113, 116).trim(),
                    block: archivoTxt.toString().slice(116, 119).trim(),
                    lote: archivoTxt.toString().slice(119, 122).trim(),
                    casa: archivoTxt.toString().slice(122, 125).trim(),
                    barrio: archivoTxt.toString().slice(125, 155).trim(),
                    localidad: archivoTxt.toString().slice(155, 185).trim(),
                },
                facturas_vigentes:{}
            },
        }
        let facturas = []
        const archivoTxtFacturasVigentes = await leerArchivoRemotoTxt(`res_facturas_vigentes${codInmueble}.txt`, conn);
        for (let i = 0; i < archivoTxtFacturasVigentes.length-1; i++) {
            let factura = {
                codInmueble:"",
                emision: "",
                prefijo: "",
                numFactura: "",
                periodo: "",
                vencimiento: "",
                importe: "",
                nombreArchivoPDF: "",
                fechaBackup: ""
            }
            const linea = archivoTxtFacturasVigentes[i];
            factura.codInmueble = linea.substring(0, 8)
            factura.emision = linea.substring(8, 16)
            factura.prefijo = linea.substring(16, 20)
            factura.numFactura = linea.substring(20, 28)
            factura.periodo = linea.substring(28, 34)

            //fecha vencimiento
            const añoVenc = linea.substring(34, 38)
		    const mesVenc = linea.substring(38, 40)
		    const diaVenc = linea.substring(40, 42)
		    const fechaVencimiento = `${diaVenc}/${mesVenc}/${añoVenc}`;
            factura.vencimiento = fechaVencimiento

            factura.importe = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(linea.substring(42, 52) / 100);
            
            //fecha backup de informacion
            const añoFIA = linea.substring(52, 56)
			const mesFIA = linea.substring(56, 58)
			const diaFIA = linea.substring(58, 60)
			const fechaInfoActualizada = `${diaFIA}/${mesFIA}/${añoFIA}`
            factura.fechaBackup = fechaInfoActualizada

            factura.nombreArchivoPDF = `res_facturas_vigentes${linea.substring(16, 20)}${linea.substring(20, 28)}.pdf`

            facturas.push(factura)
            
            // const guardarPdf = await getFacturasVigentesSAT(factura.nombreArchivoPDF, conn)
            // if(!guardarPdf){
            //     return res.status(500).json({
            //     status: false,
            //     message: "Error al guardar PDF de factura.",
            // });
            // }
        }
        infoInmueble.informacion.facturas_vigentes = facturas
        console.log("Fin del try de funcion getInmueble")
        conn.end()
        return res.status(200).json(infoInmueble);

    } catch (error) {
        conn.end()
        console.error("❌ Error en getInmueble:", error);
        return res.status(500).json({
            status: false,
            message: "Error interno del servidor al obtener inmueble",
        });
    }
};
module.exports = getInmueble;