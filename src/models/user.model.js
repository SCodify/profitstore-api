const pool = require("../db/index.db");

const userModel = {
  create: async (username, hashedPassword) => {
    const query = 'INSERT INTO users (id, username, password) VALUES (?, ?, ?)';
    const id = Date.now();
    const [result] = await pool.execute(query, [id, username, hashedPassword]);
    return { id, username };
  },

  findByUsername: async (username) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    const [rows] = await pool.execute(query, [username]);
    return rows[0];
  },

  findById: async (id) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }
};

module.exports = userModel;