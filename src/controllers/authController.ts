import { Request, Response } from "express";
import { createVerifyCode,getVerifyCode,loginByUserId, updateVerifyCode,createUser } from "src/models/userModel";
import axios from "axios";
import * as auth from "../utils/jwt";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

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
    const token = auth.generateToken({
      user_id: user[0]["email"],
      belonging_uni: user[0]["nickname"],
    });
    res.status(200).json(token);
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
  const kakaoId = kakaoUser.id;
  console.log(kakaoId);
  return res.redirect("http://localhost:3000");
};

export const KakaoPatch = async (
  req: Request,
  res: Response
): Promise<any> => {

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
): Promise<any> => {};
