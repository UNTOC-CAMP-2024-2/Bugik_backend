// src/utils/refreshTokenStore.ts
import redisClient from '../data/redis';

/**
 * Refresh Token 저장
 */
export async function storeRefreshToken(
  token: string, //refresh token
  userId: number, //user id
  expireSeconds?: number //expire time
): Promise<void> {
  const key = `refreshToken:${token}`;
  await redisClient.set(key, String(userId));
  console.log("Redis에 Refresh Token 저장 완료");
  if (expireSeconds) {
    await redisClient.expire(key, expireSeconds);
  }
}

/**
 * Refresh Token 검증 (Redis에 해당 토큰이 존재하는지?)
 */
export async function verifyStoredRefreshToken(token: string): Promise<boolean> {
  const key = `refreshToken:${token}`;
  const result = await redisClient.get(key);
  return result !== null; 
}

/**
 * Refresh Token 삭제 (로그아웃 등)
 */
export async function deleteRefreshToken(token: string): Promise<void> {
  const key = `refreshToken:${token}`;
  await redisClient.del(key);
}