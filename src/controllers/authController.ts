import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import { createVerifyCode,getVerifyCode,loginByUserId, updateVerifyCode,createUser, getUserById, updateUserById, getUserByMail,isNicknameTaken } from "../models/userModel";
import axios from "axios";
import * as auth from "../utils/jwt";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/jwt';
import {
  storeRefreshToken,
  verifyStoredRefreshToken,
  deleteRefreshToken,
} from '../utils/refreshTokenStore';
const { REFRESH_TOKEN_SECRET } = process.env;

interface RefreshTokenDecoded {
  id: number; 
  iat?: number;
  exp?: number;
}

//email 회원가입 및 로그인
export const createUserByEmail = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {email,nickname,college} = req.body;
    //유효성 검사 추가. 아무나 해주세요.
    const result = await createUser(email,nickname,college);
    //에러 핸들링 아무나..
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
      message: "maybe db error?",
    });
  }
};

//로그인
export const loginByEmail = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {email,nickname} = req.body;
    const user = await loginByUserId(
      email,nickname
    );
    if (!user) {
      res.status(404).json({
        error: "No User",
        message: "User not found",
      });
    }
    const db_user = {
      id: user[0].id,
      email:  user[0].email,
      nickname:  user[0].nickname,
      college:  user[0].college,
    }

    if(!db_user || !db_user.id || !db_user.email || !db_user.nickname || !db_user.college) {      
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid user data",
      });
    };

    const accessPayload: auth.AccessTokenPayload = {
      id: db_user.id,
      email: db_user.email,
      nickname: db_user.nickname,
      college: db_user.college,
    };
    const accessToken = auth.generateAccessToken(accessPayload);

    const refreshPayload: auth.RefreshTokenPayload = {
      id: db_user.id,
    }
    const refreshToken = generateRefreshToken(refreshPayload);
    await storeRefreshToken(refreshToken, db_user.id, 60 * 60 * 24 * 30);
    return res.status(200).json({  message: 'Login successful',
      accessToken,
      refreshToken,});
  } catch (error) {
    console.error(error);
    return res.status(500).json({
        error: "Internal server error",
        message: "maybe db error?",
      });
  }
};

// kakao 회원가입 및 로그인
export const KakaoRedirect = (req: Request, res: Response): any => {
  const REST_API_KEY = process.env.KAKAO_REST_API_KEY;
  const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  res.redirect(kakaoAuthURL);
};

export const KakaoCallback = async (
  req: Request,
  res: Response
): Promise<any> => {
  const REST_API_KEY = process.env.KAKAO_REST_API_KEY;
  const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
  const { code } = req.query;
  const tokenResponse = await axios.post(
    "https://kauth.kakao.com/oauth/token",
    null,
    {
      params: {
        grant_type: "authorization_code",
        client_id: REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        code: code,
      },
      headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );
  const { access_token } = tokenResponse.data;
  const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });

  const kakaoUser = userResponse.data;
  const kakaoEmail = kakaoUser.kakao_account?.email || '';
  console.log(kakaoEmail)
  const result = await getUserByMail(kakaoEmail);
  //유저 정보가 없는 경우
  if (!result) {
    const uniqueNickName = uuidv4();
    console.log(`Generated UUID: ${uniqueNickName}`);
    await createUser(kakaoEmail,uniqueNickName,'미정');

    //정보들과 함께 추가 정보 받는 창으로 리다이렉션 시키기
    return res.redirect("http://localhost:3000");
  }
  //유저 정보가 있는 경우
  const {id,email,nickname,college} = result[0];
  const db_user = {
    id: id,
    email: email,
    nickname: nickname,
    college: college,
  }
  if(!db_user || !db_user.id || !db_user.email || !db_user.nickname || !db_user.college) {      
    return res.status(400).json({
      error: "Bad Request",
      message: "Invalid user data",
    });
  };
  const accessPayload: auth.AccessTokenPayload = {
    id: db_user.id,
    email: db_user.email,
    nickname: db_user.nickname,
    college: db_user.college,
  };
  const accessToken = auth.generateAccessToken(accessPayload);

  const refreshPayload: auth.RefreshTokenPayload = {
    id: db_user.id,
  }
  const refreshToken = generateRefreshToken(refreshPayload);
  await storeRefreshToken(refreshToken, db_user.id, 60 * 60 * 24 * 30);
  //이 정보들을 가지고 리다이렉션 시키기
  return res.redirect("http://localhost:3000");
};

export const KakaoPatch = async (
  req: Request,
  res: Response
): Promise<any> => {
  //추가 정보 받는칸에서 정보 들어오면 수정하는 역할.
  try {
    const {id,nickname,college} = req.body;
    const result = await updateUserById(id,nickname,college);
    if (!result) {
      return res.status(404).json({
        error: "No User",
        message: "User not found",
      });
    }
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
      message: "maybe db error",
    });
  }
};

export const sendEmailCode = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    //이거 에러 핸들링을 다 추가해야하는데 일단 구현 위주로 하겠습니다.
    console.log(createVerifyCode(email,verificationCode,expiresAt));
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'BUGIK 회원가입 이메일 인증코드입니다.',
        text: `인증코드는 ${verificationCode} 입니다. 5분 후에 인증코드가 만료됩니다.`,
    };
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: `Verification email sent.` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
      message: "maybe db error",
    });
  }
};

export const verifyEmailCode = async (
  req: Request,
  res: Response
): Promise<any> => {
    try {
        const { email,code } = req.body;
        const rows = await getVerifyCode(email);
        if(rows.length === 0) {
            return res.status(500).json({
                error: "No verification code",
                message: "No verification code found for this email.",
              });
        }
        const { code: storedCode, expires_at: expiresAt, verified } = rows[0];

        if (verified) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Email is already verified.",
            });
        }
        
        if (storedCode !== code) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "Invalid verification code.",
            });
        }
        
        if (new Date() > new Date(expiresAt)) {
            return res.status(410).json({
                error: "Gone",
                message: "Verification code has expired. Please request a new code.",
            });
        }
        
        await updateVerifyCode(email);
        return res
          .status(200)
          .json({ message: `Email verified successfully.` });

      } catch (error) {
        console.log(error);
        return res.status(500).json({
          error: "Internal server error",
          message: "maybe db error",
        });
      }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Refresh token is required.",
      });
    }

    //redis에 저장된 refresh token이 유효한지 확인
    const isRefreshTokenValid = await verifyStoredRefreshToken(refreshToken);
    if (!isRefreshTokenValid) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid refresh token.",
      });
    }
    if (!REFRESH_TOKEN_SECRET) {
      throw new Error('REFRESH_TOKEN_SECRET is not defined');
    }
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as RefreshTokenDecoded;
    const { id } = decoded; 
    const result = await getUserById(id);
    if (!result) {
      return res.status(404).json({
        error: "No User",
        message: "User not found",
      });
    }
    const user = {
      id: result[0].id,
      email: result[0].email,
      nickname: result[0].nickname,
      college: result[0].college,
    };
    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      college: user.college,
    });

    return res.status(200).json({
      message: 'New access token issued',
      accessToken: newAccessToken,
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
      message: "maybe db error?",
    });
  }
};

export const logout = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }
    // Redis에서 해당 refresh token 삭제
    await deleteRefreshToken(refreshToken);

    return res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};