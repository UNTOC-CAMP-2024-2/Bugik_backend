/*
참고 자료 정리
https://velog.io/@hangem422/clean-code-comment (주석 다는법)
https://velog.io/@penrose_15/Nodejs-mysql2-%EC%84%A4%EC%A0%95-%EB%B0%8F-%ED%8A%B8%EB%9E%9C%EC%9E%AD%EC%85%98 mysql2
*/

const mysql = require('mysql2/promise');
const express = require('express');
const app = express();

require('dotenv').config();

app.use(express.json()); 

const conn = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: 3306,
})

//connection 생성
const getConnection = async () => { 
    try {
        const connection = await conn.getConnection();
        return connection;
    } catch (error) {
        console.error(`connection error : ${error.message}`);
        return null;
    }
};

/*
아마 나중에 ORM 써서 리팩토링 할꺼같은데 일단 그냥 SQL문 써서 개발하는걸로 해요

const result = async () => {
    const connection = await getConnection();
    try {
        await connection.beginTransaction(); //트랜잭션 begin
      	const query = `SELECT * FROM USER WHERE name = ? AND email = ?`;
      	const data = ['potato','potato@potato.com'];
      	const result = await connection.query(query, data);
   
        await connection.commit(); //commit

        return result;
    } catch (err) {
        console.log("rollback connection");
        await connection.rollback(); // rollback
        console.error("db error : ", err);
    } finally {
        console.log("release connection");
        connection.release(); //connection release
    }
}
*/

app.get('/users', (req,res) => {

})

app.get('/notice', (req,res) => {

})

app.get("/menu", (req,res) => {

})

app.get('/comment', (req,res) => {

})

app.listen(3000, () => {

    console.log("Server port 3000");
})