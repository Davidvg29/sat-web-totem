import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header/Header";
import Inmueble from "../components/Inmueble/Inmueble";
import css from "./PageInmueble.module.css"

const inmueble = () => {
    const location = useLocation();

    return ( 
        <div className={css.containerPageInmueble}>
            <Header/>
            <Inmueble inmueble = {location.state}/>
        </div> 
    );
}
 
export default inmueble;