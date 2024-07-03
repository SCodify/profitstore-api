const { db } = require('../config/index.config')
const mysql = require('mysql2/promise');

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

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`Base de datos conectada en el puerto ${db.dbPort}`);
    connection.release();
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
};

testConnection();

module.exports = pool;
