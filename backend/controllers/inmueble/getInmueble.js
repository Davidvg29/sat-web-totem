const { crearArchivoRemoto, leerArchivoRemotoTes, leerArchivoRemotoTxt } = require("../../services/funcionesAccesoRemoto");
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

        const archivoRemoto = await crearArchivoRemoto(codInmueble);
        if (!archivoRemoto) {
            return res.status(500).json({
                status: false,
                message: "Error al crear el archivo remoto",
            });
        }

        const archivoTes = await leerArchivoRemotoTes(`res_ident_de_clientes${codInmueble}.tes`);
        if (archivoTes === "0001") {
            return res.status(204).json({
                status: false,
                message: "Inmueble sin facturas pendientes",
            });
        }
        if (!archivoTes) {
            return res.status(404).json({
                status: false,
                message: "Inmueble no encontrado",
            });
        }

        let infoInmueble = {}
        const archivoTxt = await leerArchivoRemotoTxt(`res_ident_de_clientes${codInmueble}.txt`);
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
        const archivoTxtFacturasVigentes = await leerArchivoRemotoTxt(`res_facturas_vigentes${codInmueble}.txt`);
        for (let i = 0; i < archivoTxtFacturasVigentes.length-1; i++) {
            let factura = {
                codInmueble:"",
                emision: "",
                prefijo: "",
                numFactura: "",
                periodo: "",
                vencimiento: "",
                importe: "",
                fechaBackup: ""
            }
            const linea = archivoTxtFacturasVigentes[i];
            factura.codInmueble = linea.substring(0, 8)
            factura.emision = linea.substring(8, 16)
            factura.prefijo = linea.substring(16, 20)
            factura.numFactura = linea.substring(20, 28)
            factura.periodo = linea.substring(28, 34)
            factura.vencimiento = linea.substring(34, 42)
            factura.importe = linea.substring(42, 52)
            factura.fechaBackup = linea.substring(52, 60)

            facturas.push(factura)
        }
        infoInmueble.informacion.facturas_vigentes = facturas
        return res.status(200).json(infoInmueble);

    } catch (error) {
        console.error("❌ Error en getInmueble:", error);
        return res.status(500).json({
            status: false,
            message: "Error interno del servidor al obtener inmueble",
        });
    }
};
module.exports = getInmueble;