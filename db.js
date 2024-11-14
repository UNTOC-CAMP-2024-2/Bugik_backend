const mysql = require('mysql2/promise');
require('dotenv').config();

const conn = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
    connectionLimit: 50
})

module.exports = conn;