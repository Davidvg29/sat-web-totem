const pool = require("../../config/db")
const { crearArchivoRemoto, leerArchivoRemotoTes } = require("../../services/funcionesAccesoRemoto")
const validarCodInmueble = require("../../validations/validarCodInmueble")

const relacionUserInmueble = async (req, res)=>{
    try {
        const {idUser, codInmueble} = req.body
        
        //valida si el codigo de inmueble es correcto
        const validar = validarCodInmueble(codInmueble)
        if(!validar){
            return res.status(404).json({
                status: false,
                message: "Inmueble no encontrado para hacer la relacion con user",
            });
        }

        // valida si el idUser es correcto
        if (!idUser || isNaN(Number(idUser))) {
            return res.status(400).json({
                status: false,
                message: "ID de usuario inválido"
            });
        }

        // valida que user exista en bd
        const querySearchUser = `SELECT * FROM users WHERE id_user = $1`
        const user = await pool.query(querySearchUser, [idUser])
        if(user.rowCount !== 1){
            return res.status(404).json({
                    status: false,
                    message: `User no existe`
            })
        }

        // crea archivo remoto
        const archivoRemoto = await crearArchivoRemoto(codInmueble)
        if (!archivoRemoto) {
            return res.status(500).json({
                status: false,
                message: "Error al crear el archivo remoto",
            });
        }

        // valida si existe el inmueble en el comunica
        const archivoTes = await leerArchivoRemotoTes(`res_ident_de_clientes${codInmueble}.tes`)
        if (archivoTes === "0002") {
            return res.status(204).json({
                status: false,
                message: "Inmueble no existe",
            });
        }
        
        // busca el inmueble en la tabla inmueble
        const querySearchInmueble = `SELECT * FROM inmueble WHERE codigoInmueble = $1`
        const inmueble = await pool.query(querySearchInmueble, [codInmueble])
        let idInmueble;
        if(inmueble.rowCount === 0){
            // si no existe se agrega a bd
            const queryAddInmueble = `
                INSERT INTO inmueble (codigoInmueble)
                VALUES($1)`
            await pool.query(queryAddInmueble, [codInmueble])
            const resultInmueble = await pool.query(`
                    SELECT id_inmueble FROM inmueble WHERE codigoInmueble = $1`, [codInmueble])

            idInmueble = resultInmueble.rows[0].id_inmueble
        }else{
                 idInmueble = inmueble.rows[0].id_inmueble
        }
        
        // busca si ya existe relacion en tre user e inmueble 
        const searchRelacion = `select * from user_inmueble where id_user = $1 and id_inmueble = $2`
        const querySearchRelacion = await pool.query(searchRelacion, [idUser, idInmueble])
        if(querySearchRelacion.rowCount === 1){
            return res.status(200).json({
                status: true,
                message: `Relacion idUser: ${idUser} y codInmueble: ${codInmueble} ya existe`
            })
        }

        // agrega relacion entre user e inmueble
        const queryInsertRelacionUserInmueble = `
            INSERT INTO user_inmueble (id_user, id_inmueble)
            VALUES ($1, $2)`
        await pool.query(queryInsertRelacionUserInmueble, [idUser, idInmueble])

        return res.status(200).json({
            status: true,
            message: `Relacion idUser: ${idUser} y codInmueble: ${codInmueble} relacionado correctamente`
        })

    } catch (error) {
        return res.status(500).json({
            status:false,
            message: "Error al relacionar usuario con el inmueble",
            error: error
        })
    }
}
module.exports = relacionUserInmueble