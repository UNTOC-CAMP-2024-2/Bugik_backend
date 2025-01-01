import {Request,Response} from 'express';
import * as reviewModel from '../models/reviewModel';

export const addReviewByMenuDateId = async (req: Request, res: Response): Promise<any> => {
  try {
    const { menu_date_id, email, comment, data } = req.body;
    const parsedData = JSON.parse(data);
    const file = req.file;
    const response = {
        menu_date_id,
        email,
        comment,
        photo: file ? `/uploads/${file.filename}` : null,
    };
    //이제 이거 mealReview에 insert해서 review_id 받아오기

    //reivew_id 이용해서 review_food에 insert하기

    res.status(200).json();
  } catch (error) {
    console.error('[getRestaurantRank] error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getReviewByMenuDateId = async (req: Request, res: Response): Promise<any> => {
  try {
    //mealReview 에서 menu_date_id로 검색해서 review_id 받아오기
    //foodReview에서 review_id로 검색해서 food review들 받아오기
    res.status(200).json();
  } catch (error) {
    console.error('[getFoodRank] error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
