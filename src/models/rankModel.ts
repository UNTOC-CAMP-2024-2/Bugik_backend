import db from '../data/db';
import { RowDataPacket } from 'mysql2';

// 식당 랭킹 조회
export const getRestaurantRanking = async (): Promise<RowDataPacket[]> => {
  const query = `
    SELECT 
      rank_id,
      restaurant_id,
      rating_value,
      rank
    FROM restaurant_rank
    ORDER BY rank ASC
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query);
  return rows;
};

// 음식 랭킹 조회
export const getMenuRanking = async (): Promise<RowDataPacket[]> => {
  const query = `
    SELECT 
      rank_id,
      item_id,
      rating_value
    FROM menu_rank
    ORDER BY rating_value DESC
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query);
  return rows;
};
