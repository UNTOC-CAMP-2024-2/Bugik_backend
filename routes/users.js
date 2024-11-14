const express = require('express');
const router = express.Router();
const conn = require('../db');

router.post('/users',(req,res) => {
    //유저 등록
});

router.get('/users/:id', async (req,res) => {
     //유저 조회
     try {
         const connection = await conn.getConnection();
         const query = 'SELECT * FROM users WHERE student_id = ?';
         const result = await connection.query(query,[req.params['id']]);
         console.log(result);
         res.json(result);
         connection.release();
     } catch(err) {
         console.log(error);
         res.status(500).send("error 나삣노");
     }
});

router.put('/users/:id',(req,res) => {
    //언젠간 만들 유저 수정 기능
})


router.delete('/users/:id',(req,res) => {
    //언젠간 만들 유저 탈퇴 기능
})


module.exports = router;
