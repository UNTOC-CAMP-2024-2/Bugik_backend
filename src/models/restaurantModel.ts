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

// 식당 단일 조회 by ID
export const getRestaurantMealById = async (restaurantId: number): Promise<RowDataPacket[]> => {
  const query = `
    SELECT
      restaurant_id, 
      menu_date_id,
      date,
      time  
    FROM restaurants_meal
    WHERE restaurant_id = ?
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query, [restaurantId]);
  return rows;
};

export const getRestaurantMealFoodByMenuDateId = async (menu_date_id: number): Promise<RowDataPacket[]> => {
  const query = `
    SELECT
      rmf.menu_date_id,
      rmf.mealtype,
      rmf.item_id,
      fi.name,
      fi.explanation
    FROM restaurants_meal_food AS rmf
    JOIN food_info AS fi
    ON rmf.item_id = fi.item_id
    WHERE rmf.menu_date_id = ?
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query, [menu_date_id]);
  return rows;
};

//날짜별 모든 식당의 모든 식사의 모든 식단단 가져오기 - 메인화면을 위한것
export const getAllMeals = async (date: Date | string): Promise<RowDataPacket[]> => {
  //아마 캐싱을 해야할듯
  const query = `
   SELECT 
    rm.menu_date_id,
    rm.restaurant_id,
    rm.date,
    r.name AS restaurant_name,
    r.type AS restaurant_type,
    rm.time,
    rmf.mealtype,
    rmf.item_id,
    fi.name AS food_name,
    fi.explanation AS food_explanation
  FROM 
    restaurants_meal AS rm
  JOIN 
    restaurants AS r
  ON 
    rm.restaurant_id = r.restaurant_id
  JOIN 
    restaurants_meal_food AS rmf
  ON 
    rm.menu_date_id = rmf.menu_date_id
  JOIN 
    food_info AS fi
  ON 
    rmf.item_id = fi.item_id
  WHERE 
    rm.date = ?;
  `;
  console.log(date);
  const [rows] = await db.execute<RowDataPacket[]>(query,[date]);
  return rows;
};


