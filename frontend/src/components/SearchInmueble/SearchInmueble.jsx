import { useState } from "react";
import css from "./SearchInmueble.module.css"
import Keyboard from "../Keyboard/Keyboard"
import validarCodInmueble from "../../validations/validateCodInmueble.js"
import axios from "axios"
import Loader from "../Loader/Loader.jsx";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../../axios/api.js"

const SearchInmueble = () => {
    const navigate = useNavigate()

    const [inputValue, setInputValue] = useState("")
    const [message, setMessage] = useState("")
    const [loader, setLoader] = useState(false)

    const handleInputValue = (key) => {
        if (!isNaN(key)) {
            setInputValue(inputValue + key);
            setMessage("");
        } else if (key === "Borrar") {
            setInputValue(inputValue.slice(0, -1));
            setMessage("");
        } else if (key === "Cancelar") {
            setInputValue("");
            setMessage("");
        }
    };

    const handleChange = (e) => {
        setInputValue(e.target.value);
        setMessage("");
    };

    const searchInmueble = async()=>{
        
        try {
            const validation = validarCodInmueble(inputValue)
            if(!validation){ return setMessage("Escribe un codigo de inmueble correcto")}
            else{setMessage("")}
            setLoader(true)
            const {data} = await api.get(`http://150.150.150.108:3000/totem/inmueble/${inputValue}`)
            if(data.status === true){
                setLoader(false)
                navigate("/inmueble", { state: data.informacion })
            }

        } catch (error) {
            setMessage("Ocurrió un error. Intente más tarde.")
            if(error.status === 404){
                setLoader(false)
                setMessage(error.response.data.message)
            }
        }
    }

    return ( 
        <div className={css.containerSearchInmueble}>
            <h2>¡Bienvenido!</h2>
            <p>Ingrese el código del inmueble para visualizar las facturas vigentes.</p> 
            <input className={css.inputValueCodInmueble} type="number" value={inputValue} onChange={handleChange} placeholder="ej 16400000"/>
            <p className={css.message}>{message}</p>
            <div className={css.containerKeyboard}> 
                <Keyboard handleInputValue={handleInputValue}/>
                <button className={css.butonBuscar} value="Buscar" onClick={searchInmueble}>BUSCAR</button>
            </div>
            {loader ? (<Loader message={"Buscando facturas del inmueble..."}/>) : ""}
        </div>
     );
}
 
export default SearchInmueble;