const express = require('express');
const router = express.Router();
const conn = require('../db');

router.post('/notice',(req,res) => {
    //notice 추가
});

router.get('/notice', async (req,res) => {
    // 가장 최근 공지 추가
     try {
         const connection = await conn.getConnection();
         const query = 'SELECT * FROM notice order by date asc limit 1;';
         const result = await connection.query(query);
         console.log(result);
         res.json(result);
         connection.release();
     } catch(err) {
         console.log(error);
         res.status(500).send("error 나삣노");
     }
});

router.put('/notice/:id',(req,res) => {
    //언젠간 만들 공지 수정 기능
});

router.delete('/notice/:id',(req,res) => {
    //언젠간 만들 공지 삭제 기능
});

module.exports = router;
