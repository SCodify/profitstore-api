require('dotenv').config()

module.exports = {
  port: process.env.PORT || 9000,
  db: {
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT,
  }
}