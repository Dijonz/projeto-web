require('dotenv').config();

const mysql = require('mysql2/promise');
console.log("Connecting to database...");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('Pool de conexões com MySQL criado com sucesso!');

module.exports = pool;

