import axios from "axios"
import { useState, useEffect } from "react"
import Loader from "../Loader/Loader.jsx";
import css from "./FacturasVigentes.module.css"
import api from "../../axios/api.js";

const FacturasVigentes = ({facturas}) => {
    const [message, setMessage] = useState("")
    const [loader, setLoader] = useState(false)

    const sendNumeroFactura = async(numFactura)=>{
        try {
            setLoader(true)
            const {data} = await api.get(`/totem/factura/imprimir/${numFactura}`)
            console.log(data)
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
            <div>
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
                                <td>{`${factura.prefijo}-${factura.numFactura}`}</td>
                                <td>{factura.periodo}</td>
                                <td>{factura.vencimiento}</td>
                                <td>${factura.importe}</td>
                                <td><button onClick={()=>{sendNumeroFactura(`${factura.prefijo}${factura.numFactura}`)}}>Imprimir</button></td>
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