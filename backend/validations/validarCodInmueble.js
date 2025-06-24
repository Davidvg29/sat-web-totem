const validarCodInmueble = (codInmueble)=>{
    if(codInmueble.length !== 8){
        return false
    }
    
    const agencias = [164, 165, 166, 167, 168, 169, 182, 183, 184, 186, 187, 189, 190, 191, 192, 193]
    const verificaCodAgencia = agencias.includes(parseInt(codInmueble.slice(0, 3)))
    if(!verificaCodAgencia){
        return false
    }

    return true
}
module.exports = validarCodInmueble