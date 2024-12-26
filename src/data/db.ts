import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '1234',
    database: process.env.DATABASE_NAME || 'bugik',
    port: Number(process.env.DATABASE_PORT) || 3306,
});

export default db;