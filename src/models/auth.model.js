const jwt = require('jsonwebtoken');
const pool = require("../db/index.db");

const authModel = {
  insertRevokedToken: async (token) => {
    try {
      const decodedToken = jwt.decode(token);
      if (!decodedToken || !decodedToken.exp) {
        throw new Error('Token inválido');
      }
      const expiration = new Date(decodedToken.exp * 1000);

      const query = 'INSERT INTO revoked_tokens (token, expiration) VALUES (?, ?)';
      const [rows] = await pool.execute(query, [token, expiration]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  checkRevokedToken: async (token) => {
    try {
      const query = 'SELECT * FROM revoked_tokens WHERE token = ?';
      const [rows] = await pool.execute(query, [token]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  deleteExpiredTokens: async () => {
    try {
      const now = new Date();
      const query = 'DELETE FROM revoked_tokens WHERE expiration < ?';
      const [rows] = await pool.execute(query, [now]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = authModel;