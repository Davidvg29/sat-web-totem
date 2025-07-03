import FacturasVigentes from "../FacturasVigentes/FacturasVigentes";
import css from "./Inmueble.module.css"
import { Link, useLocation } from "react-router-dom";
const Inmueble = ({inmueble}) => {

    if(!inmueble){
        return(
            <div className={css.containerInmueble}>
<div className={css.containerBack}>
  <Link to="/">
    <svg fill="#000000" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M222.927 580.115l301.354 328.512c24.354 28.708 20.825 71.724-7.883 96.078s-71.724 20.825-96.078-7.883L19.576 559.963a67.846 67.846 0 01-13.784-20.022 68.03 68.03 0 01-5.977-29.488l.001-.063a68.343 68.343 0 017.265-29.134 68.28 68.28 0 011.384-2.6 67.59 67.59 0 0110.102-13.687L429.966 21.113c25.592-27.611 68.721-29.247 96.331-3.656s29.247 68.721 3.656 96.331L224.088 443.784h730.46c37.647 0 68.166 30.519 68.166 68.166s-30.519 68.166-68.166 68.166H222.927z"></path>
      </g>
    </svg>
  </Link>
</div>
                <p>Inmueble no encontrado.</p>
            </div>
        )
    }

    const {
        codInmueble, 
        nombre, 
        direccion:{calle, numero, piso, depto, manzana, block, lote, casa, barrio, localidad}, 
        facturas_vigentes} = inmueble;

    return ( 
        <div className={css.containerInmueble}>
        <div className={css.containerBack}>
            <Link to="/" className={css.linkBack}>
                <svg fill="#ffffff" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <path d="M222.927 580.115l301.354 328.512c24.354 28.708 20.825 71.724-7.883 96.078s-71.724 20.825-96.078-7.883L19.576 559.963a67.846 67.846 0 01-13.784-20.022 68.03 68.03 0 01-5.977-29.488l.001-.063a68.343 68.343 0 017.265-29.134 68.28 68.28 0 011.384-2.6 67.59 67.59 0 0110.102-13.687L429.966 21.113c25.592-27.611 68.721-29.247 96.331-3.656s29.247 68.721 3.656 96.331L224.088 443.784h730.46c37.647 0 68.166 30.519 68.166 68.166s-30.519 68.166-68.166 68.166H222.927z"></path>
                </g>
                </svg>
                <p>volver atras</p>
            </Link>
        </div>
            <div className={css.containerInformacion}>
                <div className={css.subContainerInformacion}>
                    <div className={css.containerInfo}>
                        <h2>Información  de inmueble</h2>
                        <p><b>N.º de inmueble:</b> {codInmueble}</p>
                        <p><b>Nombre:</b> {nombre}</p>
                    </div>
                    <div className={css.containerDireccion}>
                        <h2 className={css.titleDireccion}>Dirección: </h2>
                        <div className={css.subContainerDireccion}>
                            <p><b>Calle:</b> {calle} {numero!=="00000" ? numero : ""}</p>
                            {piso ? (<p><b>Piso:</b> {piso} </p>) : ""}
                            {depto ? (<p><b>Departamento:</b> {depto} </p>) : ""}
                            {manzana ? (<p><b>Manzana:</b> {manzana} </p>) : ""}
                            {block ? (<p><b>Block:</b> {block} </p>) : ""}
                            {lote ? (<p><b>Lote:</b> {lote} </p>) : ""}
                            {casa ? (<p><b>Casa:</b> {casa} </p>) : ""}
                            {barrio ? (<p><b>Barrio:</b> {barrio} </p>) : ""}
                            {localidad ? (<p><b>Localidad:</b> {localidad} </p>) : ""}
                        </div>
                    </div>
                    <FacturasVigentes facturas={facturas_vigentes}/>
                    <p className={css.pReviseDatos}><b>Por favor revise cuidadosamente sus datos personales y el monto a pagar de sus facturas.</b></p>
                </div>
            </div>
        </div>
    );
}
 
export default Inmueble;