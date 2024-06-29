const { db } = require('../config/index.config')
const mysql = require('mysql2/promise');

/* 
const mysqlUri = `mysql://${db.dbUser}:${db.dbPass}@${db.dbHost}:${db.dbPort}/${db.dbName}`; 
*/

const pool = mysql.createPool({
  user: db.dbUser,
  password: db.dbPass,
  host: db.dbHost,
  port: db.dbPort,
  database: db.dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// Función para probar la conexión
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`Base de datos conectada en el puerto ${db.dbPort}`);
    connection.release();
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
};

// Ejecutar la prueba de conexión
testConnection();

module.exports = pool;
