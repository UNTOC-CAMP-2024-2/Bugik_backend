import { Request, Response } from "express";
import OpenAI from "openai";
const { GoogleGenerativeAI } = require("@google/generative-ai");
import * as restaurantModel from "../models/restaurantModel";
import dotenv from 'dotenv';
import path from 'path';

const punycode = require('punycode');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });


//OpenAI 및 Google Generative AI 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ChatGPT를 이용한 식당 추천 함수
export const getInfoFromChatgpt = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Request received:", req.query);

    const date = req.query.date as string;

    // 날짜 유효성 검사 로그
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!date || !dateRegex.test(date)) {
      console.log("Invalid date format:", date);
      res.status(400).json({ error: "Invalid or missing date format. Use YYYY-MM-DD." });
      return;
    }

    // DB 호출 로그
    console.log("Fetching meals for date:", date);
    const rows = await restaurantModel.getAllMeals(date);
    console.log("Meals fetched:", rows);

    if (!rows || rows.length === 0) {
      console.log("No menu data found for date:", date);
      res.status(404).json({ error: "No menu data found for the specified date." });
      return;
    }

    // OpenAI 호출 로그
    console.log("Calling OpenAI API...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "너는 오늘의 식당 추천 시스템이야. ...",
        },
        {
          role: "user",
          content: JSON.stringify(rows),
        },
      ],
    });
    console.log("OpenAI response received:", completion);

    // 성공적으로 결과 반환
    res.status(200).json({ data: completion.choices[0].message?.content });
  } catch (error) {
    // 에러 로그
    console.error("[getInfoFromChatgpt] error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Google Generative AI를 이용한 식당 추천 함수
export const getInfoFromGemini = async (req: Request, res: Response): Promise<void> => {
  try {
    const date = req.query.date as string;

    // 날짜 문자열 유효성 검사 (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!date || !dateRegex.test(date)) {
      res.status(400).json({ error: "Invalid or missing date format. Use YYYY-MM-DD." });
      return;
    }

    // DB에서 해당 날짜의 식단 정보 가져오기
    const rows = await restaurantModel.getAllMeals(date);

    if (!rows || rows.length === 0) {
      res.status(404).json({ error: "No menu data found for the specified date." });
      return;
    }

    // Google Generative AI 프롬프트 작성 및 호출
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      너는 오늘의 식당 추천 시스템이야. 
      현재 부산대학교에는 웅비 식당, 자유 식당, 진리 식당, 금정회관 교직원 식당, 금정회관 학생 식당, 문창회관 식당, 샛벌회관 식당, 학생회관 교직원 식당, 학생회관 학생 식당이 있어. 
      내가 각 식당들의 메뉴 리스트를 줄 테니, 너가 식당 한 개를 추천해주고, 그 이유를 작성해줘. 출력은 [추천한 식당] ~ [추천하는 이유] ~ 이런 식으로 작성해줘.

      메뉴 리스트: ${JSON.stringify(rows)}
    `;

    const result = await model.generateContent(prompt);
    const text = await result.text();

    // Google Generative AI 결과 출력
    console.log("Gemini AI Response:", text);


    // Google Generative AI 결과 반환
    res.status(200).json({ data: text });
  } catch (error) {
    console.error("[getInfoFromGeminai] error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};