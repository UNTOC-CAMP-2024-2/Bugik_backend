import {Request,Response} from 'express';
import * as restaurantModel from '../models/restaurantModel';

//
// 1) 모든 식당 조회
//
export const getAllRestaurants = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await restaurantModel.getAllRestaurants();
    res.status(200).json({
      data: rows,
    });
  } catch (error) {
    console.error('[getAllRestaurants] error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//
// 2) 식당 생성
//
export const createRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    // body로부터 name, type 추출
    const { name, type } = req.body;
    // 유효성 검증 로직 (type이 '기숙사'/'학교식당' 이외면 에러 등)
    // ...

    // Model 호출
    await restaurantModel.createRestaurant({ name, type });

    res.status(201).json({
      message: 'Restaurant created successfully',
    });
  } catch (error) {
    console.error('[createRestaurant] error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//
// 3) 식당 단일 조회
//
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

//
// 4) 식당 수정 (선택사항)
//
export const updateRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurantId = Number(req.params.restaurantId);
    const { name, type } = req.body;

    // DB 업데이트
    const result = await restaurantModel.updateRestaurant(restaurantId, { name, type });
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json({ message: 'Restaurant updated successfully' });
  } catch (error) {
    console.error('[updateRestaurant] error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//
// 5) 식당 삭제 (선택사항)
//
export const deleteRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurantId = Number(req.params.restaurantId);
    const result = await restaurantModel.deleteRestaurant(restaurantId);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('[deleteRestaurant] error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//
// 6) (예시) 특정 식당의 식단 조회
//    restaurants_meal 테이블 등을 JOIN하는 로직이 필요하면 추가
//
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

//
// 7) (예시) 특정 식당의 특정 날짜 식단 상세
//
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
