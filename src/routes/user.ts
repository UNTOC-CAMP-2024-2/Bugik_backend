import { Router } from 'express';
import * as userController from '../controllers/userController';

const userRouter = Router();

/**
 * @swagger
 * /checkUsername/{nickname}:
 *   get:
 *     summary: 닉네임 중복 확인
 *     description: 제공된 닉네임이 이미 사용 중인지 확인합니다.
 *     parameters:
 *       - in: path
 *         name: nickname
 *         required: true
 *         schema:
 *           type: string
 *         description: 확인하려는 닉네임.
 *     responses:
 *       200:
 *         description: 닉네임이 사용 가능함.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 닉네임 사용 가능 여부 메시지.
 *       409:
 *         description: 닉네임이 이미 사용 중임.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: 오류 설명.
 *                 message:
 *                   type: string
 *                   description: 닉네임 중복 오류 메시지.
 *       500:
 *         description: 서버 내부 오류.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: 오류 설명.
 *                 message:
 *                   type: string
 *                   description: 추가 오류 메시지.
 */
userRouter.get('/checkUsername/:nickname', userController.checkUserName);

/**
 * @swagger
 * /checkEmail/{email}:
 *   get:
 *     summary: 이메일 중복 확인
 *     description: 제공된 이메일이 이미 사용 중인지 확인합니다.
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: 확인하려는 이메일 주소.
 *     responses:
 *       200:
 *         description: 이메일이 사용 가능함.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 이메일 사용 가능 여부 메시지.
 *       409:
 *         description: 이메일이 이미 사용 중임.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: 오류 설명.
 *                 message:
 *                   type: string
 *                   description: 이메일 중복 오류 메시지.
 *       500:
 *         description: 서버 내부 오류.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: 오류 설명.
 *                 message:
 *                   type: string
 *                   description: 추가 오류 메시지.
 */
userRouter.get('/checkEmail/:email', userController.checkEmail);

export default userRouter;