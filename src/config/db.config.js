const mysql = require('mysql2');
const envConfig = require('./env.config.js');

const connection = mysql.createConnection({
  host: envConfig.DB_HOST,
  port: envConfig.DB_PORT,
  database: envConfig.DB_NAME,
  user: envConfig.DB_USER,
  password: envConfig.DB_PASS
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

module.exports = connection;
