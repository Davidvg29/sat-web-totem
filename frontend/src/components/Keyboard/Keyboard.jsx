import { useState } from "react"
import css from "./Keyboard.module.css"

const Keyboard = ({handleInputValue}) => {

    const handleKeyValue=(e)=>{
        handleInputValue(e.currentTarget.value)
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
                <button className={css.key} onClick={handleKeyValue} value="Cancelar"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000">
  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <path
      fill="#000000"
      d="M352 192V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64H96a32 32 0 0 1 0-64h256zm64 0h192v-64H416v64zM192 960a32 32 0 0 1-32-32V256h704v672a32 32 0 0 1-32 32H192zm224-192a32 32 0 0 0 32-32V416a32 32 0 0 0-64 0v320a32 32 0 0 0 32 32zm192 0a32 32 0 0 0 32-32V416a32 32 0 0 0-64 0v320a32 32 0 0 0 32 32z"
    />
  </g>
</svg>
</button>
                <button className={css.key} onClick={handleKeyValue} value="0">0</button>
                <button className={css.key} onClick={handleKeyValue} value="Borrar"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.00003 5C7.82888 5 7.66825 5.08261 7.5687 5.22183L3.64604 10.7077C3.25585 11.2534 3.23706 11.9816 3.59858 12.5466L7.58035 18.7703C7.67192 18.9134 7.83012 19 8.00003 19H19.3589C20.2653 19 21 18.2653 21 17.3589V6.64109C21 5.73474 20.2653 5 19.3589 5H8.00003ZM9.64645 8.14645C9.84171 7.95118 10.1583 7.95118 10.3536 8.14645L13.4807 11.2736L16.575 8.14818C16.7693 7.95194 17.0859 7.95036 17.2821 8.14464C17.4784 8.33892 17.4799 8.6555 17.2857 8.85174L14.1878 11.9807L17.3536 15.1464C17.5488 15.3417 17.5488 15.6583 17.3536 15.8536C17.1583 16.0488 16.8417 16.0488 16.6464 15.8536L13.4843 12.6914L10.3553 15.8518C10.161 16.048 9.84446 16.0496 9.64822 15.8553C9.45199 15.661 9.4504 15.3445 9.64468 15.1482L12.7771 11.9843L9.64645 8.85355C9.45119 8.65829 9.45119 8.34171 9.64645 8.14645Z"
      fill="#000000"
    />
  </g>
</svg>
</button>
            </div>
     );
}
 
export default Keyboard;