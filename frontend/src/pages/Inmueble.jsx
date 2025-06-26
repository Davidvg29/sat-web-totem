import { useLocation } from "react-router-dom";
import Header from "../components/Header/Header";
import Inmueble from "../components/Inmueble/Inmueble";

const inmueble = () => {
    const location = useLocation();

    return ( 
        <div>
            <Header/>
            <Inmueble inmueble = {location.state}/>
        </div> 
    );
}
 
export default inmueble;