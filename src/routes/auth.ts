import { Router } from 'express';
import * as authController from '../controllers/authController';

const authRouter = Router();

// /api/v1/auth/...

/**
 * @swagger
 * /auth/kakao:
 *   get:
 *     summary: Kakao login redirect
 *     responses:
 *       302:
 *         description: Redirect to Kakao login
 */
authRouter.get('/kakao', authController.KakaoRedirect);

/**
 * @swagger
 * /auth/kakao/callback:
 *   get:
 *     summary: Kakao login callback
 *     responses:
 *       200:
 *         description: Successful Kakao login
 */
authRouter.get('/kakao/callback', authController.KakaoCallback);

/**
 * @swagger
 * /auth/kakao:
 *   patch:
 *     summary: Update Kakao user information
 *     responses:
 *       200:
 *         description: User information updated
 */
authRouter.patch('/kakao', authController.KakaoPatch);

/**
 * @swagger
 * /auth/email:
 *   post:
 *     summary: Register user by email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               nickname:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 */
authRouter.post('/email', authController.createUserByEmail);

/**
 * @swagger
 * /auth/email/login:
 *   post:
 *     summary: Login user by email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in
 */
authRouter.post('/email/login', authController.loginByEmail);

/**
 * @swagger
 * /auth/email/auth:
 *   post:
 *     summary: Send email verification code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification code sent
 */
authRouter.post('/email/auth', authController.sendEmailCode);

/**
 * @swagger
 * /auth/email/verify:
 *   post:
 *     summary: Verify email code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified
 */
authRouter.post('/email/verify', authController.verifyEmailCode);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     responses:
 *       200:
 *         description: User logged out
 */
authRouter.post('/logout', authController.logout);

/**
 * @swagger
 * /auth/token/refresh:
 *   post:
 *     summary: Refresh authentication token
 *     responses:
 *       200:
 *         description: Token refreshed
 */
authRouter.post('/token/refresh', authController.refreshToken);

export default authRouter;
