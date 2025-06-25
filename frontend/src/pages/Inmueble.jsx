import { useLocation } from "react-router-dom";
import Header from "../components/Header/Header";

const inmueble = () => {
    const location = useLocation();
    const {codInmueble, nombre, direccion:{calle, barrio, localidad}} = location.state;
    console.log(location.state)

    return ( 
        <div>
            <Header/>
            <div>
                <p>{codInmueble}</p>
                <p>{nombre}</p>
                <p>{calle}</p>
                <p>{barrio}</p>
                <p>{localidad}</p>
            </div>
        </div> 
    );
}
 
export default inmueble;