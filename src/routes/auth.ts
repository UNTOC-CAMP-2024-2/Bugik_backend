import { Router } from 'express';
import * as authController from '../controllers/authController';

const authRouter = Router();

// /api/v1/auth/...

/**
 * @swagger
 * /auth/kakao:
 *   get:
 *     summary: 카카오 로그인 페이지로 리디렉션
 *     description: 사용자를 카카오 로그인 페이지로 리디렉션하여 OAuth 로그인 프로세스를 시작합니다.
 *     responses:
 *       302:
 *         description: 카카오 로그인 페이지로 성공적으로 리디렉션되었습니다.
 */
authRouter.get('/kakao', authController.KakaoRedirect);

/**
 * @swagger
 * /auth/kakao/callback:
 *   get:
 *     summary: 카카오 로그인 콜백
 *     description: 카카오 OAuth 로그인 콜백을 처리하고 사용자 데이터를 처리합니다.
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: 카카오에서 제공하는 인증 코드.
 *     responses:
 *       200:
 *         description: 로그인 성공 및 메인 페이지로 리디렉션되었습니다.
 *       400:
 *         description: 잘못된 또는 누락된 인증 코드로 인해 잘못된 요청입니다.
 *       500:
 *         description: 로그인 처리 중 내부 서버 오류가 발생했습니다.
 */
authRouter.get('/kakao/callback', authController.KakaoCallback);

/**
 * @swagger
 * /auth/kakao:
 *   patch:
 *     summary: 카카오 사용자 정보 업데이트
 *     description: 카카오 로그인 후 사용자 정보를 업데이트합니다(예: 닉네임 또는 대학 정보).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 description: 사용자 ID.
 *               nickname:
 *                 type: string
 *                 description: 업데이트할 사용자 닉네임.
 *               college:
 *                 type: string
 *                 description: 업데이트할 사용자 대학 정보.
 *     responses:
 *       200:
 *         description: 사용자 정보가 성공적으로 업데이트되었습니다.
 *       404:
 *         description: 사용자를 찾을 수 없습니다.
 *       500:
 *         description: 사용자 정보 업데이트 중 내부 서버 오류가 발생했습니다.
 */
authRouter.patch('/kakao', authController.KakaoPatch);

/**
 * @swagger
 * /auth/email:
 *   post:
 *     summary: 이메일로 사용자 등록
 *     description: 이메일, 닉네임, 대학 정보를 사용하여 새 사용자를 등록합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 사용자 이메일 주소.
 *               nickname:
 *                 type: string
 *                 description: 사용자가 원하는 닉네임.
 *               college:
 *                 type: string
 *                 description: 사용자의 대학 정보.
 *     responses:
 *       201:
 *         description: 사용자가 성공적으로 등록되었습니다.
 *       400:
 *         description: 잘못된 입력 데이터로 인해 잘못된 요청입니다.
 *       500:
 *         description: 사용자 등록 중 내부 서버 오류가 발생했습니다.
 */
authRouter.post('/email', authController.createUserByEmail);

/**
 * @swagger
 * /auth/email/login:
 *   post:
 *     summary: 이메일로 사용자 로그인
 *     description: 이메일과 닉네임을 사용하여 사용자를 인증합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 사용자 이메일 주소.
 *               nickname:
 *                 type: string
 *                 description: 사용자 닉네임.
 *     responses:
 *       200:
 *         description: 사용자가 성공적으로 로그인되었으며 액세스 및 리프레시 토큰이 발급되었습니다.
 *       404:
 *         description: 사용자를 찾을 수 없습니다.
 *       400:
 *         description: 잘못된 입력 데이터로 인해 잘못된 요청입니다.
 *       500:
 *         description: 사용자 로그인 중 내부 서버 오류가 발생했습니다.
 */
authRouter.post('/email/login', authController.loginByEmail);

/**
 * @swagger
 * /auth/email/auth:
 *   post:
 *     summary: 이메일 인증 코드 전송
 *     description: 제공된 이메일 주소로 인증 코드를 전송합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 인증 코드를 전송할 이메일 주소.
 *     responses:
 *       200:
 *         description: 인증 코드가 성공적으로 전송되었습니다.
 *       400:
 *         description: 잘못된 또는 누락된 이메일 주소로 인해 잘못된 요청입니다.
 *       500:
 *         description: 인증 코드 전송 중 내부 서버 오류가 발생했습니다.
 */
authRouter.post('/email/auth', authController.sendEmailCode);

/**
 * @swagger
 * /auth/email/verify:
 *   post:
 *     summary: 이메일 코드 인증
 *     description: 제공된 인증 코드를 검증하여 이메일을 인증합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 인증할 이메일 주소.
 *               code:
 *                 type: string
 *                 description: 이메일 주소로 전송된 인증 코드.
 *     responses:
 *       200:
 *         description: 이메일이 성공적으로 인증되었습니다.
 *       400:
 *         description: 잘못된 인증 코드이거나 이미 인증된 이메일입니다.
 *       410:
 *         description: 인증 코드가 만료되었습니다.
 *       500:
 *         description: 이메일 인증 중 내부 서버 오류가 발생했습니다.
 */
authRouter.post('/email/verify', authController.verifyEmailCode);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: 사용자 로그아웃
 *     description: 리프레시 토큰을 무효화하여 사용자를 로그아웃합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: 무효화할 리프레시 토큰.
 *     responses:
 *       200:
 *         description: 사용자가 성공적으로 로그아웃되었습니다.
 *       400:
 *         description: 누락되었거나 잘못된 리프레시 토큰.
 *       500:
 *         description: 사용자 로그아웃 중 내부 서버 오류가 발생했습니다.
 */
authRouter.post('/logout', authController.logout);

/**
 * @swagger
 * /auth/token/refresh:
 *   post:
 *     summary: 인증 토큰 갱신
 *     description: 유효한 리프레시 토큰을 사용하여 새 액세스 토큰을 생성합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: 새 액세스 토큰을 생성하는 데 사용될 리프레시 토큰.
 *     responses:
 *       200:
 *         description: 새 액세스 토큰이 성공적으로 발급되었습니다.
 *       400:
 *         description: 누락되었거나 잘못된 리프레시 토큰.
 *       401:
 *         description: 잘못되었거나 만료된 리프레시 토큰으로 인해 인증되지 않았습니다.
 *       500:
 *         description: 토큰 갱신 중 내부 서버 오류가 발생했습니다.
 */
authRouter.post('/token/refresh', authController.refreshToken);

export default authRouter;
