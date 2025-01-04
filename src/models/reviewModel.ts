import db from "../data/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface FoodItem {
  food_name: string;
  rating_value: string;
}

export const getRestuarantIdByMenuDateId = async (
  menu_date_id: number
): Promise<RowDataPacket[]> => {
  const query = `
    SELECT 
      restaurant_id
    FROM restaurants_meal
    WHERE menu_date_id = ?
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query, [menu_date_id]);
  return rows;
};

export const addMealReveiw = async (
  menu_date_id: number,
  email: string,
  comment: string,
  photo_path: string | null
): Promise<number> => {
  const query = `
   INSERT INTO meal_reviews (menu_date_id, email, comment, photo_path) VALUES (?, ?, ?, ?)
  `;
  const [result] = await db.execute<ResultSetHeader>(query, [
    menu_date_id,
    email,
    comment,
    photo_path,
  ]);
  return result.insertId;
};

export const getFoodItemIdByFoodName = async (
  array: FoodItem[],
  restaurant_id: number
): Promise<RowDataPacket[]> => {
  const placeholders = array.map(() => "?").join(", ");
  const foodNames = array.map((item) => item.food_name);
  const query = `
    SELECT 
      item_id,
      name
    FROM food_info
    WHERE name IN (${placeholders}) and restaurant_id = ?
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query, [
    ...foodNames,
    restaurant_id,
  ]);
  return rows;
};

export const addFoodReview = async (
  review_id: number,
  item_id: number,
  rating_value: number
): Promise<RowDataPacket[]> => {
  const query = `
    INSERT INTO food_reviews (review_id,item_id,rating_value) VALUES (?, ?, ?)
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query, [
    review_id,
    item_id,
    rating_value,
  ]);
  return rows;
};

export const getMealReviewByMenuDateId = async (
  menu_date_id: number
): Promise<RowDataPacket[]> => {
  const query = `
    SELECT 
      review_id,
      email,
      comment,
      photo_path,
      review_date
    FROM meal_reviews 
    WHERE menu_date_id = ?
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query, [menu_date_id]);
  return rows;
};

export const getAllFoodReviewByReviewId = async ( review_id:number): Promise<RowDataPacket[]> => {
  const query = `
    SELECT 
      fi.name,
      fr.rating_value
      FROM food_reviews as fr
      JOIN food_info as fi
      ON fr.item_id = fi.item_id
      WHERE fr.review_id = ?;
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query, [review_id]);
  return rows;
}

/*
SELECT
    review_id,
    SUM(rating_value) / COUNT(*) AS average_rating
FROM food_reviews
GROUP BY review_id;

나중에 추가해야할 로직
*/