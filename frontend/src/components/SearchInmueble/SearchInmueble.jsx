import { useState } from "react";
import css from "./SearchInmueble.module.css"
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const SearchInmueble = () => {

    // teclado solo con números
    const numericLayout = {
        default: [
        "1 2 3",
        "4 5 6",
        "7 8 9",
        "0 {bksp}",
        "{Buscar}"
        ]
    };

    const [codInmueble, setCodInmueble] = useState("")

    const handleCodInmueble = (e)=>{
        setCodInmueble(e.target.value)
    }

     const handleKeyPress = (button) => {
    console.log("Tecla presionada:", button);
        setCodInmueble(button)
    if (button === "{Buscar}") {
      alert(`Buscando inmueble con código: ${input}`);
      // Aquí podrías hacer una búsqueda real
    }

    if (button === "{bksp}") {
      // Borrar el último carácter manualmente (opcional)
      setInput((prev) => prev.slice(0, -1));
    }
  };

    return ( 
        <div className={css.containerSearchInmueble}>
            <h2>¡Bienvenido!</h2>
            <p>Ingrese el código del inmueble para visualizar las facturas vigentes.</p> 
            <input value={codInmueble} type="text" placeholder="12345678"/>
            <div className={css.containerKeyboard}>
                <Keyboard 
                    className={css.keyboard}
                    onChange={handleCodInmueble} 
                    onKeyPress={handleKeyPress}
                    layout={numericLayout} 
                    display= {{
                            '{bksp}': '⌫',
                            '{Buscar}': 'Buscar'
                    }}
                    buttonTheme={[{
                        class: "boton-buscar",
                        buttons: "{Buscar}"}
                    ]}
                    />
            </div>
        </div>
     );
}
 
export default SearchInmueble;