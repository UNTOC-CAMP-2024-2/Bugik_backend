import {Request,Response} from 'express';
import * as rankModel from '../models/rankModel';

export const getRestaurantRank = async (req: Request, res: Response): Promise<void> => {
  try {
    const ranks = await rankModel.getRestaurantRanking();
    res.status(200).json({ data: ranks });
  } catch (error) {
    console.error('[getRestaurantRank] error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRestaurantRankDorm = async (req: Request, res: Response): Promise<void> => {
  try { 
    const ranks = await rankModel.getRestaurantRankingDorm();
    res.status(200).json({ data: ranks });
  } catch (error) {
    console.error('[getRestaurantRank] error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRestaurantRankUni = async (req: Request, res: Response): Promise<void> => {
  try {
    const ranks = await rankModel.getRestaurantRankingUni();
    res.status(200).json({ data: ranks });
  } catch (error) {
    console.error('[getRestaurantRank] error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFoodRank = async (req: Request, res: Response): Promise<void> => {
  try {
    const ranks = await rankModel.getMenuRanking();
    res.status(200).json({ data: ranks });
  } catch (error) {
    console.error('[getFoodRank] error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
