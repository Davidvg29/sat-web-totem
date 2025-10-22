require('dotenv').config();
const app = require('./app');
const pool = require('./config/bd/bd');

const PORT = process.env.PORT || 3000;

// Verificar conexión a la base de datos antes de iniciar el servidor
pool.connect()
  .then(client => {
    console.log('Conectado a la base de datos PostgreSQL');
    client.release(); // liberamos el cliente

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1); // salir si no hay conexión
  });
