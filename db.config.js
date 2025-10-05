const mysql = require('mysql2');
const env = require('./env.config');

const connection = mysql.createConnection({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    // Se intenta establecer la conexión a la base de datos
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

module.exports = connection;
