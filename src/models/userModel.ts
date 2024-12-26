import db from '../data/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// 유저 생성
export const createUser = async (
  student_id: number,
  belonging_uni: string,
  nickname: string
): Promise<ResultSetHeader> => {
  const query = `
    INSERT INTO users (student_id, belonging_uni, nickname)
    VALUES (?, ?, ?)
  `;
  const [result] = await db.execute<ResultSetHeader>(query, [
    student_id,
    belonging_uni,
    nickname,
  ]);
  return result;
};

// 유저 중복 체크 or 단일 유저 조회 등 필요시 추가
export const getUserByStudentId = async (
  student_id: number
): Promise<RowDataPacket[]> => {
  const query = `
    SELECT * FROM users WHERE student_id = ?
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query, [student_id]);
  return rows;
};
