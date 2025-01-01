import {Request,Response} from 'express';
import * as restaurantModel from '../models/restaurantModel';

// 모든 식당 조회
export const getAllRestaurants = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await restaurantModel.getAllRestaurants();
    res.status(200).json({ 
      message: "식당 목록", 
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: "Internal server error",
      message: 'maybe database error' });
  }
};

// 식당 단일 조회
export const getRestaurantMealById = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurantId = Number(req.params.restaurantId);
    const rows = await restaurantModel.getRestaurantMealById(restaurantId);

    if (rows.length === 0) {
      res.status(404).json({ message: 'Restaurant not found' });
    }
    
    res.status(200).json({ 
      message: "식사 목록", 
      data: rows,
    });
  } catch (error) {
    console.error('[getRestaurantById] error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//특정 식당의 식단 조회
export const getRestaurantMeals = async (req: Request, res: Response): Promise<void> => {
  try {
    const menu_date_id = Number(req.params.menu_date_id);
    const rows = await restaurantModel.getRestaurantMealFoodByMenuDateId(menu_date_id);

    if (rows.length === 0) {
      res.status(404).json({ message: 'menu_date_id not found' });
    }
    res.status(200).json({ 
      message: "식단 목록", 
      data: rows,
    });
  } catch (error) {
    console.error('[getRestaurantMeals] error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//날짜별 모든 식당의 모든 식사의 모든 식단단 가져오기 - 메인화면을 위한것
//사실상 이거만 쓰면 해결 ㅇㅇ;
export const getAllMeals = async (req: Request, res: Response): Promise<any> => {
  const date = req.query.date as string;

  // 날짜 문자열 유효성 검사 (정확히 YYYY-MM-DD 형식인지 확인)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!date || !dateRegex.test(date)) {
    return res.status(400).json({ error: "Invalid or missing date format. Use YYYY-MM-DD." });
  }

  try {
    const rows = await restaurantModel.getAllMeals(date);
    res.status(200).json({ 
      message: "식단 목록", 
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: "Internal server error",
      message: 'maybe database error' });
  }
};
