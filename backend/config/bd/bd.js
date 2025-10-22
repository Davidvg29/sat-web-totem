require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'tu_usuario',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'tu_base_de_datos',
  password: process.env.DB_PASS || 'tu_contraseña',
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;