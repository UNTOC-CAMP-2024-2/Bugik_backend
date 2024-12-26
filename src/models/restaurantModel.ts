import db from '../data/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Restaurant {
  restaurant_id?: number; 
  name: string;
  type: '기숙사' | '학교식당';  
}

// 모든 식당 조회
export const getAllRestaurants = async (): Promise<RowDataPacket[]> => {
  const query = `
    SELECT 
      restaurant_id,
      name,
      type
    FROM restaurants
    ORDER BY restaurant_id ASC
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query);
  return rows;
};

// 식당 생성
export const createRestaurant = async (restaurant: Restaurant): Promise<ResultSetHeader> => {
  const { name, type } = restaurant;
  const query = `
    INSERT INTO restaurants (name, type)
    VALUES (?, ?)
  `;
  const [result] = await db.execute<ResultSetHeader>(query, [name, type]);
  return result;
};

// 식당 단일 조회 by ID
export const getRestaurantById = async (restaurantId: number): Promise<RowDataPacket[]> => {
  const query = `
    SELECT 
      restaurant_id,
      name,
      type
    FROM restaurants
    WHERE restaurant_id = ?
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query, [restaurantId]);
  return rows;
};

// 4) 식당 수정
export const updateRestaurant = async (
  restaurantId: number,
  restaurant: Restaurant
): Promise<ResultSetHeader> => {
  const { name, type } = restaurant;
  const query = `
    UPDATE restaurants
    SET name = ?, type = ?
    WHERE restaurant_id = ?
  `;
  const [result] = await db.execute<ResultSetHeader>(query, [name, type, restaurantId]);
  return result;
};

// 5) 식당 삭제
export const deleteRestaurant = async (
  restaurantId: number
): Promise<ResultSetHeader> => {
  const query = `
    DELETE FROM restaurants
    WHERE restaurant_id = ?
  `;
  const [result] = await db.execute<ResultSetHeader>(query, [restaurantId]);
  return result;
};
