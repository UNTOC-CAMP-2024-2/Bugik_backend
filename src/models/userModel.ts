import { EphemeralKeyInfo } from 'tls';
import db from '../data/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

//닉네임 중복 검사
export const isNicknameTaken = async (
  nickname: string
): Promise<boolean> => {
  const query = `SELECT nickname FROM users WHERE nickname = ?`;
  const [rows] = await db.execute<RowDataPacket[]>(query, [nickname]);
  // 어차피 유니크라 1개 아니면 0개
  return rows.length == 1;
}

// 유저 생성
export const createUser = async (
  user_id: number,
  belonging_uni: string,
  nickname: string,
  phone_number: string | null,
  email: string | null
): Promise<ResultSetHeader> => {
  const query = `
    INSERT INTO users (user_id, belonging_uni, nickname, phone_number, email)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await db.execute<ResultSetHeader>(query, [
    user_id,
    belonging_uni,
    nickname,
    phone_number,
    email
  ]);

  return result;
};

// 로그인 정보 확인
export const loginByUserId = async (
  user_id: number,
  belonging_uni: string,
  nickname: string
): Promise<RowDataPacket[]> => {
  const query = `
    SELECT * FROM users WHERE user_id = ? and belonging_uni = ? and nickname = ?
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query, [user_id,belonging_uni,nickname]);
  return rows;
};
