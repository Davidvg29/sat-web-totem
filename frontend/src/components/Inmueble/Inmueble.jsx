import FacturasVigentes from "../FacturasVigentes/FacturasVigentes";
import css from "./Inmueble.module.css"
const Inmueble = ({inmueble}) => {
    const {
        codInmueble, 
        nombre, 
        direccion:{calle, numero, piso, depto, manzana, block, lote, casa, barrio, localidad}, 
        facturas_vigentes} = inmueble;

    return ( 
        <div className={css.containerInmueble}>
            <h2>Informacion de inmueble:</h2>
            <p>Nº inmueble: {codInmueble}</p>
            <p>Nombre: {nombre}</p>
            <h2>Direccion: </h2>
            <p>Calle: {calle} {numero!=="00000" ? numero : ""}</p>
            {numero!=="00000" ? (<p>Calle: {numero}</p>) : ""}
            {piso ? (<p>Piso: {piso}</p>) : ""}
            {depto ? (<p>Departamento: {depto}</p>) : ""}
            {manzana ? (<p>Manzana: {manzana}</p>) : ""}
            {block ? (<p>Block: {block}</p>) : ""}
            {lote ? (<p>Lote: {lote}</p>) : ""}
            {casa ? (<p>Casa: {casa}</p>) : ""}
            {barrio ? (<p>Barrio: {barrio}</p>) : ""}
            {localidad ? (<p>Localidad: {localidad}</p>) : ""}
            <FacturasVigentes facturas={facturas_vigentes}/>
        </div>
    );
}
 
export default Inmueble;