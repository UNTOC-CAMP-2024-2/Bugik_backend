import db from '../data/db';
import { RowDataPacket } from 'mysql2';

// 식당 랭킹 조회
export const getRestaurantRanking = async (): Promise<RowDataPacket[]> => {
  const query = `
    SELECT
      r.name AS restaurant_name,
      SUM(fr.rating_value) / COUNT(fr.rating_value) AS average_rating
    FROM meal_reviews mr
    JOIN restaurants_meal rm
      ON mr.menu_date_id = rm.menu_date_id
    JOIN food_reviews fr
      ON mr.review_id = fr.review_id
    JOIN restaurants r
      ON rm.restaurant_id = r.restaurant_id
    GROUP BY rm.restaurant_id, r.name
    ORDER BY average_rating DESC;
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query);
  return rows;
};

export const getRestaurantRankingDorm = async (): Promise<RowDataPacket[]> => {
  const query = `
    SELECT
      r.name AS restaurant_name,
      SUM(fr.rating_value) / COUNT(fr.rating_value) AS average_rating
    FROM meal_reviews mr
    JOIN restaurants_meal rm
      ON mr.menu_date_id = rm.menu_date_id
    JOIN food_reviews fr
      ON mr.review_id = fr.review_id
    JOIN restaurants r
      ON rm.restaurant_id = r.restaurant_id
	  WHERE r.type = "기숙사"
    GROUP BY rm.restaurant_id, r.name
    ORDER BY average_rating DESC;
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query);
  return rows;
};

export const getRestaurantRankingUni = async (): Promise<RowDataPacket[]> => {
  const query = `
    SELECT
      r.name AS restaurant_name,
      SUM(fr.rating_value) / COUNT(fr.rating_value) AS average_rating
    FROM meal_reviews mr
    JOIN restaurants_meal rm
      ON mr.menu_date_id = rm.menu_date_id
    JOIN food_reviews fr
      ON mr.review_id = fr.review_id
    JOIN restaurants r
      ON rm.restaurant_id = r.restaurant_id
	  WHERE r.type = "학교식당"
    GROUP BY rm.restaurant_id, r.name
    ORDER BY average_rating DESC;
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query);
  return rows;
};
// 음식 랭킹 조회
export const getMenuRanking = async (): Promise<RowDataPacket[]> => {
  const query = `
   Select 
      fi.name,
      SUM(fr.rating_value) / COUNT(fr.rating_value) AS average_rating,
      r.name
    FROM food_reviews fr
    JOIN food_info fi
      ON fi.item_id = fr.item_id
    JOIN restaurants r
      ON fi.restaurant_id = r.restaurant_id
    GROUP BY fr.item_id
    ORDER BY average_rating DESC;
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query);
  return rows;
};
