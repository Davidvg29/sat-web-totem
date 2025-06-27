import css from "./Loader.module.css"

const Loader = ({message}) => {
    return ( 
        <div className={css.containerLoader}>
            <div className={css.spinner} />
            <p>{message}</p>
        </div>
     );
}
 
export default Loader;