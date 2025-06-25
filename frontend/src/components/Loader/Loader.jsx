import css from "./Loader.module.css"

const Loader = () => {
    return ( 
        <div className={css.containerLoader}>
            <div className={css.spinner} />
            <p>Buscando facturas del inmueble...</p>
        </div>
     );
}
 
export default Loader;