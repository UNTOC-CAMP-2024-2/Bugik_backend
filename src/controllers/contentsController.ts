import {Request,Response} from 'express';
import OpenAI from "openai";
const { GoogleGenerativeAI } = require("@google/generative-ai");
import * as restaurantModel from '../models/restaurantModel';

const openai = new OpenAI({
    apiKey: process.env.CHATGPT_API_KEY,
  });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 일단 이쪽은 미완성으로 둬야하는데
// 스크랩핑이 아직 안되서, DB에 데이터가 없음 이슈
// 토큰 핸들링이라던가, 프롬프트 다루는 방법 등에 있어서 공부가 필요함.

export const getInfoFromChatgpt = async (req: Request, res: Response): Promise<any> => {
  try {
    // db에서 목록 가져오는 코드 추가하기
      const date = req.query.date as string;
    
      // 날짜 문자열 유효성 검사 (정확히 YYYY-MM-DD 형식인지 확인)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!date || !dateRegex.test(date)) {
        return res.status(400).json({ error: "Invalid or missing date format. Use YYYY-MM-DD." });
      }
      const rows = await restaurantModel.getAllMeals(date);
      // rows에 정보들 담겨있는데 출력해보시고, 어떻게 활용할지 다루시면됩니다.
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            { role: "system", content: "너는 오늘의 식당 추천 시스템이야. 현재 부산대학교에는 웅비 식당,자유 식당,진리 식당,금정회관 교직원 식당,금정회관 학생 식당,문창회관 식당,샛벌회관 식당,학생회관 교직원 식당,학생회관 학생 식당 이 있어. 내가 각 식당들의 메뉴 리스트를 줄테니, 너가 식당 한개를 추천해주고, 그이유를 작성해줘. 출력은 [추천한 식당] ~ [추천하는 이유] ~ 이런식으로 작성해줘." },
            {
                role: "user",
                content: "${data}", //나중에 추가
            },
        ],
    });
    res.status(200).json({  data: completion.choices[0].message.content });
  } catch (error) {
    console.error('[getRestaurantRank] error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getInfoFromGeminai = async (req: Request, res: Response): Promise<void> => {
    try {
        // db에서 목록 가져오는 코드 추가하기
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
        const prompt = "너는 오늘의 식당 추천 시스템이야. 현재 부산대학교에는 웅비 식당,자유 식당,진리 식당,금정회관 교직원 식당,금정회관 학생 식당,문창회관 식당,샛벌회관 식당,학생회관 교직원 식당,학생회관 학생 식당 이 있어. 내가 각 식당들의 메뉴 리스트를 줄테니, 너가 식당 한개를 추천해주고, 그이유를 작성해줘. 출력은 [추천한 식당] ~ [추천하는 이유] ~ 이런식으로 작성해줘."
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text(); 
        res.status(200).json({  data: text });
    } catch (error) {
      console.error('[getRestaurantRank] error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };