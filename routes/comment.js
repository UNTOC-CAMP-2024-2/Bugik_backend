const express = require('express');
const router = express.Router();
const conn = require('../db');

router.post('/comment',(req,res) => {
    //리뷰 추가
});

router.get('/comment/:where/:food', async (req,res) => {
    //특정 음식 리뷰 rate 구하기
     try {
         const connection = await conn.getConnection();
         const query = 'SELECT SUM(rate) FROM comment WHERE restaurant = ? AND menu = ?';
         const result = await connection.query(query,[req.params['where'],req.params['food']]);
         console.log(result);
         res.json(result);
         connection.release();
     } catch(err) {
         console.log(error);
         res.status(500).send("error 나삣노");
     }
});

router.put('/comment/:where/:food',(req,res) => {
    //언젠간 만들 리뷰 정보 수정
});

router.delete('/comment/:where/:food',(req,res) => {
    //언젠간 만들 리뷰 정보 삭제
});

module.exports = router;
