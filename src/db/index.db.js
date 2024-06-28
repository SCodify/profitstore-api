const { db } = require('../config/index.config')
const mysql = require('mysql2')

/* 
const mysqlUri = `mysql://${db.dbUser}:${db.dbPass}@${db.dbHost}:${db.dbPort}/${db.dbName}`; 
*/
const mysqlConnection = mysql.createConnection({
  user: db.dbUser,
  password: db.dbPass,
  host: db.dbHost,
  port: db.dbPort,
  database: db.dbName
})

mysqlConnection.connect((error) => {
  if (error) {
    return console.log(error)
  }

  console.log(`Base de datos conectada en el puerto ${db.dbPort}`)
})

module.exports = mysqlConnection
