// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const {
  JWT_SECRET,
  REFRESH_TOKEN_SECRET,
  JWT_EXPIRE,
  REFRESH_TOKEN_EXPIRE
} = process.env;


export interface AccessTokenPayload {
  id: number;       
  email: string;      
  nickname: string;
  college: string;
}

export interface RefreshTokenPayload {
  id: number; 
}

export function generateAccessToken(payload: AccessTokenPayload): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE || '15m', // 기본 15분
  });
}

export function generateRefreshToken(payload: RefreshTokenPayload): string {
  if (!REFRESH_TOKEN_SECRET) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined');
  }

  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRE || '7d', // 기본 7일
  });
}
