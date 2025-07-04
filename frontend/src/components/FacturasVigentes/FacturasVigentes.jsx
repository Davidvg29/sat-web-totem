import axios from "axios"
import { useState, useEffect } from "react"
import Loader from "../Loader/Loader.jsx";
import css from "./FacturasVigentes.module.css"
import api from "../../axios/api.js";
import imgPrint from "../../assets/printWhite.svg"

const FacturasVigentes = ({facturas}) => {
    const [message, setMessage] = useState("")
    const [loader, setLoader] = useState(false)

    const sendNumeroFactura = async(numFactura)=>{
        try {
            setLoader(true)
            const {data} = await api.get(`/totem/factura/imprimir/${numFactura}`)
            setMessage(data.message)
            if(data.status){
                setLoader(false)
            }
        } catch (error) {
            setMessage("Error al imprimir la factura. Por favor, intente nuevamente más tarde.")
        }
    }

    useEffect(() => {
        if (message !== "") {
            setLoader(true)
            const timer = setTimeout(() => {
                setMessage("");
                setLoader(false)
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return ( 
        <div className={css.containerFacturaVigente}>
            <h2>Facturas vigentes</h2>
            <p>Información actualizada al {facturas[0].fechaBackup}. Demora hasta 72h hábiles en reflejar pagos por canales externos.</p>
            <div className={css.containerTableFactura}>
                <table>
                    <thead>
                        <tr>
                            <th>Número</th>
                            <th>Período</th>
                            <th>Vencimiento</th>
                            <th>Importe</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facturas.map((factura, index)=>(
                            <tr key={index}>
                                <td><div className={css.tdNumFactura}><svg viewBox="0 0 20 20"xmlns="http://www.w3.org/2000/svg"fill="none"><path fill="#000000"fillRule="evenodd"d="M4 1a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V7.414A2 2 0 0017.414 6L13 1.586A2 2 0 0011.586 1H4zm0 2h7.586L16 7.414V17H4V3zm2 2a1 1 0 000 2h5a1 1 0 100-2H6zm-1 5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h8a1 1 0 100-2H6z"/></svg>{`${factura.prefijo}-${factura.numFactura}`}</div></td>
                                <td>{factura.periodo}</td>
                                <td>{factura.vencimiento}</td>
                                <td><b>${factura.importe}</b></td>
                                <td className={css.ultimaColumna}><button className={css.buttonPrint} onClick={()=>{sendNumeroFactura(`${factura.prefijo}${factura.numFactura}`)}}><img src={imgPrint}/> Imprimir</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p>{message}</p>
           </div>
           {loader ? (<Loader message={"Imprimiendo factura..."}/>) : ""}
        </div>
     );
}
 
export default FacturasVigentes;