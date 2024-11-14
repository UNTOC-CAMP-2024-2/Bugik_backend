const express = require('express');
const router = express.Router();
const conn = require('../db');

router.post('/menu',(req,res) => {
    //menu 추가
});

router.get('/menu/:where/:date', async (req,res) => {
    //특정 날짜 menu 조회
     try {
         const connection = await conn.getConnection();
         const query = 'SELECT * FROM menu WHERE restaurant = ? AND date = ?;';
         const result = await connection.query(query,[req.params['where'],req.params['date']]);
         console.log(result);
         res.json(result);
         connection.release();
     } catch(err) {
         console.log(error);
         res.status(500).send("error 나삣노");
     }
});

router.put('/menu/:where/:food',(req,res) => {
    //언젠간 만들 음식 정보 수정
});

router.delete('/menu/:where/:food',(req,res) => {
    //언젠간 만들 음식 정보 삭제
});

module.exports = router;
