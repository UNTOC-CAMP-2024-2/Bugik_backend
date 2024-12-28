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
      message: '미안하다 나도 무슨 오류인지 모르겠다' });
  }
};


// 식당 단일 조회
export const getRestaurantById = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurantId = Number(req.params.restaurantId);
    const rows = await restaurantModel.getRestaurantById(restaurantId);

    if (rows.length === 0) {
      res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('[getRestaurantById] error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


//특정 식당의 식단 조회
export const getRestaurantMeals = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurantId = Number(req.params.restaurantId);
    // query string으로 date나 time을 받으면 아래처럼
    // const { date, time } = req.query;

    // 아래는 모델에 구현된 함수가 없으므로 가상의 코드
    // const meals = await mealModel.getMealsByRestaurantId(restaurantId, date, time);

    res.status(200).json({
      message: 'Here you can implement logic for restaurant meals',
      // data: meals
    });
  } catch (error) {
    console.error('[getRestaurantMeals] error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 특정 식당의 특정 날짜 식단 상세
export const getSingleMeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurantId = Number(req.params.restaurantId);
    const menuDateId = Number(req.params.menuDateId);

    // 아래는 모델이 없으므로, 실제로는 mealModel.getMealDetail(...) 등 호출
    // const mealDetail = await mealModel.getMealDetail(restaurantId, menuDateId);

    res.status(200).json({
      message: 'Single meal detail logic to be implemented',
      // data: mealDetail
    });
  } catch (error) {
    console.error('[getSingleMeal] error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
