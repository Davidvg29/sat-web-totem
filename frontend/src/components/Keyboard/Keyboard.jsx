import { useState } from "react"
import css from "./Keyboard.module.css"

const Keyboard = ({handleInputValue}) => {

    const handleKeyValue=(e)=>{
        handleInputValue(e.target.value)
    }

    return (
            <div className={css.keyboard}>
                <button className={css.key} onClick={handleKeyValue} value="1">1</button>
                <button className={css.key} onClick={handleKeyValue} value="2">2</button>
                <button className={css.key} onClick={handleKeyValue} value="3">3</button>
                <button className={css.key} onClick={handleKeyValue} value="4">4</button>
                <button className={css.key} onClick={handleKeyValue} value="5">5</button>
                <button className={css.key} onClick={handleKeyValue} value="6">6</button>
                <button className={css.key} onClick={handleKeyValue} value="7">7</button>
                <button className={css.key} onClick={handleKeyValue} value="8">8</button>
                <button className={css.key} onClick={handleKeyValue} value="9">9</button>
                <button className={css.key} onClick={handleKeyValue} value="Cancelar">Cancelar</button>
                <button className={css.key} onClick={handleKeyValue} value="0">0</button>
                <button className={css.key} onClick={handleKeyValue} value="Borrar">Borrar</button>
            </div>
     );
}
 
export default Keyboard;