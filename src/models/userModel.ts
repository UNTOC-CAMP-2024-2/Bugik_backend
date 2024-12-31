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

//이메일 중복 검사
export const isEmailTaken = async (
  email: string
): Promise<boolean> => {
  const query = `SELECT email FROM users WHERE email = ?`;
  const [rows] = await db.execute<RowDataPacket[]>(query, [email]);
  // 어차피 유니크라 1개 아니면 0개
  return rows.length == 1;
}

//인증 코드 db에 추가
export const createVerifyCode = async (
  email: string,
  verificationCode: string,
  expiresAt: Date
): Promise<ResultSetHeader> => {
  await db.execute<ResultSetHeader>('DELETE FROM email_verifications WHERE email = ?', [email]);
  const [result] = await db.execute<ResultSetHeader>('INSERT INTO email_verifications (email, code, expires_at) VALUES (?, ?, ?)', [
            email,
            verificationCode,
            expiresAt,
        ]);
  return result;
};

//인증 코드 얻기
export const getVerifyCode = async (
  email: string
): Promise<RowDataPacket[]> => {
  const [rows] = await db.execute<RowDataPacket[]>( 'SELECT code, expires_at, verified FROM email_verifications WHERE email = ?',
    [email]);
  return rows;
};

//인증 완료 처리
export const updateVerifyCode = async (
  email: string
): Promise<ResultSetHeader> => {
  const [result] = await db.execute<ResultSetHeader>('UPDATE email_verifications SET verified = 1 WHERE email = ?', [email]);
  return result;
};

// 유저 생성
export const createUser = async (
  email: string,
  nickname: string,
  college: string,
): Promise<ResultSetHeader> => {
  const query = `
    INSERT INTO users (email, nickname, college)
    VALUES (?, ?, ?)
  `;
  const [result] = await db.execute<ResultSetHeader>(query, [
   email,nickname,college
  ])
  return result;
};

// 로그인 정보 확인
export const loginByUserId = async (
  email: string,
  nickname: string,
): Promise<RowDataPacket[]> => {
  const query = `
    SELECT * FROM users WHERE email = ? and nickname = ?
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query, [email,nickname]);
  return rows;
};

export const getUserById = async (
  id: number
): Promise<RowDataPacket[]> => {
  const query = `
    SELECT * FROM users WHERE id = ?
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
  return rows;
};

export const getUserByMail = async (
  email: string,
): Promise<RowDataPacket[]> => {
  const query = `
    SELECT * FROM users WHERE email = ?
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query, [email]);
  return rows;
};

export const updateUserById = async (
  id: number,
  nickname: string,
  college: string,
): Promise<RowDataPacket[]> => {
  const query = `
    UPDATE users SET nickname = ?, college = ? WHERE id = ?
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query, [nickname,college,id]);
  return rows;
};

