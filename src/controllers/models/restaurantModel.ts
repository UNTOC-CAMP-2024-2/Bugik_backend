import { createPool } from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config();

// DB 연결 풀 생성
const dbConnection = createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

// 특정 날짜와 시간에 맞는 메뉴 조회 함수
export const getAllMeals = async (targetDate: string, targetTime: string) => {
  const connection = await dbConnection.getConnection();

  try {
    const query = `
      SELECT 
        r.restaurant_id,
        r.name AS restaurant_name,
        rm.date,
        rm.time,
        f.name AS food_name
      FROM 
        restaurants_meal rm
      JOIN 
        restaurants r ON rm.restaurant_id = r.restaurant_id
      JOIN 
        restaurants_meal_food rmf ON rm.menu_date_id = rmf.menu_date_id
      JOIN 
        food_info f ON rmf.item_id = f.item_id
      WHERE 
        rm.date = ?
        AND rm.time = ?
      ORDER BY 
        r.restaurant_id;
    `;

    const [results]: any[] = await connection.execute(query, [targetDate, targetTime]);

    // 데이터를 식당별로 그룹화
    const groupedData: { [key: string]: any } = {};

    results.forEach((row: any) => {
      const restaurantId = row.restaurant_id;
      const restaurantName = row.restaurant_name;

      if (!groupedData[restaurantId]) {
        groupedData[restaurantId] = {
          restaurant_name: restaurantName,
          menus: [],
        };
      }

      groupedData[restaurantId].menus.push({
        food_name: row.food_name,
      });
    });

    return groupedData;

  } catch (error) {
    console.error("Error fetching menus:", error);
    throw new Error("Failed to fetch menus");
  } finally {
    connection.release();
  }
};
