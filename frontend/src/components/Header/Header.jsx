import logo from "../../assets/icono.png"
import css from "./Header.module.css"

const Header = ()=>{
    return(
        <header>
            <img src={logo} alt="Logo SAT." />
            <h1>Sociedad Aguas del Tucumán</h1>
        </header>
    )
}
export default Header