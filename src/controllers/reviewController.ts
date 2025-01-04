import { Restaurant } from './../models/restaurantModel';
import {Request,Response} from 'express';
import * as reviewModel from '../models/reviewModel';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import type { Readable } from 'stream';  // for proper typing
import s3 from '../data/s3';             // v3 S3Client

interface Rating {
  food_name: string;
  rating_value: string;
}

export const addReviewByMenuDateId = async (req: Request, res: Response): Promise<any> => {
  try {
    const { menu_date_id, email, comment, data } = req.body;
    const parsedData = JSON.parse(data);
    const file = req.file;
    const response = {
        menu_date_id,
        email,
        comment,
        photo: file ? `${(req.file as any).key}` : 'NO_PHOTO',
    };
    /*
    
[
  { food_name: '김치찌개', rating_value: '2' },
  { food_name: '불고기', rating_value: '4' },
  { food_name: '찜닭', rating_value: '5' }
]

    */
    const restaurantId = Number((await reviewModel.getRestuarantIdByMenuDateId(menu_date_id))[0].restaurant_id);
    console.log("RestauardId:"+restaurantId);
    console.log(parsedData);
    //이제 이거 mealReview에 insert해서 review_id 받아오기
    console.log(menu_date_id,email,comment,response.photo);
    const review_id = await reviewModel.addMealReveiw(menu_date_id, email, comment, response.photo);
    console.log(review_id);
    const FoodItem = await reviewModel.getFoodItemIdByFoodName(parsedData,restaurantId);
    console.log(FoodItem);

    const merged = parsedData.map((rating: Rating) => {
      const matched = FoodItem.find(item => item.name === rating.food_name);
      return {
        item_id: matched ? Number(matched.item_id) : null, 
        rating_value: Number(rating.rating_value)
      };
    });
    console.log(merged)
    /*
    출력 배열 예시
    [
  { item_id: 1, rating_value: '2' },
  { item_id: 2, rating_value: '4' },
  { item_id: 14, rating_value: '5' }
]
    */
    //reivew_id 이용해서 review_food에 insert하기
    for (const { item_id, rating_value } of merged) {
      try {
        const result = await reviewModel.addFoodReview(review_id, item_id, rating_value);
        console.log(`Review added for item_id ${item_id} with result:`, result);
      } catch (error) {
        console.error(`Error adding review for item_id ${item_id}:`, error);
      }
    }
    res.status(200).json();
  } catch (error) {
    console.error('[getRestaurantRank] error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getReviewByMenuDateId = async (req: Request, res: Response): Promise<any> => {
  try {
    const { menu_date_id } = req.params;
    const mealReviews = await reviewModel.getMealReviewByMenuDateId(Number(menu_date_id));

    const mealReviewsWithFood = await Promise.all(
      mealReviews.map(async (mr) => {
        const foodReviews = await reviewModel.getAllFoodReviewByReviewId(Number(mr.review_id));
        return {
          ...mr,
          food_reviews: foodReviews,
        };
      })
    );

    res.status(200).json({
      meal_reviews: mealReviewsWithFood,
    });
  } catch (error) {
    console.error('[getFoodRank] error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPhotoFromS3 = async (req: Request, res: Response) => {
  try {

    const { key } = req.params;

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    const data = await s3.send(command);

    const stream = data.Body as Readable;

    stream.on('error', (err) => {
      console.error('Stream error:', err);
      res.status(404).json({ error: 'File not found or error streaming file.' });
    });
    stream.pipe(res);
  } catch (error) {
    console.error('S3 error:', error);
    res.status(500).json({ error: 'Error retrieving file from S3.' });
  }
};