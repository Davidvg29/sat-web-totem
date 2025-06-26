const FacturasVigentes = ({facturas}) => {
    return ( 
        <div>
            <h2>Facturas vigentes</h2>
            <p>Información actualizada al {facturas[0].fechaBackup}. Demora hasta 72h hábiles en reflejar pagos por canales externos.</p>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Número</th>
                            <th>Período</th>
                            <th>Vencimiento</th>
                            <th>Importe</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facturas.map((factura)=>(
                            <tr>
                                <th>{`${factura.prefijo}-${factura.numFactura}`}</th>
                                <th>{factura.periodo}</th>
                                <th>{factura.vencimiento}</th>
                                <th>${factura.importe}</th>
                                <button>Imprimir</button>
                            </tr>
                        ))}
                    </tbody>
                </table>
           </div>
        </div>
     );
}
 
export default FacturasVigentes;