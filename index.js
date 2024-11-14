const express = require('express');

const usersRouter = require('./routes/users');
const menuRouter = require('./routes/menu');
const noticeRouter = require('./routes/notice');
const commentRouter = require('./routes/comment');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//app.use에서 get하고 post가 안걸러짐
//이유는 나도 모르겠너

app.use('/users',usersRouter);
app.get('/users/:id',usersRouter);
app.post('/users',usersRouter);

app.use('/notice',noticeRouter);
app.get('/notice',noticeRouter);
app.post('/notice',noticeRouter);

app.use('/menu',menuRouter);
app.get('/menu/:where/:date',menuRouter);
app.put('/menu',menuRouter);

app.use('/comment',commentRouter);
app.get('/comment/:where/:food',commentRouter);
app.put('/comment',commentRouter);

app.listen(3000, () => {
    console.log("Server port 3000");
});

/*
내가 볼꺼
https://velog.io/@hangem422/clean-code-comment (주석 다는법)
https://velog.io/@penrose_15/Nodejs-mysql2-%EC%84%A4%EC%A0%95-%EB%B0%8F-%ED%8A%B8%EB%9E%9C%EC%9E%AD%EC%85%98 mysql2
https://velog.io/@somday/RESTful-API-%EC%9D%B4%EB%9E%80 restful api 구조
*/
